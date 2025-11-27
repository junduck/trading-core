[**@junduck/trading-core v2.5.2**](../README.md)

***

[@junduck/trading-core](../README.md) / Deque

# Class: Deque\<T\>

Defined in: [containers/deque.ts:10](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/containers/deque.ts#L10)

Double-ended queue with dynamic capacity.

Elements are stored linearly from head to tail for O(1) iteration and cache locality.
When capacity is reached, the deque rebalances if skewed or expands if truly full.

## Type Parameters

### T

`T`

The type of elements stored in the deque

## Accessors

### length

#### Get Signature

> **get** **length**(): `number`

Defined in: [containers/deque.ts:255](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/containers/deque.ts#L255)

Returns current number of elements

##### Returns

`number`

## Constructors

### Constructor

> **new Deque**\<`T`\>(`capacity`, `growthFactor`, `rebalanceThreshold`): `Deque`\<`T`\>

Defined in: [containers/deque.ts:25](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/containers/deque.ts#L25)

Creates a deque with initial capacity.

#### Parameters

##### capacity

`number`

Initial number of elements

##### growthFactor

`number` = `2.0`

Factor by which to grow when full (default: 2.0)

##### rebalanceThreshold

`number` = `0.3`

Minimum unused space ratio to trigger rebalance instead of expand (default: 0.3)

#### Returns

`Deque`\<`T`\>

## Methods

### \[iterator\]()

> **\[iterator\]**(): `Iterator`\<`T`\>

Defined in: [containers/deque.ts:275](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/containers/deque.ts#L275)

Iterates over elements from front to back. Optimized for linear buffer access.

#### Returns

`Iterator`\<`T`\>

***

### at()

> **at**(`index`): `T` \| `undefined`

Defined in: [containers/deque.ts:231](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/containers/deque.ts#L231)

Accesses element at index.

#### Parameters

##### index

`number`

Position from front (0 = front, size-1 = back)

#### Returns

`T` \| `undefined`

Element or undefined if out of bounds

***

### back()

> **back**(): `T` \| `undefined`

Defined in: [containers/deque.ts:218](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/containers/deque.ts#L218)

Gets back element without removing.

#### Returns

`T` \| `undefined`

Back element or undefined if empty

***

### capacity()

> **capacity**(): `number`

Defined in: [containers/deque.ts:260](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/containers/deque.ts#L260)

Returns current capacity

#### Returns

`number`

***

### clear()

> **clear**(): `void`

Defined in: [containers/deque.ts:240](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/containers/deque.ts#L240)

Removes all elements

#### Returns

`void`

***

### empty()

> **empty**(): `boolean`

Defined in: [containers/deque.ts:270](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/containers/deque.ts#L270)

Checks if deque is empty

#### Returns

`boolean`

***

### front()

> **front**(): `T` \| `undefined`

Defined in: [containers/deque.ts:207](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/containers/deque.ts#L207)

Gets front element without removing.

#### Returns

`T` \| `undefined`

Front element or undefined if empty

***

### full()

> **full**(): `boolean`

Defined in: [containers/deque.ts:265](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/containers/deque.ts#L265)

Checks if deque is full

#### Returns

`boolean`

***

### pop\_back()

> **pop\_back**(): `T` \| `undefined`

Defined in: [containers/deque.ts:186](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/containers/deque.ts#L186)

Removes and returns back element.

#### Returns

`T` \| `undefined`

Back element or undefined if empty

***

### pop\_front()

> **pop\_front**(): `T` \| `undefined`

Defined in: [containers/deque.ts:165](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/containers/deque.ts#L165)

Removes and returns front element.

#### Returns

`T` \| `undefined`

Front element or undefined if empty

***

### push\_back()

> **push\_back**(`item`): `void`

Defined in: [containers/deque.ts:146](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/containers/deque.ts#L146)

Adds element to back.

#### Parameters

##### item

`T`

Element to add

#### Returns

`void`

***

### push\_front()

> **push\_front**(`item`): `void`

Defined in: [containers/deque.ts:127](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/containers/deque.ts#L127)

Adds element to front.

#### Parameters

##### item

`T`

Element to add

#### Returns

`void`

***

### size()

> **size**(): `number`

Defined in: [containers/deque.ts:250](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/containers/deque.ts#L250)

Returns current number of elements

#### Returns

`number`

***

### toArray()

> **toArray**(): `T`[]

Defined in: [containers/deque.ts:294](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/containers/deque.ts#L294)

Converts deque to array.

#### Returns

`T`[]

Array containing all elements in order
