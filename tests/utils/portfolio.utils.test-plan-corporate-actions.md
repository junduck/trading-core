# Test Plan: Corporate Actions

## Test Data Guidelines
- Split/Spinoff/Merger ratio: Use 2 or 0.5 for easier calculation
- Tax rate: Use 0.5 for easier calculation
- Starting cash: 100,000 USD

## Test Cases

### 1. Stock Split - 2-for-1 (Long Position)
| Step | Action | Details | Expected Position Qty | Expected Avg Cost | Expected Total Cost |
|------|--------|---------|----------------------|-------------------|---------------------|
| 1    | Open Long | price=100, qty=10, comm=100 | 10 | 110 | 1,100 |
| 2    | Stock Split | ratio=2 | 20 | 55 | 1,100 |

**Verification Step 2:**
- Quantity: 10 * 2 = 20
- TotalCost: unchanged = 1,100
- Average Cost: 1,100 / 20 = 55
- Lot quantities doubled, totalCost unchanged

### 2. Stock Split - 1-for-2 Reverse Split (Long Position)
| Step | Action | Details | Expected Position Qty | Expected Avg Cost | Expected Total Cost |
|------|--------|---------|----------------------|-------------------|---------------------|
| 1    | Open Long | price=100, qty=10, comm=100 | 10 | 110 | 1,100 |
| 2    | Stock Split | ratio=0.5 | 5 | 220 | 1,100 |

**Verification Step 2:**
- Quantity: 10 * 0.5 = 5
- TotalCost: unchanged = 1,100
- Average Cost: 1,100 / 5 = 220

### 3. Stock Split - Short Position
| Step | Action | Details | Expected Position Qty | Expected Avg Proceeds | Expected Total Proceeds |
|------|--------|---------|----------------------|----------------------|------------------------|
| 1    | Open Short | price=100, qty=10, comm=100 | 10 | 90 | 900 |
| 2    | Stock Split | ratio=2 | 20 | 45 | 900 |

**Verification Step 2:**
- Quantity: 10 * 2 = 20
- TotalProceeds: unchanged = 900
- Average Proceeds: 900 / 20 = 45

### 4. Cash Dividend - No Tax (Long Position)
| Step | Action | Details | Expected Cash | Expected Avg Cost | Expected Total Cost |
|------|--------|---------|---------------|-------------------|---------------------|
| 1    | Open Long | price=100, qty=10, comm=100 | 98,900 | 110 | 1,100 |
| 2    | Cash Dividend | amountPerShare=10, taxRate=0 | 99,000 | 100 | 1,000 |

**Verification Step 2:**
- Dividend amount: 10 * 10 = 100
- Cash: 98,900 + 100 = 99,000
- Total Cost reduced: 1,100 - 100 = 1,000
- Average Cost: 1,000 / 10 = 100

### 5. Cash Dividend - With Tax (Long Position)
| Step | Action | Details | Expected Cash | Expected Avg Cost | Expected Total Cost |
|------|--------|---------|---------------|-------------------|---------------------|
| 1    | Open Long | price=100, qty=10, comm=100 | 98,900 | 110 | 1,100 |
| 2    | Cash Dividend | amountPerShare=10, taxRate=0.5 | 98,950 | 105 | 1,050 |

**Verification Step 2:**
- Dividend before tax: 10 * 10 = 100
- After tax: 100 * (1 - 0.5) = 50
- Cash: 98,900 + 50 = 98,950
- Total Cost reduced: 1,100 - 50 = 1,050
- Average Cost: 1,050 / 10 = 105

### 6. Cash Dividend - Short Position (Owe Dividend)
| Step | Action | Details | Expected Cash | Expected Avg Proceeds | Expected Total Proceeds |
|------|--------|---------|---------------|----------------------|------------------------|
| 1    | Open Short | price=100, qty=10, comm=100 | 100,900 | 90 | 900 |
| 2    | Cash Dividend | amountPerShare=10 | 100,800 | 80 | 800 |

**Verification Step 2:**
- Dividend owed: 10 * 10 = 100
- Cash: 100,900 - 100 = 100,800
- Total Proceeds reduced: 900 - 100 = 800
- Average Proceeds: 800 / 10 = 80

