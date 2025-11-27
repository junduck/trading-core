[**@junduck/trading-core v2.5.2**](../README.md)

***

[@junduck/trading-core](../README.md) / CuHistogram

# Class: CuHistogram

Defined in: [online/histogram.ts:6](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/online/histogram.ts#L6)

Cumulative histogram over entire data stream.
Maintains frequency distribution across fixed bins.

## Constructors

### Constructor

> **new CuHistogram**(`opts`): `CuHistogram`

Defined in: [online/histogram.ts:20](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/online/histogram.ts#L20)

#### Parameters

##### opts

###### edges

`number`[]

Sorted bin edges defining (n+1) bins:
  - Bin 0: values < edges[0] (underflow)
  - Bin i: [edges[i-1], edges[i]) for i = 1..(n-1)
  - Bin n: values >= edges[n-1] (overflow)

Example: edges = [0, 10, 20] creates 4 bins:
  <0, [0,10), [10,20), >=20

#### Returns

`CuHistogram`

## Methods

### getCDF()

> **getCDF**(): `number`[]

Defined in: [online/histogram.ts:73](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/online/histogram.ts#L73)

Get cumulative distribution.

#### Returns

`number`[]

Cumulative sum of probabilities

***

### getCount()

> **getCount**(`binIndex`): `number`

Defined in: [online/histogram.ts:41](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/online/histogram.ts#L41)

Get count for a specific bin.

#### Parameters

##### binIndex

`number`

0 = underflow, 1..(n-1) = regular bins, n = overflow

#### Returns

`number`

***

### getCounts()

> **getCounts**(): `number`[]

Defined in: [online/histogram.ts:46](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/online/histogram.ts#L46)

Get all bin counts

#### Returns

`number`[]

***

### getEdges()

> **getEdges**(): `number`[]

Defined in: [online/histogram.ts:51](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/online/histogram.ts#L51)

Get bin edges

#### Returns

`number`[]

***

### getProbabilities()

> **getProbabilities**(): `number`[]

Defined in: [online/histogram.ts:64](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/online/histogram.ts#L64)

Get normalized frequencies (probabilities).

#### Returns

`number`[]

counts[i] / total_count

***

### getTotal()

> **getTotal**(): `number`

Defined in: [online/histogram.ts:56](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/online/histogram.ts#L56)

Get total count of all observations

#### Returns

`number`

***

### update()

> **update**(`x`): `number`[]

Defined in: [online/histogram.ts:30](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/online/histogram.ts#L30)

Process new data point.

#### Parameters

##### x

`number`

New value

#### Returns

`number`[]

Reference to internal counts array
