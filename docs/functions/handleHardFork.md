[**@junduck/trading-core v2.2.0**](../README.md)

***

[@junduck/trading-core](../README.md) / handleHardFork

# Function: handleHardFork()

> **handleHardFork**(`pos`, `symbol`, `newSymbol`, `ratio`, `time?`, `disableLot?`): `void`

Defined in: [utils/crypto.utils.ts:24](https://github.com/junduck/trading-core/blob/b03088bd0ee00897e0cf49496dd81d343e43bb66/src/utils/crypto.utils.ts#L24)

Handles a hard fork by creating positions in the new cryptocurrency.

## Parameters

### pos

[`Position`](../interfaces/Position.md)

The position to modify

### symbol

`string`

The original cryptocurrency symbol

### newSymbol

`string`

The forked cryptocurrency symbol

### ratio

`number` = `1`

The number of new coins per original coin (default: 1)

### time?

`Date`

The transaction time (default: current date)

### disableLot?

`boolean`

If true, merges into single lot instead of tracking separate lots (default: false)

## Returns

`void`

## Throws

Error if the hard fork ratio is not positive
