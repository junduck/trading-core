# trading-core

现货交易记账、回测和算法交易的基础数据结构和工具库。

## 功能说明

本库为交易系统提供全面的基础模块，涵盖两大领域：

### 1. 交易记账

- **持仓跟踪** - 多头和空头持仓，支持批次级别的会计核算（FIFO/LIFO）
- **投资组合管理** - 多币种持仓，支持公司行为处理
- **订单管理** - 完整的订单生命周期跟踪
- **投资组合估值** - 实时价值和盈亏计算
- **市场数据** - 价格快照、报价和K线
- **公司行为** - 股票拆分、分红、分拆、合并、硬分叉、空投

### 2. 算法基础

- **数据结构** - CircularBuffer、Deque、PriorityQueue、RBTree
- **在线统计** - O(1) 累积均值、方差、协方差、相关性、贝塔、偏度、峰度
- **滚动统计** - 滑动窗口 SMA、EMA、EWMA、方差、z分数（O(1)）、最值（O(1)）、中位数/分位数（O(n)）
- **数值工具** - 基于数组的统计（均值、方差、相关性）、序列变换（收益率、滞后/超前、缩尾）、排序（argsort、spearman）
- **概率结构** - CountMinSketch、BloomFilter
- **性能指标** - 回撤/反弹计算，使用 Kahan 求和保证数值稳定性

## 不包含的功能

本库提供基础组件，而非完整系统。不包括：

- 策略引擎或信号生成
- 撮合引擎或券商模拟器
- 回测框架或事件循环
- 数据获取或存储
- 图表或可视化

## 安装

```bash
npm install @junduck/trading-core
```

## 快速开始

本库支持两种管理持仓的方式，取决于您的需求：

### 记账方式 1：直接持仓操作

适用于已有成交价格和数量的简单工作流。适合回测、导入交易记录和简单的投资组合跟踪。

```text
createPosition() → Position(初始现金)
   |
   |-- openLong/closeLong/openShort/closeShort() → Position 更新
   |
   |-- 市场条件更新
   |
   |-- appraisePosition/appraisePortfolio() → 投资组合价值
```

```typescript
import { createPosition, openLong, closeLong, appraisePosition } from "@junduck/trading-core";

const position = createPosition(100_000);
openLong(position, "BTC", 50_000, 10, 10);
closeLong(position, "BTC", 55_000, 5, 10, "FIFO");

// 市场更新
const snapshot = { price: new Map([["BTC", 52_000]]), timestamp: new Date() };
const value = appraisePosition(position, snapshot);
```

### 记账方式 2：订单抽象

适用于需要订单生命周期管理的真实交易。适合订单簿模拟、部分成交和订单状态跟踪。

```text
Order (交易意图)
   |
   |-- validateOrder() --> 无效 → rejectOrder() → OrderState(REJECT)
   |
   |-- validateOrder() --> 有效 → acceptOrder() → OrderState(OPEN)
                                         |
                                         |-- fillOrder() → Fill + OrderState(PARTIAL/FILLED)
                                         |        |
                                         |        v
                                         |   processFill() → Position 更新
                                         |
                                         |-- cancelOrder() → OrderState(CANCELLED)
```

```typescript
import { buyOrder, acceptOrder, fillOrder, processFill } from "@junduck/trading-core";

const order = buyOrder({ symbol: "BTC", quant: 10, price: 50_000 });
const orderState = acceptOrder(order);

const fill = fillOrder({ state: orderState, quant: 5, price: 50_000, commission: 10 });
const effect = processFill(position, fill);  // 更新持仓

// 部分成交: orderState.status === "PARTIAL"
cancelOrder(orderState);  // 取消剩余部分
```

**使用场景：**

- **直接操作**：使用完整数据的回测、导入历史交易、简单场景
- **订单抽象**：订单簿模拟、部分成交、真实订单生命周期、复杂系统

两种方式都更新相同的 `Position` 结构，可以根据需要混合使用。

### 在线统计：O(1) 实时计算

