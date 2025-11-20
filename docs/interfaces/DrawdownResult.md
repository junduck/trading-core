[**@junduck/trading-core v2.1.1**](../README.md)

***

[@junduck/trading-core](../README.md) / DrawdownResult

# Interface: DrawdownResult

Defined in: [utils/drawdown.ts:7](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/utils/drawdown.ts#L7)

Result of drawdown/drawup calculation

## Properties

### from

> **from**: `number`

Defined in: [utils/drawdown.ts:11](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/utils/drawdown.ts#L11)

Index of the extremum (peak for drawdown, trough for drawup)

***

### to

> **to**: `number`

Defined in: [utils/drawdown.ts:13](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/utils/drawdown.ts#L13)

Index where maximum movement occurred

***

### value

> **value**: `number`

Defined in: [utils/drawdown.ts:9](https://github.com/junduck/trading-core/blob/0e6e25f7ffcf5daf51ca8559125252eb16a37960/src/utils/drawdown.ts#L9)

The drawdown/drawup value
