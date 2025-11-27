[**@junduck/trading-core v2.5.2**](../README.md)

***

[@junduck/trading-core](../README.md) / CircularBuffer

# Class: CircularBuffer\<T\>

Defined in: [containers/circular-buffer.ts:7](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/containers/circular-buffer.ts#L7)

Fixed-size circular buffer with Boost-like interface.
Automatically overwrites oldest elements when full.

## Type Parameters

### T

`T`

The type of elements stored in the buffer

## Accessors

### length

#### Get Signature

> **get** **length**(): `number`

Defined in: [containers/circular-buffer.ts:149](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/containers/circular-buffer.ts#L149)

Returns current number of elements

##### Returns

`number`

## Constructors

### Constructor

> **new CircularBuffer**\<`T`\>(`capacity`): `CircularBuffer`\<`T`\>

Defined in: [containers/circular-buffer.ts:18](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/containers/circular-buffer.ts#L18)

Creates a circular buffer with fixed capacity.

#### Parameters

##### capacity

`number`

Maximum number of elements

#### Returns

`CircularBuffer`\<`T`\>

## Methods

### \[iterator\]()

> **\[iterator\]**(): `Iterator`\<`T`\>

Defined in: [containers/circular-buffer.ts:169](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/containers/circular-buffer.ts#L169)

Iterator support for for...of loops

#### Returns

`Iterator`\<`T`\>

***

### at()

> **at**(`index`): `T` \| `undefined`

Defined in: [containers/circular-buffer.ts:90](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/containers/circular-buffer.ts#L90)

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

Defined in: [containers/circular-buffer.ts:137](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/containers/circular-buffer.ts#L137)

Gets back element without removing.

#### Returns

`T` \| `undefined`

Back element or undefined if empty

***

### capacity()

> **capacity**(): `number`

Defined in: [containers/circular-buffer.ts:154](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/containers/circular-buffer.ts#L154)

Returns maximum capacity

#### Returns

`number`

***

### clear()

> **clear**(): `void`

Defined in: [containers/circular-buffer.ts:75](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/containers/circular-buffer.ts#L75)

Removes all elements

#### Returns

`void`

***

### empty()

> **empty**(): `boolean`

Defined in: [containers/circular-buffer.ts:164](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/containers/circular-buffer.ts#L164)

Checks if buffer is empty

#### Returns

`boolean`

***

### front()

> **front**(): `T` \| `undefined`

Defined in: [containers/circular-buffer.ts:129](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/containers/circular-buffer.ts#L129)

Gets front element without removing.

#### Returns

`T` \| `undefined`

Front element or undefined if empty

***

### full()

> **full**(): `boolean`

Defined in: [containers/circular-buffer.ts:159](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/containers/circular-buffer.ts#L159)

Checks if buffer is full

#### Returns

`boolean`

***

### get()

> **get**(`index`): `T` \| `undefined`

Defined in: [containers/circular-buffer.ts:121](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/containers/circular-buffer.ts#L121)

Alias for at()

#### Parameters

##### index

`number`

#### Returns

`T` \| `undefined`

***

### peek()

> **peek**(): `T` \| `undefined`

Defined in: [containers/circular-buffer.ts:81](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/containers/circular-buffer.ts#L81)

Alias for front()

#### Returns

`T` \| `undefined`

***

### pop()

> **pop**(): `T` \| `undefined`

Defined in: [containers/circular-buffer.ts:70](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/containers/circular-buffer.ts#L70)

Alias for pop_front()

#### Returns

`T` \| `undefined`

***

### pop\_front()

> **pop\_front**(): `T` \| `undefined`

Defined in: [containers/circular-buffer.ts:57](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/containers/circular-buffer.ts#L57)

Removes and returns front element.

#### Returns

`T` \| `undefined`

Front element or undefined if empty

***

### push()

> **push**(`item`): `void`

Defined in: [containers/circular-buffer.ts:49](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/containers/circular-buffer.ts#L49)

Alias for push_back()

#### Parameters

##### item

`T`

#### Returns

`void`

***

### push\_back()

> **push\_back**(`item`): `void`

Defined in: [containers/circular-buffer.ts:29](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/containers/circular-buffer.ts#L29)

Adds element to back. Overwrites oldest if full.

#### Parameters

##### item

`T`

Element to add

#### Returns

`void`

***

### size()

> **size**(): `number`

Defined in: [containers/circular-buffer.ts:144](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/containers/circular-buffer.ts#L144)

Returns current number of elements

#### Returns

`number`

***

### toArray()

> **toArray**(): `T`[]

Defined in: [containers/circular-buffer.ts:197](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/containers/circular-buffer.ts#L197)

Converts buffer to array.

#### Returns

`T`[]

Array containing all elements in order
