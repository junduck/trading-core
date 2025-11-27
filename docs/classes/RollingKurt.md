[**@junduck/trading-core v2.5.2**](../README.md)

***

[@junduck/trading-core](../README.md) / RollingKurt

# Class: RollingKurt

Defined in: [rolling/moments.ts:121](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/rolling/moments.ts#L121)

O(1) rolling kurtosis.

## Accessors

### value

#### Get Signature

> **get** **value**(): `object`

Defined in: [rolling/moments.ts:126](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/rolling/moments.ts#L126)

##### Returns

`object`

###### kurt

> **kurt**: `number`

###### mean

> **mean**: `number`

###### skew

> **skew**: `number`

###### variance

> **variance**: `number`

## Constructors

### Constructor

> **new RollingKurt**(`opts`): `RollingKurt`

Defined in: [rolling/moments.ts:131](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/rolling/moments.ts#L131)

#### Parameters

##### opts

###### period

`number`

#### Returns

`RollingKurt`

## Methods

### update()

> **update**(`x`): `object`

Defined in: [rolling/moments.ts:135](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/rolling/moments.ts#L135)

#### Parameters

##### x

`number`

#### Returns

`object`

##### kurt

> **kurt**: `number`

##### mean

> **mean**: `number`

##### skew

> **skew**: `number`

##### variance

> **variance**: `number`
