[**@junduck/trading-core v2.5.2**](../README.md)

***

[@junduck/trading-core](../README.md) / createUniverse

# Function: createUniverse()

> **createUniverse**(`assets`, `timestamp?`): [`Universe`](../interfaces/Universe.md)

Defined in: [utils/market.utils.ts:19](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/utils/market.utils.ts#L19)

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
