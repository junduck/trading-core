[**@junduck/trading-core v2.5.2**](../README.md)

***

[@junduck/trading-core](../README.md) / handleCashDividend

# Function: handleCashDividend()

> **handleCashDividend**(`pos`, `symbol`, `amountPerShare`, `taxRate`, `time?`): `number`

Defined in: [utils/stock.utils.ts:76](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/utils/stock.utils.ts#L76)

Handles a cash dividend payment by adjusting cost basis and cash balance.

## Parameters

### pos

[`Position`](../interfaces/Position.md)

The position to modify

### symbol

`string`

The asset symbol paying the dividend

### amountPerShare

`number`

The dividend amount per share

### taxRate

`number` = `0`

The tax rate applied to the dividend (default: 0)

### time?

`Date`

The transaction time (default: current date)

## Returns

`number`

The net cash flow after tax (positive for long, negative for short)

## Throws

Error if the dividend amount is negative or tax rate is not between 0 and 1
