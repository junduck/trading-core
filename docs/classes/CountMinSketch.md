[**@junduck/trading-core v2.2.0**](../README.md)

***

[@junduck/trading-core](../README.md) / CountMinSketch

# Class: CountMinSketch\<T\>

Defined in: [online/probs.ts:7](https://github.com/junduck/trading-core/blob/b03088bd0ee00897e0cf49496dd81d343e43bb66/src/online/probs.ts#L7)

Count-Min Sketch for frequency estimation in data streams.
O(1) update and query with configurable error bounds.
Error is within epsilon * N with probability 1 - delta, where N is total count.

## Type Parameters

### T

`T` = `string`

## Constructors

### Constructor

> **new CountMinSketch**\<`T`\>(`opts`): `CountMinSketch`\<`T`\>

Defined in: [online/probs.ts:20](https://github.com/junduck/trading-core/blob/b03088bd0ee00897e0cf49496dd81d343e43bb66/src/online/probs.ts#L20)

#### Parameters

##### opts

\{ `depth`: `number`; `width`: `number`; \} \| \{ `delta`: `number`; `epsilon`: `number`; \} & `object`

#### Returns

`CountMinSketch`\<`T`\>

## Methods

### query()

> **query**(`key`): `number`

Defined in: [online/probs.ts:59](https://github.com/junduck/trading-core/blob/b03088bd0ee00897e0cf49496dd81d343e43bb66/src/online/probs.ts#L59)

Estimate frequency of a key.

#### Parameters

##### key

`T`

Key to query

#### Returns

`number`

Estimated count (upper bound)

***

### update()

> **update**(`key`, `count`): `void`

Defined in: [online/probs.ts:46](https://github.com/junduck/trading-core/blob/b03088bd0ee00897e0cf49496dd81d343e43bb66/src/online/probs.ts#L46)

Increment count for a key.

#### Parameters

##### key

`T`

Key to increment

##### count

`number` = `1`

Count to add (default 1)

#### Returns

`void`
