[**@junduck/trading-core v2.5.2**](../README.md)

***

[@junduck/trading-core](../README.md) / q

# Variable: q

> `const` **q**: `object`

Defined in: [utils/position.utils.ts:540](https://github.com/junduck/trading-core/blob/2826ecdee150f415f8d111535936ebaf954a775b/src/utils/position.utils.ts#L540)

Opinionated query helpers for convenient position access.

Provides simplified accessors that flatten the nested structure and return sensible defaults.
All numeric queries return 0 if the position doesn't exist, boolean queries return false.

## Type Declaration

### cost()

> **cost**: (`pos`, `symbol`) => `number`

Get LONG position total cost

#### Parameters

##### pos

[`Position`](../interfaces/Position.md)

Position to query

##### symbol

`string`

Asset symbol

#### Returns

`number`

Total cost, or 0 if position doesn't exist

### hasLong()

> **hasLong**: (`pos`, `symbol`) => `boolean`

Check if long position exists

#### Parameters

##### pos

[`Position`](../interfaces/Position.md)

Position to query

##### symbol

`string`

Asset symbol

#### Returns

`boolean`

true if position exists, false otherwise

### hasShort()

> **hasShort**: (`pos`, `symbol`) => `boolean`

Check if short position exists

#### Parameters

##### pos

[`Position`](../interfaces/Position.md)

Position to query

##### symbol

`string`

Asset symbol

#### Returns

`boolean`

true if position exists, false otherwise

### longCost()

> **longCost**: (`pos`, `symbol`) => `number`

Get long position total cost

#### Parameters

##### pos

[`Position`](../interfaces/Position.md)

Position to query

##### symbol

`string`

Asset symbol

#### Returns

`number`

Total cost, or 0 if position doesn't exist

### longPnL()

> **longPnL**: (`pos`, `symbol`) => `number`

Get long position realised PnL

#### Parameters

##### pos

[`Position`](../interfaces/Position.md)

Position to query

##### symbol

`string`

Asset symbol

#### Returns

`number`

Realised PnL, or 0 if position doesn't exist

### longQty()

> **longQty**: (`pos`, `symbol`) => `number`

Get long position quantity

#### Parameters

##### pos

[`Position`](../interfaces/Position.md)

Position to query

##### symbol

`string`

Asset symbol

#### Returns

`number`

Quantity, or 0 if position doesn't exist

### qty()

> **qty**: (`pos`, `symbol`) => `number`

Get LONG position quantity

#### Parameters

##### pos

[`Position`](../interfaces/Position.md)

Position to query

##### symbol

`string`

Asset symbol

#### Returns

`number`

Quantity, or 0 if position doesn't exist

### shortPnL()

> **shortPnL**: (`pos`, `symbol`) => `number`

Get short position realised PnL

#### Parameters

##### pos

[`Position`](../interfaces/Position.md)

Position to query

##### symbol

`string`

Asset symbol

#### Returns

`number`

Realised PnL, or 0 if position doesn't exist

### shortProceeds()

> **shortProceeds**: (`pos`, `symbol`) => `number`

Get short position total proceeds

#### Parameters

##### pos

[`Position`](../interfaces/Position.md)

Position to query

##### symbol

`string`

Asset symbol

#### Returns

`number`

Total proceeds, or 0 if position doesn't exist

### shortQty()

> **shortQty**: (`pos`, `symbol`) => `number`

Get short position quantity

#### Parameters

##### pos

[`Position`](../interfaces/Position.md)

Position to query

##### symbol

`string`

Asset symbol

#### Returns

`number`

Quantity, or 0 if position doesn't exist

## Example

```ts
// Equivalent to: pos.long?.get("AAPL")?.quantity ?? 0
q.longQty(pos, "AAPL")

// Short-hand for long positions (common case)
q.qty(pos, "AAPL")  // same as q.longQty()
q.cost(pos, "AAPL") // same as q.longCost()

// Equivalent to: pos.short?.has("TSLA") ?? false
q.hasShort(pos, "TSLA")
```
