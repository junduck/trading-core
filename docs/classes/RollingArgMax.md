[**@junduck/trading-core v2.5.2**](../README.md)

***

[@junduck/trading-core](../README.md) / RollingArgMax

# Class: RollingArgMax

Defined in: [rolling/minmax.ts:192](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/rolling/minmax.ts#L192)

Rolling maximum with position tracking over a sliding window.
Returns both maximum value and its index within the window (0 = oldest).
O(1) amortized time per update.

## Accessors

### value

#### Get Signature

> **get** **value**(): `object`

Defined in: [rolling/minmax.ts:198](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/rolling/minmax.ts#L198)

##### Returns

`object`

###### pos

> **pos**: `number`

###### val

> **val**: `number`

## Constructors

### Constructor

> **new RollingArgMax**(`opts`): `RollingArgMax`

Defined in: [rolling/minmax.ts:206](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/rolling/minmax.ts#L206)

#### Parameters

##### opts

###### period

`number`

#### Returns

`RollingArgMax`

## Methods

### update()

> **update**(`x`): `object`

Defined in: [rolling/minmax.ts:213](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/rolling/minmax.ts#L213)

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

Defined in: [rolling/minmax.ts:193](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/rolling/minmax.ts#L193)
