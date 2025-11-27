[**@junduck/trading-core v2.5.2**](../README.md)

***

[@junduck/trading-core](../README.md) / RollingMin

# Class: RollingMin

Defined in: [rolling/minmax.ts:9](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/rolling/minmax.ts#L9)

Rolling minimum over a sliding window using monotonic deque.
O(1) amortized time per update.

## Accessors

### value

#### Get Signature

> **get** **value**(): `number`

Defined in: [rolling/minmax.ts:13](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/rolling/minmax.ts#L13)

##### Returns

`number`

## Constructors

### Constructor

> **new RollingMin**(`opts`): `RollingMin`

Defined in: [rolling/minmax.ts:17](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/rolling/minmax.ts#L17)

#### Parameters

##### opts

###### period

`number`

#### Returns

`RollingMin`

## Methods

### update()

> **update**(`x`): `number`

Defined in: [rolling/minmax.ts:23](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/rolling/minmax.ts#L23)

#### Parameters

##### x

`number`

#### Returns

`number`

## Properties

### buffer

> `readonly` **buffer**: [`CircularBuffer`](CircularBuffer.md)\<`number`\>

Defined in: [rolling/minmax.ts:10](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/rolling/minmax.ts#L10)
