**@junduck/trading-core v2.1.1**

***

# @junduck/trading-core v2.1.1

## Portfolio

- [Portfolio](interfaces/Portfolio.md)
- [create](functions/create.md)
- [getAllSymbols](functions/getAllSymbols.md)
- [getCash](functions/getCash.md)
- [getCurrencies](functions/getCurrencies.md)
- [getOrSetPosition](functions/getOrSetPosition.md)
- [getPosition](functions/getPosition.md)
- [hasAsset](functions/hasAsset.md)
- [portfolioCloseLong](functions/portfolioCloseLong.md)
- [portfolioCloseShort](functions/portfolioCloseShort.md)
- [portfolioHandleAirdrop](functions/portfolioHandleAirdrop.md)
- [portfolioHandleCashDividend](functions/portfolioHandleCashDividend.md)
- [portfolioHandleHardFork](functions/portfolioHandleHardFork.md)
- [portfolioHandleMerger](functions/portfolioHandleMerger.md)
- [portfolioHandleSpinoff](functions/portfolioHandleSpinoff.md)
- [portfolioHandleSplit](functions/portfolioHandleSplit.md)
- [portfolioHandleStakingReward](functions/portfolioHandleStakingReward.md)
- [portfolioHandleTokenSwap](functions/portfolioHandleTokenSwap.md)
- [portfolioOpenLong](functions/portfolioOpenLong.md)
- [portfolioOpenShort](functions/portfolioOpenShort.md)

## Position

- [ApplyFillResult](interfaces/ApplyFillResult.md)
- [LongPosition](interfaces/LongPosition.md)
- [LongPositionLot](interfaces/LongPositionLot.md)
- [Position](interfaces/Position.md)
- [ShortPosition](interfaces/ShortPosition.md)
- [ShortPositionLot](interfaces/ShortPositionLot.md)
- [CloseStrategy](type-aliases/CloseStrategy.md)
- [amendLongPositionLot](functions/amendLongPositionLot.md)
- [amendShortPositionLot](functions/amendShortPositionLot.md)
- [applyFill](functions/applyFill.md)
- [applyFills](functions/applyFills.md)
- [closeLong](functions/closeLong.md)
- [closeShort](functions/closeShort.md)
- [createPosition](functions/createPosition.md)
- [getAverageCost](functions/getAverageCost.md)
- [getAverageProceeds](functions/getAverageProceeds.md)
- [handleAirdrop](functions/handleAirdrop.md)
- [handleCashDividend](functions/handleCashDividend.md)
- [handleHardFork](functions/handleHardFork.md)
- [handleMerger](functions/handleMerger.md)
- [handleSpinoff](functions/handleSpinoff.md)
- [handleSplit](functions/handleSplit.md)
- [handleStakingReward](functions/handleStakingReward.md)
- [handleTokenSwap](functions/handleTokenSwap.md)
- [openLong](functions/openLong.md)
- [openShort](functions/openShort.md)
- [pushLongPositionLot](functions/pushLongPositionLot.md)
- [pushShortPositionLot](functions/pushShortPositionLot.md)
- [validatePosition](functions/validatePosition.md)

## Market Data

- [Asset](interfaces/Asset.md)
- [MarketBar](interfaces/MarketBar.md)
- [MarketQuote](interfaces/MarketQuote.md)
- [MarketSnapshot](interfaces/MarketSnapshot.md)
- [Universe](interfaces/Universe.md)
- [MarketBarInterval](type-aliases/MarketBarInterval.md)
- [calculateUnrealisedPnL](variables/calculateUnrealisedPnL.md)
- [appraisePortfolio](functions/appraisePortfolio.md)
- [appraisePosition](functions/appraisePosition.md)
- [calculateUnrealizedPnL](functions/calculateUnrealizedPnL.md)
- [createUniverse](functions/createUniverse.md)
- [isAssetValidAt](functions/isAssetValidAt.md)
- [updateSnapshotBar](functions/updateSnapshotBar.md)
- [updateSnapshotQuote](functions/updateSnapshotQuote.md)

## Order Management

- [OrderValidationResult](interfaces/OrderValidationResult.md)
- [Fill](type-aliases/Fill.md)
- [Order](type-aliases/Order.md)
- [OrderAction](type-aliases/OrderAction.md)
- [OrderSide](type-aliases/OrderSide.md)
- [OrderState](type-aliases/OrderState.md)
- [OrderStatus](type-aliases/OrderStatus.md)
- [OrderType](type-aliases/OrderType.md)
- [OrderValidationError](type-aliases/OrderValidationError.md)
- [PositionEffect](type-aliases/PositionEffect.md)
- [validateOrder](functions/validateOrder.md)

## Data Structures

