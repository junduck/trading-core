[**@junduck/trading-core v2.5.2**](../README.md)

***

[@junduck/trading-core](../README.md) / fillOrder

# Function: fillOrder()

> **fillOrder**(`opts`): [`Fill`](../type-aliases/Fill.md)

Defined in: [utils/fill.utils.ts:22](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/utils/fill.utils.ts#L22)

Fills an order (fully or partially) and returns the fill receipt.

## Parameters

### opts

Fill options including state to update and fill details

#### commission?

`number`

#### created?

`Date`

#### id?

`string`

#### price

`number`

#### quant

`number`

#### state

[`OrderState`](../type-aliases/OrderState.md)

## Returns

[`Fill`](../type-aliases/Fill.md)

Fill receipt for the matched quantity
