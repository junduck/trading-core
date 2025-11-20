[**@junduck/trading-core v2.1.1**](../README.md)

***

[@junduck/trading-core](../README.md) / portfolioCloseLong

# Function: portfolioCloseLong()

> **portfolioCloseLong**(`portfolio`, `asset`, `price`, `quantity`, `commission`, `strategy`, `time?`): `number`

Defined in: [utils/portfolio.utils.ts:199](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/utils/portfolio.utils.ts#L199)

Closes a long position by selling an asset. Mutates portfolio.

## Parameters

### portfolio

[`Portfolio`](../interfaces/Portfolio.md)

### asset

[`Asset`](../interfaces/Asset.md)

### price

`number`

### quantity

`number`

### commission

`number` = `0`

### strategy

[`CloseStrategy`](../type-aliases/CloseStrategy.md) = `"FIFO"`

### time?

`Date`

## Returns

`number`