对于流式数据场景，使用在线统计进行增量更新，复杂度为 O(1)：

```text
创建实例 → 新数据到达 → update(x) → 返回新值 + 内部状态更新
```

```typescript
import { CMA, CuVar, RollingMax, EWMA } from "@junduck/trading-core";

// 创建统计跟踪器
const priceAvg = new CMA();
const priceVar = new CuVar();
const rolling5High = new RollingMax(5);
const ewma = new EWMA(0.1);

// WebSocket 示例：每次行情更新时更新
websocket.on('message', (data) => {
  const price = data.price;

  const mean = priceAvg.update(price);        // 累积均值
  const variance = priceVar.update(price);    // 累积方差
  const high5 = rolling5High.update(price);   // 5 周期最高价
  const smoothed = ewma.update(price);        // 指数加权移动平均

  console.log({ mean, variance, high5, smoothed });
});
```

**使用场景：**

- **实时监控**：跟踪实时市场统计而无需存储历史数据
- **内存效率**：无论数据量多大，空间复杂度均为 O(1)
- **流处理**：对连续数据流计算指标
- **高频交易**：适合逐笔处理的快速更新

### 循环缓冲区：固定大小滑动窗口

固定大小缓冲区，自动覆盖旧数据 - 非常适合滑动窗口而无需手动清理：

```typescript
import { CircularBuffer } from "@junduck/trading-core";

const lastPrices = new CircularBuffer<number>(3);

lastPrices.push(100);  // [100]
lastPrices.push(102);  // [100, 102]
lastPrices.push(101);  // [100, 102, 101]
lastPrices.push(103);  // [102, 101, 103] - 覆盖最旧的 (100)

console.log(lastPrices.toArray());  // [102, 101, 103]
console.log(lastPrices.size());     // 3
```

**覆盖行为是有意设计且有用的：**

- 无需手动删除旧元素
- 滑动窗口的恒定内存使用
- 非常适合最近 N 个行情的场景
- 适合在流式上下文中维护最近历史记录

### 优先队列：买卖盘订单簿

基于最小堆的实现，用于限价订单簿的高效订单匹配：

```typescript
import { PriorityQueue } from "@junduck/trading-core";

type Order = { price: number; size: number; id: string };

// 买盘队列：买家（最高价格优先）
const bids = new PriorityQueue<Order>((a, b) => b.price - a.price);

// 卖盘队列：卖家（最低价格优先）
const asks = new PriorityQueue<Order>((a, b) => a.price - b.price);

// 做市商下单
bids.push({ price: 50000, size: 2, id: "B1" });
bids.push({ price: 50100, size: 1, id: "B2" });  // 更好的买价
bids.push({ price: 49900, size: 5, id: "B3" });

asks.push({ price: 50200, size: 1, id: "A1" });
asks.push({ price: 50150, size: 2, id: "A2" });  // 更好的卖价
asks.push({ price: 50300, size: 3, id: "A3" });

// 查看最佳买卖价（盘口）
console.log(bids.peek());  // { price: 50100, size: 1, id: "B2" } - 最高买价
console.log(asks.peek());  // { price: 50150, size: 2, id: "A2" } - 最低卖价

// 市价单到达：匹配最佳价格
const bestBid = bids.pop();
const bestAsk = asks.pop();

console.log(`价差: ${bestAsk.price - bestBid.price}`);  // 50
```

**使用场景：**

- 限价订单簿实现
- 最佳买卖价跟踪
- 订单匹配引擎
- 按时间戳的事件调度

## 核心数据结构

### 记账结构

**Position（持仓）** - 表示一个币种账户：

- 现金余额
- 多头持仓（符号 → LongPosition 的映射）
- 空头持仓（符号 → ShortPosition 的映射）
- 已实现盈亏和佣金跟踪

**Portfolio（投资组合）** - 多币种投资组合：

- 币种 → Position 的映射
- 投资组合元数据（id、name、timestamps）

**Order 和 Fill：**