### 7. Stock Spinoff - Long Position
| Step | Action | Details | Original Position Qty | New Position Qty | New Avg Cost |
|------|--------|---------|----------------------|------------------|--------------|
| 1    | Open Long AAPL | price=100, qty=10, comm=100 | 10 | - | - |
| 2    | Spinoff | ratio=0.5, newSymbol=NEWCO | 10 | 5 | 0 |

**Verification Step 2:**
- Original position (AAPL): unchanged, qty=10
- New position (NEWCO): qty = 10 * 0.5 = 5
- New position totalCost: 0 (spinoff has no cost basis)
- New position averageCost: 0

### 8. Stock Spinoff - Short Position
| Step | Action | Details | Original Position Qty | New Position Qty | New Avg Proceeds |
|------|--------|---------|----------------------|------------------|------------------|
| 1    | Open Short AAPL | price=100, qty=10, comm=100 | 10 | - | - |
| 2    | Spinoff | ratio=0.5, newSymbol=NEWCO | 10 | 5 | 0 |

**Verification Step 2:**
- Original position (AAPL): unchanged, qty=10
- New short position (NEWCO): qty = 10 * 0.5 = 5
- New position totalProceeds: 0 (spinoff has no proceeds)
- New position averageProceeds: 0

### 9. Stock Merger - No Cash Component (Long Position)
| Step | Action | Details | Old Position Qty | New Position Qty | New Avg Cost |
|------|--------|---------|------------------|------------------|--------------|
| 1    | Open Long TARGET | price=100, qty=10, comm=100 | 10 | - | - |
| 2    | Merger | ratio=2, newSymbol=ACQUIRER, cash=0 | deleted | 20 | 55 |

**Verification Step 2:**
- Old position (TARGET): deleted
- New position (ACQUIRER): qty = 10 * 2 = 20
- New totalCost: 1,100 (transferred from old position)
- New averageCost: 1,100 / 20 = 55
- Cash: unchanged = 98,900

### 10. Stock Merger - With Cash Component (Long Position)
| Step | Action | Details | Expected Cash | New Position Qty | New Total Cost |
|------|--------|---------|---------------|------------------|----------------|
| 1    | Open Long TARGET | price=100, qty=10, comm=100 | 98,900 | - | - |
| 2    | Merger | ratio=2, cashComponent=10 | 99,000 | 20 | 1,000 |

**Verification Step 2:**
- Cash received: 10 * 10 = 100
- Cash: 98,900 + 100 = 99,000
- New position qty: 10 * 2 = 20
- New totalCost: 1,100 - 100 = 1,000
- New averageCost: 1,000 / 20 = 50

### 11. Stock Merger - Short Position with Cash
| Step | Action | Details | Expected Cash | New Position Qty | New Total Proceeds |
|------|--------|---------|---------------|------------------|--------------------|
| 1    | Open Short TARGET | price=100, qty=10, comm=100 | 100,900 | - | - |
| 2    | Merger | ratio=2, cashComponent=10 | 100,800 | 20 | 800 |

**Verification Step 2:**
- Cash owed: 10 * 10 = 100
- Cash: 100,900 - 100 = 100,800
- New position qty: 10 * 2 = 20
- New totalProceeds: 900 - 100 = 800
- New averageProceeds: 800 / 20 = 40

### 12. Multiple Corporate Actions Sequence
| Step | Action | Details | Position Qty | Avg Cost/Proceeds | Cash |
|------|--------|---------|--------------|-------------------|------|
| 1    | Open Long | price=100, qty=10, comm=100 | 10 | 110 | 98,900 |
| 2    | Split | ratio=2 | 20 | 55 | 98,900 |
| 3    | Dividend | amountPerShare=5, taxRate=0 | 20 | 50 | 99,000 |
| 4    | Split | ratio=0.5 | 10 | 100 | 99,000 |

**Verification:**
- Step 2: qty=20, totalCost=1,100, avgCost=55
- Step 3: dividend=100, cash=99,000, totalCost=1,000, avgCost=50
- Step 4: qty=10, totalCost=1,000, avgCost=100

