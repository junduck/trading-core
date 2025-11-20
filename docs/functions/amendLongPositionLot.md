[**@junduck/trading-core v2.1.1**](../README.md)

***

[@junduck/trading-core](../README.md) / amendLongPositionLot

# Function: amendLongPositionLot()

> **amendLongPositionLot**(`to`, `symbol`, `newLot`, `time`): `void`

Defined in: [utils/position.utils.ts:95](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/utils/position.utils.ts#L95)

Amend a LongPositionLot by merging into a single lot (for providers without lot-level accounting).
Creates a new position if none exists, otherwise merges the new lot into the existing single lot.

## Parameters

### to

[`Position`](../interfaces/Position.md)

The position to modify

### symbol

`string`

The asset symbol

### newLot

[`LongPositionLot`](../interfaces/LongPositionLot.md)

The new LongPositionLot to merge

### time

`Date`

The transaction time

## Returns

`void`
