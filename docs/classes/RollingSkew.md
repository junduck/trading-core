[**@junduck/trading-core v2.5.2**](../README.md)

***

[@junduck/trading-core](../README.md) / RollingSkew

# Class: RollingSkew

Defined in: [rolling/moments.ts:97](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/rolling/moments.ts#L97)

O(1) rolling skewness.

## Accessors

### value

#### Get Signature

> **get** **value**(): `object`

Defined in: [rolling/moments.ts:101](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/rolling/moments.ts#L101)

##### Returns

`object`

###### mean

> **mean**: `number`

###### skew

> **skew**: `number`

###### variance

> **variance**: `number`

## Constructors

### Constructor

> **new RollingSkew**(`opts`): `RollingSkew`

Defined in: [rolling/moments.ts:106](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/rolling/moments.ts#L106)

#### Parameters

##### opts

###### period

`number`

#### Returns

`RollingSkew`

## Methods

### update()

> **update**(`x`): `object`

Defined in: [rolling/moments.ts:110](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/rolling/moments.ts#L110)

#### Parameters

##### x

`number`

#### Returns

`object`

##### mean

> **mean**: `number`

##### skew

> **skew**: `number`

##### variance

> **variance**: `number`
