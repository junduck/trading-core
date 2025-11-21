[**@junduck/trading-core v2.2.0**](../README.md)

***

[@junduck/trading-core](../README.md) / createUniverse

# Function: createUniverse()

> **createUniverse**(`assets`, `timestamp?`): [`Universe`](../interfaces/Universe.md)

Defined in: [utils/market.utils.ts:19](https://github.com/junduck/trading-core/blob/b03088bd0ee00897e0cf49496dd81d343e43bb66/src/utils/market.utils.ts#L19)

Creates a Universe implementation with filtering capabilities.

## Parameters

### assets

`Map`\<`string`, [`Asset`](../interfaces/Asset.md)\>

Map of symbol to Asset

### timestamp?

`Date`

Optional timestamp when this universe is valid

## Returns

[`Universe`](../interfaces/Universe.md)

A Universe object with all filtering methods implemented
