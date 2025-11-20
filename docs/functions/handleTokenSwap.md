[**@junduck/trading-core v2.1.1**](../README.md)

***

[@junduck/trading-core](../README.md) / handleTokenSwap

# Function: handleTokenSwap()

> **handleTokenSwap**(`pos`, `oldSymbol`, `newSymbol`, `ratio`, `time?`, `disableLot?`): `void`

Defined in: [utils/crypto.utils.ts:162](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/utils/crypto.utils.ts#L162)

Handles a token swap/migration by exchanging positions from old to new token.

## Parameters

### pos

[`Position`](../interfaces/Position.md)

The position to modify

### oldSymbol

`string`

The old token symbol

### newSymbol

`string`

The new token symbol

### ratio

`number` = `1`

The exchange ratio of new tokens per old token (default: 1)

### time?

`Date`

The transaction time (default: current date)

### disableLot?

`boolean`

If true, merges into single lot instead of tracking separate lots (default: false)

## Returns

`void`

## Throws

Error if the swap ratio is not positive
