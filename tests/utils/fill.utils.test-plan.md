# Fill Utilities Test Plan

This document outlines test cases for fill processing utilities that convert Fill records into Position updates.

## Test Guidelines

Following [position.test.md](./position.test.md):
- Only valid fills are passed (validation happens before fill processing)
- Commission values use lot price for easier manual review
- Group related tests in describe blocks

## Test Scenarios

### 1. Single Fill - Open Long Position

Apply a single OPEN_LONG fill and verify position state.

| Step | Action | Symbol | Price | Qty | Comm | Effect |
|------|--------|--------|-------|-----|------|--------|
| 1 | applyFill | AAPL | 100 | 10 | 100 | OPEN_LONG |

**Expected Result:**
- Cash: 100,000 - 1,100 = 98,900
- Position: qty=10, totalCost=1,100, avgCost=110
- Result: cashFlow=-1,100, realisedPnL=0

### 2. Multiple Fills - Open and Close Long

Apply fills to open and partially close a long position.

| Step | Action | Symbol | Price | Qty | Comm | Effect |
|------|--------|--------|-------|-----|------|--------|
| 1 | applyFill | AAPL | 100 | 10 | 100 | OPEN_LONG |
| 2 | applyFill | AAPL | 110 | 5 | 110 | CLOSE_LONG |

**Expected after step 1:**
- Cash: 98,900
- Position: qty=10, totalCost=1,100

**Expected after step 2:**
- Cash: 98,900 + (110*5 - 110) = 99,340
- Position: qty=5, totalCost=550
- Result: cashFlow=440, realisedPnL=-110 (loss)

### 3. Single Fill - Open Short Position

Apply a single OPEN_SHORT fill.

| Step | Action | Symbol | Price | Qty | Comm | Effect |
|------|--------|--------|-------|-----|------|--------|
| 1 | applyFill | TSLA | 200 | 10 | 200 | OPEN_SHORT |

**Expected Result:**
- Cash: 100,000 + (200*10 - 200) = 101,800
- Position: qty=10, totalProceeds=1,800, avgProceeds=180
- Result: cashFlow=1,800, realisedPnL=0

### 4. Multiple Fills - Open and Close Short

Apply fills to open and partially close a short position.

| Step | Action | Symbol | Price | Qty | Comm | Effect |
|------|--------|--------|-------|-----|------|--------|
| 1 | applyFill | TSLA | 200 | 10 | 200 | OPEN_SHORT |
| 2 | applyFill | TSLA | 180 | 5 | 180 | CLOSE_SHORT |

**Expected after step 1:**
- Cash: 101,800
- Position: qty=10, totalProceeds=1,800

**Expected after step 2:**
- Cash: 101,800 - (180*5 + 180) = 100,720
- Position: qty=5, totalProceeds=900
- Result: cashFlow=-1,080, realisedPnL=0 (proceeds=900, cost=900)

### 5. applyFills - Batch Processing

Apply multiple fills atomically using applyFills.

| Step | Action | Symbol | Price | Qty | Comm | Effect |
|------|--------|--------|-------|-----|------|--------|
| 1 | applyFills | AAPL | 100 | 10 | 100 | OPEN_LONG |
| 1 | (batch) | AAPL | 110 | 10 | 110 | OPEN_LONG |
| 1 | (batch) | AAPL | 115 | 10 | 115 | CLOSE_LONG |

**Expected Result:**
- 3 results returned in array
- Final position: qty=10, totalCost=1,210
- Final cash: 100,000 - 1,100 - 1,210 + (115*10 - 115) = 98,725

### 6. FIFO vs LIFO Close Strategy

Test different closing strategies.

| Step | Action | Symbol | Price | Qty | Comm | Effect | Strategy |
|------|--------|--------|-------|-----|------|--------|----------|
| 1 | applyFill | AAPL | 100 | 5 | 100 | OPEN_LONG | - |
| 2 | applyFill | AAPL | 120 | 5 | 120 | OPEN_LONG | - |
| 3 | applyFill | AAPL | 110 | 5 | 110 | CLOSE_LONG | FIFO |

**Expected with FIFO:**
- Closes first lot at 100 (cost=600)
- PnL = (110*5 - 110) - 600 = -160

Test again with LIFO:

| 3b | applyFill | AAPL | 110 | 5 | 110 | CLOSE_LONG | LIFO |

**Expected with LIFO:**
- Closes second lot at 120 (cost=720)
- PnL = (110*5 - 110) - 720 = -280

### 7. Error Handling - Close Non-Existent Position

Attempt to close a position that doesn't exist.

| Step | Action | Symbol | Price | Qty | Comm | Effect |
|------|--------|--------|-------|-----|------|--------|
| 1 | applyFill | AAPL | 100 | 10 | 100 | CLOSE_LONG |

**Expected Result:**
- Throws error: "No long position found for AAPL"

### 8. Partial Fills - Same Order ID

Apply partial fills from the same order.

| Step | Action | Symbol | Price | Qty | Comm | Effect | OrderId |
|------|--------|--------|-------|-----|------|--------|---------|
| 1 | applyFill | AAPL | 100 | 5 | 50 | OPEN_LONG | order-1 |
| 2 | applyFill | AAPL | 100 | 5 | 50 | OPEN_LONG | order-1 |

**Expected Result:**
- Both fills applied independently
- Final position: qty=10, totalCost=1,100
- Note: Fill processing doesn't track order state; that's OrderState's responsibility

### 9. Mixed Long and Short Positions

Apply fills for both long and short positions in the same currency.

| Step | Action | Symbol | Price | Qty | Comm | Effect |
|------|--------|--------|-------|-----|------|--------|
| 1 | applyFill | AAPL | 100 | 10 | 100 | OPEN_LONG |
| 2 | applyFill | TSLA | 200 | 5 | 200 | OPEN_SHORT |

**Expected Result:**
- AAPL long: qty=10, totalCost=1,100
- TSLA short: qty=5, totalProceeds=800
- Cash: 100,000 - 1,100 + 800 = 99,700

### 10. Commission Allocation

Verify commission is properly allocated in all scenarios.

| Step | Action | Symbol | Price | Qty | Comm | Effect |
|------|--------|--------|-------|-----|------|--------|
| 1 | applyFill | AAPL | 100 | 10 | 100 | OPEN_LONG |
| 2 | applyFill | AAPL | 110 | 10 | 110 | CLOSE_LONG |

**Expected Result:**
- Step 1: totalCommission=100
- Step 2: totalCommission=210
- PnL calculation includes commission properly
