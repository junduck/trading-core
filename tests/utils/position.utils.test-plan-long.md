# Test Plan: Long Position Operations

## Test Data Guidelines
- Commission: Use lot price as commission for easier calculation
- Starting cash: 100,000 USD

## Test Cases

### 1. Open Long - Single Lot
| Step | Action | Price | Quantity | Commission | Expected Cash | Expected Position Qty | Expected Total Cost | Expected Avg Cost |
|------|--------|-------|----------|------------|---------------|----------------------|---------------------|-------------------|
| 1    | Open Long | 100 | 10 | 100 | 98,900 | 10 | 1,100 | 110 |

**Verification:**
- Cash: 100,000 - (100 * 10 + 100) = 98,900
- Position: 1 lot with quantity 10
- TotalCost: 1,100

### 2. Open Long - Multiple Lots
| Step | Action | Price | Quantity | Commission | Expected Cash | Expected Position Qty | Expected Total Cost | Expected Avg Cost |
|------|--------|-------|----------|------------|---------------|----------------------|---------------------|-------------------|
| 1    | Open Long | 100 | 10 | 100 | 98,900 | 10 | 1,100 | 110 |
| 2    | Open Long | 120 | 5 | 120 | 98,180 | 15 | 1,820 | 121.33 |

**Verification Step 2:**
- Cash: 98,900 - (120 * 5 + 120) = 98,180
- Position: 2 lots with total quantity 15
- TotalCost: 1,100 + 720 = 1,820

### 3. Close Long - FIFO Strategy - Partial Close
| Step | Action | Price | Quantity | Commission | Expected Cash | Expected Position Qty | Expected Realized PnL |
|------|--------|-------|----------|------------|---------------|----------------------|----------------------|
| 1    | Open Long | 100 | 10 | 100 | 98,900 | 10 | 0 |
| 2    | Open Long | 120 | 10 | 120 | 97,580 | 20 | 0 |
| 3    | Close Long (FIFO) | 150 | 5 | 150 | 98,180 | 15 | 50 |

**Verification Step 3:**
- Closes from first lot (price 100, totalCost 1,100)
- Cost basis for 5 shares: 1,100 / 10 * 5 = 550
- Proceeds: 150 * 5 - 150 = 600
- Realized PnL: 600 - 550 = 50
- Cash: 97,580 + 600 = 98,180
- Remaining lot 1: quantity 5, totalCost 550
- Lot 2 unchanged: quantity 10, totalCost 1,320

### 4. Close Long - LIFO Strategy - Partial Close
| Step | Action | Price | Quantity | Commission | Expected Cash | Expected Position Qty | Expected Realized PnL |
|------|--------|-------|----------|------------|---------------|----------------------|----------------------|
| 1    | Open Long | 100 | 10 | 100 | 98,900 | 10 | 0 |
| 2    | Open Long | 120 | 10 | 120 | 97,580 | 20 | 0 |
| 3    | Close Long (LIFO) | 150 | 5 | 150 | 98,180 | 15 | -60 |

**Verification Step 3:**
- Closes from second lot (price 120, totalCost 1,320)
- Cost basis for 5 shares: 1,320 / 10 * 5 = 660
- Proceeds: 150 * 5 - 150 = 600
- Realized PnL: 600 - 660 = -60
- Cash: 97,580 + 600 = 98,180
- Lot 1 unchanged: quantity 10, totalCost 1,100
- Remaining lot 2: quantity 5, totalCost 660

### 5. Close Long - Complete Position Close
| Step | Action | Price | Quantity | Commission | Expected Cash | Expected Position Qty | Expected Realized PnL |
|------|--------|-------|----------|------------|---------------|----------------------|----------------------|
| 1    | Open Long | 100 | 10 | 100 | 98,900 | 10 | 0 |
| 2    | Close Long | 150 | 10 | 150 | 100,250 | 0 | 250 |

**Verification Step 2:**
- Cost basis: 1,100 (entire lot)
- Proceeds: 150 * 10 - 150 = 1,350
- Realized PnL: 1,350 - 1,100 = 250
- Cash: 98,900 + 1,350 = 100,250
- Position deleted (no lots remain)

### 6. Close Long - Multiple Lots FIFO
| Step | Action | Price | Quantity | Commission | Expected Cash | Expected Position Qty | Expected Realized PnL |
|------|--------|-------|----------|------------|---------------|----------------------|----------------------|
| 1    | Open Long | 100 | 10 | 100 | 98,900 | 10 | 0 |
| 2    | Open Long | 120 | 10 | 120 | 97,580 | 20 | 0 |
| 3    | Close Long (FIFO) | 150 | 15 | 150 | 99,680 | 5 | 340 |

**Verification Step 3:**
- Closes entire first lot (10 shares): cost basis = 1,100
- Closes 5 from second lot: cost basis = 1,320 / 10 * 5 = 660
- Total cost basis: 1,100 + 660 = 1,760
- Proceeds: 150 * 15 - 150 = 2,100
- Realized PnL: 2,100 - 1,760 = 340
- Cash: 97,580 + 2,100 = 99,680
- Remaining lot 2: quantity 5, totalCost 660

### 7. Close Long - Loss Scenario
| Step | Action | Price | Quantity | Commission | Expected Cash | Expected Position Qty | Expected Realized PnL |
|------|--------|-------|----------|------------|---------------|----------------------|----------------------|
| 1    | Open Long | 100 | 10 | 100 | 98,900 | 10 | 0 |
| 2    | Close Long | 80 | 10 | 80 | 99,620 | 0 | -380 |

**Verification Step 2:**
- Cost basis: 1,100
- Proceeds: 80 * 10 - 80 = 720
- Realized PnL: 720 - 1,100 = -380
- Cash: 98,900 + 720 = 99,620