### 13. Stock Spinoff into Already Open Long Position
| Step | Action | Details | AAPL Position Qty | NEWCO Position Qty | NEWCO Avg Cost | NEWCO Total Cost |
|------|--------|---------|-------------------|--------------------|-----------------|--------------------|
| 1    | Open Long AAPL | price=100, qty=10, comm=100 | 10 | - | - | - |
| 2    | Open Long NEWCO | price=50, qty=20, comm=50 | 10 | 20 | 52.5 | 1,050 |
| 3    | Spinoff AAPL→NEWCO | ratio=0.5 | 10 | 25 | 42 | 1,050 |

**Verification Step 3:**
- AAPL position: unchanged, qty=10
- Original NEWCO: qty=20, totalCost=1,050, avgCost=52.5
- Spinoff adds: qty=5 (10 * 0.5), totalCost=0
- Combined NEWCO: qty=25, totalCost=1,050, avgCost=42
- Cash: 100,000 - 1,100 - 1,050 = 97,850

### 14. Stock Spinoff into Already Open Short Position
| Step | Action | Details | AAPL Position Qty | NEWCO Position Qty | NEWCO Avg Proceeds | NEWCO Total Proceeds |
|------|--------|---------|-------------------|--------------------|--------------------|-----------------------|
| 1    | Open Short AAPL | price=100, qty=10, comm=100 | 10 | - | - | - |
| 2    | Open Short NEWCO | price=50, qty=20, comm=50 | 10 | 20 | 47.5 | 950 |
| 3    | Spinoff AAPL→NEWCO | ratio=0.5 | 10 | 25 | 38 | 950 |

**Verification Step 3:**
- AAPL position: unchanged, qty=10
- Original NEWCO: qty=20, totalProceeds=950 (20*50-50), avgProceeds=47.5
- Spinoff adds: qty=5, totalProceeds=0
- Combined NEWCO: qty=25, totalProceeds=950, avgProceeds=38
- Cash: 100,000 + 900 + 950 = 101,850

### 15. Stock Merger into Already Open Long Position
| Step | Action | Details | TARGET Qty | ACQUIRER Qty | ACQUIRER Avg Cost | ACQUIRER Total Cost | Cash |
|------|--------|---------|------------|--------------|-------------------|---------------------|------|
| 1    | Open Long TARGET | price=100, qty=10, comm=100 | 10 | - | - | - | 98,900 |
| 2    | Open Long ACQUIRER | price=50, qty=20, comm=50 | 10 | 20 | 52.5 | 1,050 | 97,850 |
| 3    | Merger TARGET→ACQUIRER | ratio=2, cashComponent=10 | deleted | 40 | 51.25 | 2,050 | 97,950 |

**Verification Step 3:**
- TARGET position: deleted
- Original ACQUIRER: qty=20, totalCost=1,050
- From merger: qty=20 (10*2), totalCost=1,000 (1,100 - 100 cash received)
- Combined ACQUIRER: qty=40, totalCost=2,050, avgCost=51.25
- Cash from merger: 10 * 10 = 100
- Final cash: 97,850 + 100 = 97,950

### 16. Stock Merger into Already Open Short Position
| Step | Action | Details | TARGET Qty | ACQUIRER Qty | ACQUIRER Avg Proceeds | ACQUIRER Total Proceeds | Cash |
|------|--------|---------|------------|--------------|----------------------|------------------------|------|
| 1    | Open Short TARGET | price=100, qty=10, comm=100 | 10 | - | - | - | 100,900 |
| 2    | Open Short ACQUIRER | price=50, qty=20, comm=50 | 10 | 20 | 47.5 | 950 | 101,850 |
| 3    | Merger TARGET→ACQUIRER | ratio=2, cashComponent=10 | deleted | 40 | 43.75 | 1,750 | 101,750 |

**Verification Step 3:**
- TARGET position: deleted
- Original ACQUIRER: qty=20, totalProceeds=950
- From merger: qty=20, totalProceeds=800 (900 - 100 cash owed)
- Combined ACQUIRER: qty=40, totalProceeds=1,750, avgProceeds=43.75
- Cash owed for merger: 10 * 10 = 100
- Final cash: 101,850 - 100 = 101,750
