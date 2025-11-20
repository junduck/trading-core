[**@junduck/trading-core v2.1.1**](../README.md)

***

[@junduck/trading-core](../README.md) / handleAirdrop

# Function: handleAirdrop()

> **handleAirdrop**(`pos`, `holderSymbol`, `airdropSymbol`, `amountPerToken`, `fixedAmount`, `time?`, `disableLot?`): `void`

Defined in: [utils/crypto.utils.ts:92](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/utils/crypto.utils.ts#L92)

Handles an airdrop by creating positions in the airdropped token.

## Parameters

### pos

[`Position`](../interfaces/Position.md)

The position to modify

### holderSymbol

The asset symbol that qualifies for the airdrop (can be null for universal airdrops)

`string` | `null`

### airdropSymbol

`string`

The airdropped token symbol

### amountPerToken

`number` = `0`

The airdrop amount per token held (ignored if holderSymbol is null)

### fixedAmount

`number` = `0`

Fixed airdrop amount (used if holderSymbol is null)

### time?

`Date`

The transaction time (default: current date)

### disableLot?

`boolean`

If true, merges into single lot instead of tracking separate lots (default: false)

## Returns

`void`

## Throws

Error if both holderSymbol and fixedAmount are null, or amountPerToken is negative
