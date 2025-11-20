[**@junduck/trading-core v2.1.1**](../README.md)

***

[@junduck/trading-core](../README.md) / SmoothedAccum

# Class: SmoothedAccum

Defined in: [utils/accum.ts:29](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/utils/accum.ts#L29)

Smoothed accumulator for weighted observations.
Implements val = (1-w)*val + w*obs.

## Constructors

### Constructor

> **new SmoothedAccum**(`init`): `SmoothedAccum`

Defined in: [utils/accum.ts:35](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/utils/accum.ts#L35)

#### Parameters

##### init

`number` = `0`

Initial value (default: 0)

#### Returns

`SmoothedAccum`

## Methods

### accum()

> **accum**(`obs`, `weight`): `number`

Defined in: [utils/accum.ts:45](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/utils/accum.ts#L45)

Updates value using exponential smoothing.

#### Parameters

##### obs

`number`

Observed value

##### weight

`number`

Smoothing weight (0-1)

#### Returns

`number`

Updated smoothed value

***

### roll()

> **roll**(`obs_new`, `obs_old`, `weight`): `number`

Defined in: [utils/accum.ts:58](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/utils/accum.ts#L58)

Updates value by rolling out old observation and rolling in new one.
Requires obs_new and obs_old have same weight

#### Parameters

##### obs\_new

`number`

New observation to add

##### obs\_old

`number`

Old observation to remove

##### weight

`number`

Smoothing weight (0-1)

#### Returns

`number`

Updated smoothed value

## Properties

### val

> **val**: `number`

Defined in: [utils/accum.ts:30](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/utils/accum.ts#L30)
