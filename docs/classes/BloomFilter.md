[**@junduck/trading-core v2.2.0**](../README.md)

***

[@junduck/trading-core](../README.md) / BloomFilter

# Class: BloomFilter\<T\>

Defined in: [online/probs.ts:101](https://github.com/junduck/trading-core/blob/b03088bd0ee00897e0cf49496dd81d343e43bb66/src/online/probs.ts#L101)

Bloom filter for membership testing in data streams.
O(k) add and test where k is number of hash functions.
May have false positives but no false negatives.

## Type Parameters

### T

`T` = `string`

## Constructors

### Constructor

> **new BloomFilter**\<`T`\>(`opts`): `BloomFilter`\<`T`\>

Defined in: [online/probs.ts:114](https://github.com/junduck/trading-core/blob/b03088bd0ee00897e0cf49496dd81d343e43bb66/src/online/probs.ts#L114)

#### Parameters

##### opts

\{ `numHashes`: `number`; `size`: `number`; \} \| \{ `expectedItems`: `number`; `falsePositiveRate`: `number`; \} & `object`

#### Returns

`BloomFilter`\<`T`\>

## Methods

### add()

> **add**(`key`): `void`

Defined in: [online/probs.ts:138](https://github.com/junduck/trading-core/blob/b03088bd0ee00897e0cf49496dd81d343e43bb66/src/online/probs.ts#L138)

Add a key to the filter.

#### Parameters

##### key

`T`

#### Returns

`void`

***

### has()

> **has**(`key`): `boolean`

Defined in: [online/probs.ts:150](https://github.com/junduck/trading-core/blob/b03088bd0ee00897e0cf49496dd81d343e43bb66/src/online/probs.ts#L150)

Test if a key may be in the filter.

#### Parameters

##### key

`T`

#### Returns

`boolean`

false = definitely not present, true = possibly present
