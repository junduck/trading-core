[**@junduck/trading-core v2.1.1**](../README.md)

***

[@junduck/trading-core](../README.md) / RollingHistogram

# Class: RollingHistogram

Defined in: [rolling/histogram.ts:8](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/rolling/histogram.ts#L8)

Rolling histogram over a sliding window.
Maintains frequency distribution across fixed bins.

## Constructors

### Constructor

> **new RollingHistogram**(`opts`): `RollingHistogram`

Defined in: [rolling/histogram.ts:23](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/rolling/histogram.ts#L23)

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

###### period

`number`

Window size

#### Returns

`RollingHistogram`

## Methods

### getCDF()

> **getCDF**(): `number`[]

Defined in: [rolling/histogram.ts:80](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/rolling/histogram.ts#L80)

Get cumulative distribution.

#### Returns

`number`[]

Cumulative sum of probabilities

***

### getCount()

> **getCount**(`binIndex`): `number`

Defined in: [rolling/histogram.ts:52](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/rolling/histogram.ts#L52)

Get count for a specific bin.

#### Parameters

##### binIndex

`number`

0 = underflow, 1..(n-1) = regular bins, n = overflow

#### Returns

`number`

***

### getCounts()

> **getCounts**(): readonly `number`[]

Defined in: [rolling/histogram.ts:57](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/rolling/histogram.ts#L57)

Get all bin counts

#### Returns

readonly `number`[]

***

### getEdges()

> **getEdges**(): readonly `number`[]

Defined in: [rolling/histogram.ts:62](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/rolling/histogram.ts#L62)

Get bin edges

#### Returns

readonly `number`[]

***

### getProbabilities()

> **getProbabilities**(): `number`[]

Defined in: [rolling/histogram.ts:70](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/rolling/histogram.ts#L70)

Get normalized frequencies (probabilities).

#### Returns

`number`[]

counts[i] / window_size

***

### update()

> **update**(`x`): readonly `number`[]

Defined in: [rolling/histogram.ts:34](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/rolling/histogram.ts#L34)

Process new data point.

#### Parameters

##### x

`number`

New value

#### Returns

readonly `number`[]

Reference to internal counts array

## Properties

### buffer

> `readonly` **buffer**: [`CircularBuffer`](CircularBuffer.md)\<`number`\>

Defined in: [rolling/histogram.ts:9](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/rolling/histogram.ts#L9)
