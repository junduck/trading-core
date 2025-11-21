[**@junduck/trading-core v2.2.0**](../README.md)

***

[@junduck/trading-core](../README.md) / isAssetValidAt

# Function: isAssetValidAt()

> **isAssetValidAt**(`asset`, `timestamp`): `boolean`

Defined in: [utils/market.utils.ts:193](https://github.com/junduck/trading-core/blob/b03088bd0ee00897e0cf49496dd81d343e43bb66/src/utils/market.utils.ts#L193)

Checks if an asset is valid at a given timestamp.
An asset is valid if:
- validFrom is null/undefined OR timestamp >= validFrom
- validUntil is null/undefined OR timestamp <= validUntil

## Parameters

### asset

[`Asset`](../interfaces/Asset.md)

The asset to check

### timestamp

`Date`

The timestamp to check validity against

## Returns

`boolean`

true if the asset is valid at the given timestamp
