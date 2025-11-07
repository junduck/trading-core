# trading-core

现货交易记账和回测的基础数据结构和工具库。

## 功能说明

本库提供交易持仓跟踪和投资组合价值计算的基础模块，包括：

- **持仓跟踪** - 跟踪多头和空头持仓，支持批次级别的会计核算（FIFO/LIFO）
- **投资组合管理** - 管理多币种的持仓
- **订单验证** - 在执行前检查订单是否有效
- **投资组合估值** - 计算当前投资组合价值和未实现盈亏
- **市场数据** - 表示市场价格、报价和K线
- **公司行为** - 处理股票拆分、分红和分拆

## 不包含的功能

本库只专注于记账功能，不包括：

- 策略引擎或信号生成
- 撮合引擎或券商模拟器
- 回测框架或事件循环
- 数据获取或存储

## 安装

```bash
npm install @junduck/trading-core
```

## 快速开始

### 创建投资组合

```typescript
import { pu } from "@junduck/trading-core";

// 创建投资组合
const portfolio = pu.create("my-portfolio", "我的交易组合");

// 初始化 USD 持仓及现金
portfolio.positions.set("USD", pu.createPosition(100000));
```

### 开仓做多

```typescript
import { pu } from "@junduck/trading-core";
import type { Asset } from "@junduck/trading-core";

const asset: Asset = {
  symbol: "AAPL",
  currency: "USD"
};

pu.openLong(portfolio, asset, 150, 100, 1);
```

### 平仓

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

### 验证订单

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

## 核心数据结构

### Position（持仓）

表示一个币种账户，包含：
- 现金余额
- 多头持仓（符号 → LongPosition 的映射）
- 空头持仓（符号 → ShortPosition 的映射）
- 已实现盈亏和佣金跟踪

### Portfolio（投资组合）

多币种投资组合，包含：
- 币种 → Position 的映射
- 投资组合元数据（id、name、timestamps）

### Order 和 Fill（订单和成交）

- **Order**：交易意图（BUY/SELL 配合 OPEN/CLOSE 效果）
- **Fill**：实际成交记录（价格、数量、佣金）

### Market Data（市场数据）

- **MarketSnapshot**：某时刻的市场价格快照
- **MarketQuote**：买卖报价
- **MarketBar**：OHLCV K线
- **Universe**：可交易资产集合

## API 参考

### Portfolio 工具函数

所有投资组合工具函数都在 `pu` 命名空间下，以避免与持仓级别的工具函数命名冲突（两者都有 `openLong`、`closeLong`、`openShort`、`closeShort` 函数）。

**投资组合管理：**

- `pu.create(id, name)` - 创建新的投资组合
- `pu.createPosition(initialCash?, time?)` - 创建新的持仓并指定初始现金
- `pu.getPosition(portfolio, currency)` - 获取指定币种的持仓
- `pu.getCash(portfolio, currency)` - 获取指定币种的现金余额
- `pu.getCurrencies(portfolio)` - 获取投资组合中的所有币种代码
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

持仓级别的交易函数（直接导出）：

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
portfolio.positions.set("USD", pu.createPosition(100000));

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
