[**@junduck/trading-core v2.1.1**](../README.md)

***

[@junduck/trading-core](../README.md) / PriorityQueue

# Class: PriorityQueue\<T\>

Defined in: [containers/priority-queue.ts:7](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/containers/priority-queue.ts#L7)

Priority queue using binary min-heap.
Provide custom comparator for other orderings (e.g., max-heap: (a, b) => b - a).

## Type Parameters

### T

`T`

The type of elements stored in the queue

## Constructors

### Constructor

> **new PriorityQueue**\<`T`\>(`compare?`): `PriorityQueue`\<`T`\>

Defined in: [containers/priority-queue.ts:15](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/containers/priority-queue.ts#L15)

Creates a priority queue.

#### Parameters

##### compare?

(`a`, `b`) => `number`

Comparator function (default: min-heap for numbers)

#### Returns

`PriorityQueue`\<`T`\>

## Methods

### \[iterator\]()

> **\[iterator\]**(): `Iterator`\<`T`\>

Defined in: [containers/priority-queue.ts:118](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/containers/priority-queue.ts#L118)

Iterator support. Yields elements in heap order, not sorted order.

#### Returns

`Iterator`\<`T`\>

***

### clear()

> **clear**(): `void`

Defined in: [containers/priority-queue.ts:113](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/containers/priority-queue.ts#L113)

Removes all elements

#### Returns

`void`

***

### empty()

> **empty**(): `boolean`

Defined in: [containers/priority-queue.ts:108](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/containers/priority-queue.ts#L108)

Checks if queue is empty

#### Returns

`boolean`

***

### peek()

> **peek**(): `T` \| `undefined`

Defined in: [containers/priority-queue.ts:93](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/containers/priority-queue.ts#L93)

Gets the top element without removing.

#### Returns

`T` \| `undefined`

Top element or undefined if empty

***

### pop()

> **pop**(): `T` \| `undefined`

Defined in: [containers/priority-queue.ts:79](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/containers/priority-queue.ts#L79)

Removes and returns the top element.

#### Returns

`T` \| `undefined`

Top element or undefined if empty

***

### push()

> **push**(`item`): `void`

Defined in: [containers/priority-queue.ts:70](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/containers/priority-queue.ts#L70)

Adds element to the queue.

#### Parameters

##### item

`T`

Element to add

#### Returns

`void`

***

### size()

> **size**(): `number`

Defined in: [containers/priority-queue.ts:103](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/containers/priority-queue.ts#L103)

Returns current number of elements

#### Returns

`number`

***

### toArray()

> **toArray**(): `T`[]

Defined in: [containers/priority-queue.ts:128](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/containers/priority-queue.ts#L128)

Converts queue to array in heap order (not sorted).

#### Returns

`T`[]

Array containing all elements

***

### top()

> **top**(): `T` \| `undefined`

Defined in: [containers/priority-queue.ts:98](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/containers/priority-queue.ts#L98)

Alias for peek()

#### Returns

`T` \| `undefined`