- [CircularBuffer](classes/CircularBuffer.md)
- [Deque](classes/Deque.md)
- [PriorityQueue](classes/PriorityQueue.md)
- [RBTree](classes/RBTree.md)
- [NumericBuffer](interfaces/NumericBuffer.md)

## Performance Analysis

- [DrawdownResult](interfaces/DrawdownResult.md)
- [maxDrawDown](functions/maxDrawDown.md)
- [maxDrawUp](functions/maxDrawUp.md)
- [maxRelDrawDown](functions/maxRelDrawDown.md)
- [maxRelDrawUp](functions/maxRelDrawUp.md)

## Online Statistics

- [BloomFilter](classes/BloomFilter.md)
- [CMA](classes/CMA.md)
- [CountMinSketch](classes/CountMinSketch.md)
- [CuBeta](classes/CuBeta.md)
- [CuCorr](classes/CuCorr.md)
- [CuCov](classes/CuCov.md)
- [CuHistogram](classes/CuHistogram.md)
- [CuKurt](classes/CuKurt.md)
- [CuSkew](classes/CuSkew.md)
- [CuStddev](classes/CuStddev.md)
- [CuVar](classes/CuVar.md)

## Rolling Statistics

- [EMA](classes/EMA.md)
- [EWMA](classes/EWMA.md)
- [IQR](classes/IQR.md)
- [MeanAbsDeviation](classes/MeanAbsDeviation.md)
- [MedianAbsDeviation](classes/MedianAbsDeviation.md)
- [RollingArgMax](classes/RollingArgMax.md)
- [RollingArgMin](classes/RollingArgMin.md)
- [RollingArgMinMax](classes/RollingArgMinMax.md)
- [RollingBeta](classes/RollingBeta.md)
- [RollingBetaEW](classes/RollingBetaEW.md)
- [RollingCorr](classes/RollingCorr.md)
- [RollingCorrEW](classes/RollingCorrEW.md)
- [RollingCov](classes/RollingCov.md)
- [RollingCovEW](classes/RollingCovEW.md)
- [RollingHistogram](classes/RollingHistogram.md)
- [RollingKurt](classes/RollingKurt.md)
- [RollingMax](classes/RollingMax.md)
- [RollingMedian](classes/RollingMedian.md)
- [RollingMin](classes/RollingMin.md)
- [RollingMinMax](classes/RollingMinMax.md)
- [RollingQuantile](classes/RollingQuantile.md)
- [RollingSkew](classes/RollingSkew.md)
- [RollingStddev](classes/RollingStddev.md)
- [RollingStddevEW](classes/RollingStddevEW.md)
- [RollingSum](classes/RollingSum.md)
- [RollingVar](classes/RollingVar.md)
- [RollingVarEW](classes/RollingVarEW.md)
- [RollingZScore](classes/RollingZScore.md)
- [RollingZScoreEW](classes/RollingZScoreEW.md)
- [SMA](classes/SMA.md)

## Numeric Utilities

- [NumericBuffer](interfaces/NumericBuffer.md)
- [clamp](functions/clamp.md)
- [gcd](functions/gcd.md)
- [invLerp](functions/invLerp.md)
- [lcm](functions/lcm.md)
- [lerp](functions/lerp.md)
- [midpoint](functions/midpoint.md)
- [remap](functions/remap.md)

## Numeric Utilities - Statistics

- [argsort](functions/argsort.md)
- [corr](functions/corr.md)
- [cov](functions/cov.md)
- [kurt](functions/kurt.md)
- [mean](functions/mean.md)
- [median](functions/median.md)
- [quantile](functions/quantile.md)
- [rank](functions/rank.md)
- [skew](functions/skew.md)
- [spearman](functions/spearman.md)
- [stddev](functions/stddev.md)
- [variance](functions/variance.md)

## Numeric Utilities - Series Transform

- [coalesce](functions/coalesce.md)
- [cumsum](functions/cumsum.md)
- [diff](functions/diff.md)
- [lag](functions/lag.md)
- [lead](functions/lead.md)
- [locf](functions/locf.md)
- [logReturns](functions/logReturns.md)
- [norm](functions/norm.md)
- [pctChange](functions/pctChange.md)
- [returns](functions/returns.md)
- [sign](functions/sign.md)
- [winsorize](functions/winsorize.md)

## Numeric Utilities - Array Reducers

- [argmax](functions/argmax.md)
- [argmin](functions/argmin.md)
- [max](functions/max.md)
- [min](functions/min.md)
- [sum](functions/sum.md)

## Numeric Utilities - Accumulator

- [Kahan](classes/Kahan.md)
- [SmoothedAccum](classes/SmoothedAccum.md)
- [exp\_factor](functions/exp_factor.md)
- [wilders\_factor](functions/wilders_factor.md)
