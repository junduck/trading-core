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
import { createPortfolio } from "@junduck/trading-core";

const portfolio = createPortfolio({
  id: "my-portfolio",
  name: "我的交易组合",
  initialCash: { USD: 100000 }
});
```

### 开仓做多

```typescript
import { openLongPosition } from "@junduck/trading-core";
import type { Fill } from "@junduck/trading-core";

const fill: Fill = {
  symbol: "AAPL",
  quantity: 100,
  price: 150,
  commission: 1,
  timestamp: new Date()
};

openLongPosition(portfolio, "USD", fill);
```

### 平仓

```typescript
import { closeLongPosition } from "@junduck/trading-core";

const closeFill: Fill = {
  symbol: "AAPL",
  quantity: 50,
  price: 160,
  commission: 1,
  timestamp: new Date()
};

closeLongPosition(portfolio, "USD", closeFill, "FIFO");
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
  symbol: "AAPL",
  side: "BUY",
  effect: "OPEN",
  type: "MARKET",
  quantity: 100,
  timestamp: new Date()
};

const result = validateOrder(order, portfolio, "USD", snapshot);
if (!result.valid) {
  console.error(`订单无效: ${result.reason}`);
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

### Position 工具函数

- `openLongPosition()` - 开仓或加仓多头
- `closeLongPosition()` - 减仓或平仓多头
- `openShortPosition()` - 开仓或加仓空头
- `closeShortPosition()` - 减仓或平仓空头

### Portfolio 工具函数

- `createPortfolio()` - 创建新的投资组合
- `getOrCreatePosition()` - 获取或创建币种持仓
- `depositCash()` - 向投资组合存入现金
- `withdrawCash()` - 从投资组合提取现金

### Market 工具函数

- `appraisePosition()` - 计算持仓价值
- `appraisePortfolio()` - 计算跨币种投资组合价值
- `calculateUnrealizedPnL()` - 计算未实现盈亏
- `createUniverse()` - 创建可交易资产集合

### 订单验证

- `validateOrder()` - 在执行前验证订单
- `canOpenPosition()` - 检查是否可以开仓
- `canClosePosition()` - 检查是否可以平仓

### 公司行为

- `applyStockSplit()` - 对持仓应用股票拆分
- `applyCashDividend()` - 应用现金分红
- `applySpinoff()` - 应用分拆行为

## 示例：完整交易流程

```typescript
import {
  createPortfolio,
  openLongPosition,
  closeLongPosition,
  appraisePortfolio,
  calculateUnrealizedPnL,
  validateOrder
} from "@junduck/trading-core";

// 1. 创建初始现金的投资组合
const portfolio = createPortfolio({
  id: "backtest-1",
  name: "动量策略",
  initialCash: { USD: 100000 }
});

// 2. 验证并执行买入订单
const buyOrder = {
  symbol: "AAPL",
  side: "BUY",
  effect: "OPEN",
  type: "MARKET",
  quantity: 100,
  timestamp: new Date("2024-01-01")
};

const snapshot1 = {
  timestamp: new Date("2024-01-01"),
  price: new Map([["AAPL", 150]])
};

const validation = validateOrder(buyOrder, portfolio, "USD", snapshot1);
if (validation.valid) {
  const buyFill = {
    symbol: "AAPL",
    quantity: 100,
    price: 150,
    commission: 1,
    timestamp: new Date("2024-01-01")
  };
  openLongPosition(portfolio, "USD", buyFill);
}

// 3. 一段时间后检查投资组合价值
const snapshot2 = {
  timestamp: new Date("2024-02-01"),
  price: new Map([["AAPL", 160]])
};

const position = portfolio.positions.get("USD")!;
const unrealizedPnL = calculateUnrealizedPnL(position, snapshot2);
const totalValue = appraisePortfolio(portfolio, snapshot2).get("USD")!;

console.log(`未实现盈亏: $${unrealizedPnL}`);
console.log(`总价值: $${totalValue}`);

// 4. 平仓
const sellFill = {
  symbol: "AAPL",
  quantity: 100,
  price: 160,
  commission: 1,
  timestamp: new Date("2024-02-01")
};
closeLongPosition(portfolio, "USD", sellFill, "FIFO");

console.log(`已实现盈亏: $${position.realisedPnL}`);
```

## 测试

```bash
npm test                # 运行所有测试
npm run test:watch      # 监视模式
npm run test:ui         # UI 模式
npm run test:coverage   # 覆盖率报告
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