- **Order**：交易意图（BUY/SELL 配合 OPEN/CLOSE 效果）
- **Fill**：实际成交记录（价格、数量、佣金）

**Market Data（市场数据）：**

- **MarketSnapshot**：某时刻的市场价格快照
- **MarketQuote**：买卖报价
- **MarketBar**：OHLCV K线
- **Universe**：可交易资产集合

### 算法基础

**容器：**

- `CircularBuffer<T>` - 固定大小循环缓冲区，O(1) push/pop
- `Deque<T>` - 双端队列
- `PriorityQueue<T>` - 基于最小堆的优先队列
- `RBTree<T>` - 红黑树，用于有序操作

**在线统计（累积）：**

- `CMA` - 累积移动平均
- `CuVar`、`CuStddev` - 方差和标准差
- `CuCov`、`CuCorr`、`CuBeta` - 协方差、相关性、贝塔
- `CuSkew`、`CuKurt` - 偏度和峰度
- `CuHistogram` - 动态直方图

**滚动窗口统计：**

- `SMA`、`EMA`、`EWMA` - 移动平均
- `RollingVar`、`RollingStddev` - 方差和标准差
- `RollingVarEW`、`RollingStddevEW` - 指数加权变体
- `RollingZScore`、`RollingZScoreEW` - 标准化分数
- `RollingCov`、`RollingCorr`、`RollingBeta` - 协方差、相关性、贝塔
- `RollingMin`、`RollingMax`、`RollingMinMax` - 极值跟踪
- `RollingArgMin`、`RollingArgMax` - 带索引的极值
- `RollingMedian`、`RollingQuantile` - 顺序统计（使用 QuickSelect 的 O(n)）
- `RollingSkew`、`RollingKurt` - 高阶矩
- `RollingHistogram` - 滚动直方图

**概率结构：**

- `CountMinSketch` - 节省空间的频率估计
- `BloomFilter` - 概率集合成员判断

**工具函数：**

- `Kahan` - 数值稳定的求和
- `SmoothedAccum` - 指数平滑
- `maxDrawDown()`、`maxRelDrawDown()` - 回撤指标
- `maxDrawUp()`、`maxRelDrawUp()` - 反弹指标
- `exp_factor()`、`wilders_factor()` - 平滑因子

**数值工具（基于数组）：**

- `sum`、`min`、`max`、`argmin`、`argmax` - 数组聚合
- `mean`、`variance`、`stddev`、`skew`、`kurt` - 描述性统计
- `cov`、`corr`、`spearman` - 相关性度量
- `median`、`quantile` - 顺序统计
- `cumsum`、`diff`、`pctChange`、`returns`、`logReturns` - 序列变换
- `norm`、`lag`、`lead`、`coalesce`、`locf`、`winsorize` - 数据预处理
- `argsort`、`rank` - 排序工具
- `gcd`、`lcm`、`lerp`、`clamp` - 数学工具

## API 参考

### Portfolio 工具函数

所有投资组合工具函数都在 `pu` 命名空间下，以避免与持仓级别的工具函数命名冲突（两者都有 `openLong`、`closeLong`、`openShort`、`closeShort` 函数）。

**投资组合管理：**

- `pu.create(id, name)` - 创建新的投资组合
- `pu.createPosition(portfolio, currency, initialCash?, time?)` - 在投资组合中创建持仓
- `pu.getPosition(portfolio, currency)` - 获取指定币种的持仓
- `pu.getCash(portfolio, currency)` - 获取指定币种的现金余额
- `pu.getCurrencies(portfolio)` - 获取投资组合中的所有币种代码
- `pu.getAllSymbols(portfolio)` - 获取按币种组织的所有符号
- `pu.hasAsset(portfolio, asset)` - 检查资产是否存在于投资组合中

**交易（投资组合级别）：**

- `pu.openLong(portfolio, asset, price, quantity, commission?, time?)` - 开仓或加仓多头
- `pu.closeLong(portfolio, asset, price, quantity, commission?, strategy?, time?)` - 平仓多头
- `pu.openShort(portfolio, asset, price, quantity, commission?, time?)` - 开仓或加仓空头
- `pu.closeShort(portfolio, asset, price, quantity, commission?, strategy?, time?)` - 平仓空头

