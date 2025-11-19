# trading-core

现货交易记账、回测和算法交易的基础数据结构和工具库。

## 功能说明

本库为交易系统提供全面的基础模块，涵盖两大领域：

### 1. 交易记账

- **持仓跟踪** - 多头和空头持仓，支持批次级别的会计核算（FIFO/LIFO）
- **投资组合管理** - 多币种持仓，支持公司行为处理
- **订单验证** - 执行前订单检查
- **投资组合估值** - 实时价值和盈亏计算
- **市场数据** - 价格快照、报价和K线
- **公司行为** - 股票拆分、分红、分拆、合并、硬分叉、空投

### 2. 算法基础

- **数据结构** - CircularBuffer、Deque、PriorityQueue、RBTree
- **在线统计** - O(1) 累积均值、方差、协方差、相关性、贝塔、偏度、峰度
- **滚动统计** - 滑动窗口 SMA、EMA、EWMA、方差、z分数（O(1)）、最值（O(1)）、中位数/分位数（O(n)）
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

### 记账：创建投资组合

```typescript
import { pu } from "@junduck/trading-core";

// 创建投资组合
const portfolio = pu.create("my-portfolio", "我的交易组合");

// 初始化 USD 持仓及现金
pu.createPosition(portfolio, "USD", 100000);
```

### 记账：开仓做多

```typescript
import { pu } from "@junduck/trading-core";
import type { Asset } from "@junduck/trading-core";

const asset: Asset = {
  symbol: "AAPL",
  currency: "USD"
};

pu.openLong(portfolio, asset, 150, 100, 1);
```

### 记账：平仓

```typescript
import { pu } from "@junduck/trading-core";

pu.closeLong(portfolio, asset, 160, 50, 1, "FIFO");
```

### 计算投资组合价值

```typescript
import { appraisePortfolio } from "@junduck/trading-core";
import type { MarketSnapshot } from "@junduck/trading-core";

const snapshot: MarketSnapshot = {
  timestamp: new Date(),
  price: new Map([
    ["AAPL", 155],
    ["TSLA", 200]
  ])
};

const values = appraisePortfolio(portfolio, snapshot);
console.log(`USD 投资组合价值: $${values.get("USD")}`);
```

### 计算未实现盈亏

```typescript
import { calculateUnrealizedPnL } from "@junduck/trading-core";

const position = portfolio.positions.get("USD")!;
const unrealizedPnL = calculateUnrealizedPnL(position, snapshot);
console.log(`未实现盈亏: $${unrealizedPnL}`);
```

### 记账：验证订单

```typescript
import { validateOrder } from "@junduck/trading-core";
import type { Order } from "@junduck/trading-core";

const order: Order = {
  id: "order-1",
  symbol: "AAPL",
  side: "BUY",
  effect: "OPEN_LONG",
  type: "MARKET",
  quantity: 100,
  created: new Date()
};

const position = portfolio.positions.get("USD")!;
const result = validateOrder(order, position, snapshot);
if (!result.valid) {
  console.error(`订单无效: ${result.error?.type}`);
}
```

### 算法：滚动窗口统计

```typescript
import { SMA, EMA, RollingStddev } from "@junduck/trading-core";

// 简单移动平均
const sma = new SMA({ period: 20 });
sma.update(100); // 返回 100
sma.update(102); // 返回 101

// 指数移动平均
const ema = new EMA({ period: 12 });
ema.update(100);
ema.update(105);

// 滚动标准差
const std = new RollingStddev({ period: 20 });
const { mean, stddev } = std.update(100);
```

### 算法：在线统计

```typescript
import { CMA, CuVar, CuCorr } from "@junduck/trading-core";

// 累积移动平均
const cma = new CMA();
cma.update(100); // 返回 100
cma.update(200); // 返回 150

// 累积方差
const variance = new CuVar({ ddof: 1 });
const { mean, variance: v } = variance.update(100);

// 累积相关性
const corr = new CuCorr();
const { corr: correlation } = corr.update(100, 200);
```

### 算法：性能指标

```typescript
import { CircularBuffer, maxDrawDown, maxRelDrawDown } from "@junduck/trading-core";

const equity = new CircularBuffer<number>(1000);
equity.push(100000);
equity.push(105000);
equity.push(102000);
equity.push(108000);

const mdd = maxDrawDown(equity);        // 绝对回撤
const relMdd = maxRelDrawDown(equity);  // 百分比回撤
```

## 核心数据结构

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

### Fill 工具函数

- `applyFill(position, fill, closeStrategy?)` - 对持仓应用单个成交
- `applyFills(position, fills, closeStrategy?)` - 顺序应用多个成交

### 订单验证

- `validateOrder(order, position, snapshot)` - 验证订单是否符合持仓和市场状态

## 示例：完整交易流程

```typescript
import {
  pu,
  appraisePortfolio,
  calculateUnrealizedPnL,
  validateOrder
} from "@junduck/trading-core";
import type { Asset, Order, MarketSnapshot } from "@junduck/trading-core";

// 1. 创建初始现金的投资组合
const portfolio = pu.create("backtest-1", "动量策略");
pu.createPosition(portfolio, "USD", 100000);

// 2. 定义资产和市场数据
const aapl: Asset = { symbol: "AAPL", currency: "USD" };

const snapshot1: MarketSnapshot = {
  timestamp: new Date("2024-01-01"),
  price: new Map([["AAPL", 150]])
};

// 3. 验证并执行买入订单
const buyOrder: Order = {
  id: "order-1",
  symbol: "AAPL",
  side: "BUY",
  effect: "OPEN_LONG",
  type: "MARKET",
  quantity: 100,
  created: new Date("2024-01-01")
};

const usdPos = portfolio.positions.get("USD")!;
const validation = validateOrder(buyOrder, usdPos, snapshot1);
if (validation.valid) {
  pu.openLong(portfolio, aapl, 150, 100, 1);
}

// 4. 一段时间后检查投资组合价值
const snapshot2: MarketSnapshot = {
  timestamp: new Date("2024-02-01"),
  price: new Map([["AAPL", 160]])
};

const position = portfolio.positions.get("USD")!;
const unrealizedPnL = calculateUnrealizedPnL(position, snapshot2);
const totalValue = appraisePortfolio(portfolio, snapshot2).get("USD")!;

console.log(`未实现盈亏: $${unrealizedPnL}`);
console.log(`总价值: $${totalValue}`);

// 5. 平仓
pu.closeLong(portfolio, aapl, 160, 100, 1, "FIFO");

console.log(`已实现盈亏: $${position.realisedPnL}`);
```

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
