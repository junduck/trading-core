[**@junduck/trading-core v2.5.2**](../README.md)

***

[@junduck/trading-core](../README.md) / RollingArgMin

# Class: RollingArgMin

Defined in: [rolling/minmax.ts:141](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/rolling/minmax.ts#L141)

Rolling minimum with position tracking over a sliding window.
Returns both minimum value and its index within the window (0 = oldest).
O(1) amortized time per update.

## Accessors

### value

#### Get Signature

> **get** **value**(): `object`

Defined in: [rolling/minmax.ts:147](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/rolling/minmax.ts#L147)

##### Returns

`object`

###### pos

> **pos**: `number`

###### val

> **val**: `number`

## Constructors

### Constructor

> **new RollingArgMin**(`opts`): `RollingArgMin`

Defined in: [rolling/minmax.ts:155](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/rolling/minmax.ts#L155)

#### Parameters

##### opts

###### period

`number`

#### Returns

`RollingArgMin`

## Methods

### update()

> **update**(`x`): `object`

Defined in: [rolling/minmax.ts:162](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/rolling/minmax.ts#L162)

#### Parameters

##### x

`number`

#### Returns

`object`

##### pos

> **pos**: `number`

##### val

> **val**: `number`

## Properties

### buffer

> `readonly` **buffer**: [`CircularBuffer`](CircularBuffer.md)\<`number`\>

Defined in: [rolling/minmax.ts:142](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/rolling/minmax.ts#L142)