**公司行为（投资组合级别）：**

- `pu.handleSplit(portfolio, asset, ratio, time?)` - 处理股票拆分
- `pu.handleCashDividend(portfolio, asset, amountPerShare, taxRate?, time?)` - 处理现金分红
- `pu.handleSpinoff(portfolio, asset, newSymbol, ratio, time?)` - 处理分拆
- `pu.handleMerger(portfolio, asset, newSymbol, ratio, cashComponent?, time?)` - 处理合并

**加密货币行为（投资组合级别）：**

- `pu.handleHardFork(portfolio, asset, newSymbol, ratio?, time?)` - 处理硬分叉
- `pu.handleAirdrop(portfolio, currency, holderSymbol, airdropSymbol, amountPerToken?, fixedAmount?, time?)` - 处理空投
- `pu.handleTokenSwap(portfolio, asset, newSymbol, ratio?, time?)` - 处理代币交换
- `pu.handleStakingReward(portfolio, asset, rewardPerToken, time?)` - 处理质押奖励

### Position 工具函数

持仓级别的函数（直接导出）：

- `createPosition(initialCash?, time?)` - 创建 Position 对象
- `openLong(pos, symbol, price, quantity, commission?, time?)` - 开仓或加仓多头
- `closeLong(pos, symbol, price, quantity, commission?, strategy?, time?)` - 平仓多头
- `openShort(pos, symbol, price, quantity, commission?, time?)` - 开仓或加仓空头
- `closeShort(pos, symbol, price, quantity, commission?, strategy?, time?)` - 平仓空头
- `validatePosition(pos)` - 验证持仓完整性

### Market 工具函数

- `createUniverse(assets, timestamp?)` - 创建具有过滤功能的资产集合
- `appraisePosition(position, snapshot)` - 计算持仓总价值
- `appraisePortfolio(portfolio, snapshot)` - 计算跨币种投资组合价值
- `calculateUnrealizedPnL(position, snapshot)` - 计算未实现盈亏
- `isAssetValidAt(asset, timestamp)` - 检查资产在指定时间是否有效

### Order 工具函数

**订单创建：**

- `buyOrder(opts)` - 创建 BUY 订单以开多头仓位
- `sellOrder(opts)` - 创建 SELL 订单以平多头仓位
- `shortOrder(opts)` - 创建 SELL 订单以开空头仓位
- `coverOrder(opts)` - 创建 BUY 订单以平空头仓位（回补）

**订单生命周期：**

- `acceptOrder(order, time?)` - 接受订单并创建状态为 "OPEN" 的 OrderState
- `rejectOrder(order, time?)` - 拒绝订单并创建状态为 "REJECT" 的 OrderState
- `cancelOrder(state, time?)` - 通过更新状态为 "CANCELLED" 来取消活动订单

**订单验证：**

- `validateOrder(order, position, snapshot)` - 验证订单是否符合持仓和市场状态

### Fill 工具函数

- `fillOrder(opts)` - 成交订单并创建 Fill 回执，更新 OrderState
- `processFill(position, fill, closeStrategy?)` - 处理成交以更新持仓
- `applyFill(position, fill, closeStrategy?)` - （已弃用）对持仓应用单个成交
- `applyFills(position, fills, closeStrategy?)` - （已弃用）顺序应用多个成交

## 测试

```bash
npm test                # 运行所有测试
npm run test:watch      # 监视模式
npm run test:ui         # UI 模式
npm run test:coverage   # 覆盖率报告
```

## 运行示例

```bash
npm run examples        # 运行所有 README 示例
```

## 构建

```bash
npm run build           # 构建到 dist/
npm run dev             # 监视模式
npm run typecheck       # 仅类型检查
```

## 许可证

MIT

## 致谢

文档和核心实现由 Claude (Anthropic) 协助完成。
