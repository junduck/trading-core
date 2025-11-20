[**@junduck/trading-core v2.1.1**](../README.md)

***

[@junduck/trading-core](../README.md) / handleStakingReward

# Function: handleStakingReward()

> **handleStakingReward**(`pos`, `symbol`, `rewardPerToken`, `time?`, `disableLot?`): `number`

Defined in: [utils/crypto.utils.ts:235](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/utils/crypto.utils.ts#L235)

Handles staking rewards by increasing position quantity.

## Parameters

### pos

[`Position`](../interfaces/Position.md)

The position to modify

### symbol

`string`

The staked asset symbol

### rewardPerToken

`number`

The reward amount per staked token

### time?

`Date`

The transaction time (default: current date)

### disableLot?

`boolean`

If true, merges into single lot instead of tracking separate lots (default: false)

## Returns

`number`

The total quantity of rewards received

## Throws

Error if the reward amount is negative
