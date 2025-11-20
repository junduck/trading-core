[**@junduck/trading-core v2.1.1**](../README.md)

***

[@junduck/trading-core](../README.md) / portfolioOpenShort

# Function: portfolioOpenShort()

> **portfolioOpenShort**(`portfolio`, `asset`, `price`, `quantity`, `commission`, `time?`): `number`

Defined in: [utils/portfolio.utils.ts:231](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/utils/portfolio.utils.ts#L231)

Opens a short position by borrowing and selling an asset. Mutates portfolio.

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

### time?

`Date`

## Returns

`number`
