# Test Plan: Short Position Operations

## Test Data Guidelines
- Commission: Use lot price as commission for easier calculation
- Starting cash: 100,000 USD

## Test Cases

### 1. Open Short - Single Lot
| Step | Action | Price | Quantity | Commission | Expected Cash | Expected Position Qty | Expected Total Proceeds | Expected Avg Proceeds |
|------|--------|-------|----------|------------|---------------|----------------------|------------------------|----------------------|
| 1    | Open Short | 100 | 10 | 100 | 100,900 | 10 | 900 | 90 |

**Verification:**
- Cash: 100,000 + (100 * 10 - 100) = 100,900
- Position: 1 lot with quantity 10
- TotalProceeds: 900
- Average Proceeds: 900 / 10 = 90

### 2. Open Short - Multiple Lots
| Step | Action | Price | Quantity | Commission | Expected Cash | Expected Position Qty | Expected Total Proceeds | Expected Avg Proceeds |
|------|--------|-------|----------|------------|---------------|----------------------|------------------------|----------------------|
| 1    | Open Short | 100 | 10 | 100 | 100,900 | 10 | 900 | 90 |
| 2    | Open Short | 120 | 5 | 120 | 101,380 | 15 | 1,380 | 92 |

**Verification Step 2:**
- Cash: 100,900 + (120 * 5 - 120) = 101,380
- Position: 2 lots with total quantity 15
- TotalProceeds: 900 + 480 = 1,380
- Average Proceeds: 1,380 / 15 = 92

### 3. Close Short - FIFO Strategy - Partial Close (Profit)
| Step | Action | Price | Quantity | Commission | Expected Cash | Expected Position Qty | Expected Realized PnL |
|------|--------|-------|----------|------------|---------------|----------------------|----------------------|
| 1    | Open Short | 100 | 10 | 100 | 100,900 | 10 | 0 |
| 2    | Open Short | 120 | 10 | 120 | 101,980 | 20 | 0 |
| 3    | Close Short (FIFO) | 80 | 5 | 80 | 101,500 | 15 | -30 |

**Verification Step 3:**
- Closes from first lot (price 100, totalProceeds 900)
- Proceeds basis for 5 shares: 900 / 10 * 5 = 450
- Cost to buy back: 80 * 5 + 80 = 480
- Realized PnL: 450 - 480 = -30
- Cash: 101,980 - 480 = 101,500
- Remaining lot 1: quantity 5, totalProceeds 450
- Lot 2 unchanged: quantity 10, totalProceeds 1,080

### 4. Close Short - LIFO Strategy - Partial Close (Loss)
| Step | Action | Price | Quantity | Commission | Expected Cash | Expected Position Qty | Expected Realized PnL |
|------|--------|-------|----------|------------|---------------|----------------------|----------------------|
| 1    | Open Short | 100 | 10 | 100 | 100,900 | 10 | 0 |
| 2    | Open Short | 120 | 10 | 120 | 101,980 | 20 | 0 |
| 3    | Close Short (LIFO) | 80 | 5 | 80 | 101,500 | 15 | 60 |

**Verification Step 3:**
- Closes from second lot (price 120, totalProceeds 1,080)
- Proceeds basis for 5 shares: 1,080 / 10 * 5 = 540
- Cost to buy back: 80 * 5 + 80 = 480
- Realized PnL: 540 - 480 = 60
- Cash: 101,980 - 480 = 101,500
- Lot 1 unchanged: quantity 10, totalProceeds 900
- Remaining lot 2: quantity 5, totalProceeds 540

### 5. Close Short - Complete Position Close (Profit)
| Step | Action | Price | Quantity | Commission | Expected Cash | Expected Position Qty | Expected Realized PnL |
|------|--------|-------|----------|------------|---------------|----------------------|----------------------|
| 1    | Open Short | 100 | 10 | 100 | 100,900 | 10 | 0 |
| 2    | Close Short | 80 | 10 | 80 | 100,020 | 0 | 20 |

**Verification Step 2:**
- Proceeds basis: 900 (entire lot)
- Cost to buy back: 80 * 10 + 80 = 880
- Realized PnL: 900 - 880 = 20
- Cash: 100,900 - 880 = 100,020
- Position deleted (no lots remain)

### 6. Close Short - Multiple Lots FIFO
| Step | Action | Price | Quantity | Commission | Expected Cash | Expected Position Qty | Expected Realized PnL |
|------|--------|-------|----------|------------|---------------|----------------------|----------------------|
| 1    | Open Short | 100 | 10 | 100 | 100,900 | 10 | 0 |
| 2    | Open Short | 120 | 10 | 120 | 101,980 | 20 | 0 |
| 3    | Close Short (FIFO) | 80 | 15 | 80 | 100,700 | 5 | 160 |

**Verification Step 3:**
- Closes entire first lot (10 shares): proceeds basis = 900
- Closes 5 from second lot: proceeds basis = 1,080 / 10 * 5 = 540
- Total proceeds basis: 900 + 540 = 1,440
- Cost: 80 * 15 + 80 = 1,280
- Realized PnL: 1,440 - 1,280 = 160
- Cash: 101,980 - 1,280 = 100,700
- Remaining lot 2: quantity 5, totalProceeds 540

### 7. Close Short - Loss Scenario
| Step | Action | Price | Quantity | Commission | Expected Cash | Expected Position Qty | Expected Realized PnL |
|------|--------|-------|----------|------------|---------------|----------------------|----------------------|
| 1    | Open Short | 100 | 10 | 100 | 100,900 | 10 | 0 |
| 2    | Close Short | 130 | 10 | 130 | 99,470 | 0 | -530 |

**Verification Step 2:**
- Proceeds basis: 900
- Cost to buy back: 130 * 10 + 130 = 1,430
- Realized PnL: 900 - 1,430 = -530
- Cash: 100,900 - 1,430 = 99,470
