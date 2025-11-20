[**@junduck/trading-core v2.1.1**](../README.md)

***

[@junduck/trading-core](../README.md) / Universe

# Interface: Universe

Defined in: [types/market.ts:8](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/types/market.ts#L8)

Defines the set of all available assets in the trading universe.
Used in backtesting to specify which assets are available for trading.

## Methods

### filterByCurrency()

> **filterByCurrency**(`currency`): [`Asset`](Asset.md)[]

Defined in: [types/market.ts:67](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/types/market.ts#L67)

Filter assets by currency.
If universe has a timestamp, only valid assets at that time are considered.

#### Parameters

##### currency

`string`

#### Returns

[`Asset`](Asset.md)[]

***

### filterByExchange()

> **filterByExchange**(`exchange`): [`Asset`](Asset.md)[]

Defined in: [types/market.ts:61](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/types/market.ts#L61)

Filter assets by exchange.
If universe has a timestamp, only valid assets at that time are considered.

#### Parameters

##### exchange

`string`

#### Returns

[`Asset`](Asset.md)[]

***

### filterByType()

> **filterByType**(`type`): [`Asset`](Asset.md)[]

Defined in: [types/market.ts:55](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/types/market.ts#L55)

Filter assets by type (e.g., "crypto", "stock", "forex").
If universe has a timestamp, only valid assets at that time are considered.

#### Parameters

##### type

`string`

#### Returns

[`Asset`](Asset.md)[]

***

### getCurrency()

> **getCurrency**(`symbol`): `string`

Defined in: [types/market.ts:49](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/types/market.ts#L49)

Get the currency of an asset by symbol.
Returns empty string if asset not found (useful for single-currency universes).

#### Parameters

##### symbol

`string`

#### Returns

`string`

***

### getExchange()

> **getExchange**(`symbol`): `string`

Defined in: [types/market.ts:43](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/types/market.ts#L43)

Get the exchange of an asset by symbol.
Returns empty string if asset not found.

#### Parameters

##### symbol

`string`

#### Returns

`string`

***

### getSymbols()

> **getSymbols**(): `string`[]

Defined in: [types/market.ts:31](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/types/market.ts#L31)

Get all symbols in the universe

#### Returns

`string`[]

***

### getType()

> **getType**(`symbol`): `string`

Defined in: [types/market.ts:37](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/types/market.ts#L37)

Get the type of an asset by symbol.
Returns empty string if asset not found.

#### Parameters

##### symbol

`string`

#### Returns

`string`

***

### getValidAssets()

> **getValidAssets**(`timestamp`): `Map`\<`string`, [`Asset`](Asset.md)\>

Defined in: [types/market.ts:21](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/types/market.ts#L21)

Get all assets that are valid at a specific timestamp.
An asset is valid if:
- validFrom is null/undefined OR timestamp >= validFrom
- validUntil is null/undefined OR timestamp <= validUntil

#### Parameters

##### timestamp

`Date`

#### Returns

`Map`\<`string`, [`Asset`](Asset.md)\>

***

### isAssetValid()

> **isAssetValid**(`symbol`, `timestamp`): `boolean`

Defined in: [types/market.ts:26](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/types/market.ts#L26)

Check if a specific asset is valid at a given timestamp

#### Parameters

##### symbol

`string`

##### timestamp

`Date`

#### Returns

`boolean`

## Properties

### assets

> **assets**: `Map`\<`string`, [`Asset`](Asset.md)\>

Defined in: [types/market.ts:10](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/types/market.ts#L10)

Set of asset symbols available for trading

***

### timestamp?

> `optional` **timestamp**: `Date`

Defined in: [types/market.ts:13](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/types/market.ts#L13)

Optional timestamp when this universe definition is valid
