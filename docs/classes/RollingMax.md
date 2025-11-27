[**@junduck/trading-core v2.5.2**](../README.md)

***

[@junduck/trading-core](../README.md) / RollingMax

# Class: RollingMax

Defined in: [rolling/minmax.ts:47](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/rolling/minmax.ts#L47)

Rolling maximum over a sliding window using monotonic deque.
O(1) amortized time per update.

## Accessors

### value

#### Get Signature

> **get** **value**(): `number`

Defined in: [rolling/minmax.ts:51](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/rolling/minmax.ts#L51)

##### Returns

`number`

## Constructors

### Constructor

> **new RollingMax**(`opts`): `RollingMax`

Defined in: [rolling/minmax.ts:55](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/rolling/minmax.ts#L55)

#### Parameters

##### opts

###### period

`number`

#### Returns

`RollingMax`

## Methods

### update()

> **update**(`x`): `number`

Defined in: [rolling/minmax.ts:61](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/rolling/minmax.ts#L61)

#### Parameters

##### x

`number`

#### Returns

`number`

## Properties

### buffer

> `readonly` **buffer**: [`CircularBuffer`](CircularBuffer.md)\<`number`\>

Defined in: [rolling/minmax.ts:48](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/rolling/minmax.ts#L48)
