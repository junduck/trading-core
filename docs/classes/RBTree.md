[**@junduck/trading-core v2.2.0**](../README.md)

***

[@junduck/trading-core](../README.md) / RBTree

# Class: RBTree\<T\>

Defined in: [containers/rbtree.ts:22](https://github.com/junduck/trading-core/blob/b03088bd0ee00897e0cf49496dd81d343e43bb66/src/containers/rbtree.ts#L22)

Red-Black Tree using standard pointer-based implementation.

## Type Parameters

### T

`T`

The type of elements stored in the tree

## Constructors

### Constructor

> **new RBTree**\<`T`\>(`compare?`): `RBTree`\<`T`\>

Defined in: [containers/rbtree.ts:31](https://github.com/junduck/trading-core/blob/b03088bd0ee00897e0cf49496dd81d343e43bb66/src/containers/rbtree.ts#L31)

Creates a Red-Black Tree.

#### Parameters

##### compare?

(`a`, `b`) => `number`

Comparator function (default: numeric comparison)

#### Returns

`RBTree`\<`T`\>

## Methods

### \[iterator\]()

> **\[iterator\]**(): `Iterator`\<`T`\>

Defined in: [containers/rbtree.ts:412](https://github.com/junduck/trading-core/blob/b03088bd0ee00897e0cf49496dd81d343e43bb66/src/containers/rbtree.ts#L412)

In-order iterator support

#### Returns

`Iterator`\<`T`\>

***

### clear()

> **clear**(): `void`

Defined in: [containers/rbtree.ts:406](https://github.com/junduck/trading-core/blob/b03088bd0ee00897e0cf49496dd81d343e43bb66/src/containers/rbtree.ts#L406)

Removes all elements

#### Returns

`void`

***

### delete()

> **delete**(`key`): `boolean`

Defined in: [containers/rbtree.ts:287](https://github.com/junduck/trading-core/blob/b03088bd0ee00897e0cf49496dd81d343e43bb66/src/containers/rbtree.ts#L287)

Deletes a key from the tree.

#### Parameters

##### key

`T`

Key to delete

#### Returns

`boolean`

true if key was found and deleted, false otherwise

***

### empty()

> **empty**(): `boolean`

Defined in: [containers/rbtree.ts:401](https://github.com/junduck/trading-core/blob/b03088bd0ee00897e0cf49496dd81d343e43bb66/src/containers/rbtree.ts#L401)

Checks if tree is empty

#### Returns

`boolean`

***

### has()

> **has**(`key`): `boolean`

Defined in: [containers/rbtree.ts:369](https://github.com/junduck/trading-core/blob/b03088bd0ee00897e0cf49496dd81d343e43bb66/src/containers/rbtree.ts#L369)

Checks if a key exists in the tree.

#### Parameters

##### key

`T`

Key to check

#### Returns

`boolean`

true if key exists, false otherwise

***

### insert()

> **insert**(`key`): `void`

Defined in: [containers/rbtree.ts:137](https://github.com/junduck/trading-core/blob/b03088bd0ee00897e0cf49496dd81d343e43bb66/src/containers/rbtree.ts#L137)

Inserts a key into the tree.

#### Parameters

##### key

`T`

Key to insert

#### Returns

`void`

***

### max()

> **max**(): `T` \| `undefined`

Defined in: [containers/rbtree.ts:386](https://github.com/junduck/trading-core/blob/b03088bd0ee00897e0cf49496dd81d343e43bb66/src/containers/rbtree.ts#L386)

Returns the maximum key in the tree.

#### Returns

`T` \| `undefined`

Maximum key or undefined if empty

***

### min()

> **min**(): `T` \| `undefined`

Defined in: [containers/rbtree.ts:377](https://github.com/junduck/trading-core/blob/b03088bd0ee00897e0cf49496dd81d343e43bb66/src/containers/rbtree.ts#L377)

Returns the minimum key in the tree.

#### Returns

`T` \| `undefined`

Minimum key or undefined if empty

***

### search()

> **search**(`key`): `T` \| `undefined`

Defined in: [containers/rbtree.ts:359](https://github.com/junduck/trading-core/blob/b03088bd0ee00897e0cf49496dd81d343e43bb66/src/containers/rbtree.ts#L359)

Searches for a key in the tree.

#### Parameters

##### key

`T`

Key to search for

#### Returns

`T` \| `undefined`

The key if found, undefined otherwise

***

### size()

> **size**(): `number`

Defined in: [containers/rbtree.ts:396](https://github.com/junduck/trading-core/blob/b03088bd0ee00897e0cf49496dd81d343e43bb66/src/containers/rbtree.ts#L396)

Returns current number of elements

#### Returns

`number`

***

### toArray()

> **toArray**(): `T`[]

Defined in: [containers/rbtree.ts:427](https://github.com/junduck/trading-core/blob/b03088bd0ee00897e0cf49496dd81d343e43bb66/src/containers/rbtree.ts#L427)

Converts tree to sorted array.

#### Returns

`T`[]

Array containing all elements in sorted order
