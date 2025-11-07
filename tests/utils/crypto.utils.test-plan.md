# Test Plan: Crypto Utilities

## Test Data Guidelines
- Hard fork/swap ratio: Use 2 or 0.5 for easier calculation
- Airdrop amounts: Use simple multiples (10, 100, etc.)
- Staking rewards: Use 0.5 for easier calculation
- Starting cash: 100,000 USD

## Test Cases

### 1. Hard Fork - 1-for-1 Ratio (Long Position)
| Step | Action | Details | BTC Position Qty | BCH Position Qty | BCH Avg Cost | BCH Total Cost |
|------|--------|---------|------------------|------------------|--------------|----------------|
| 1    | Open Long BTC | price=100, qty=10, comm=100 | 10 | - | - | - |
| 2    | Hard Fork | ratio=1, newAsset=BCH | 10 | 10 | 0 | 0 |

**Verification Step 2:**
- Original BTC position: unchanged, qty=10
- New BCH position: qty = 10 * 1 = 10
- BCH totalCost: 0 (forked coins have no cost basis)
- BCH averageCost: 0
- Cash: unchanged = 98,900

### 2. Hard Fork - 2-for-1 Ratio (Long Position)
| Step | Action | Details | BTC Position Qty | BCH Position Qty | BCH Avg Cost | BCH Total Cost |
|------|--------|---------|------------------|------------------|--------------|----------------|
| 1    | Open Long BTC | price=100, qty=10, comm=100 | 10 | - | - | - |
| 2    | Hard Fork | ratio=2, newAsset=BCH | 10 | 20 | 0 | 0 |

**Verification Step 2:**
- Original BTC position: unchanged, qty=10
- New BCH position: qty = 10 * 2 = 20
- BCH totalCost: 0
- BCH averageCost: 0

### 3. Hard Fork - Short Position
| Step | Action | Details | BTC Position Qty | BCH Position Qty | BCH Avg Proceeds | BCH Total Proceeds |
|------|--------|---------|------------------|------------------|------------------|--------------------|
| 1    | Open Short BTC | price=100, qty=10, comm=100 | 10 | - | - | - |
| 2    | Hard Fork | ratio=2, newAsset=BCH | 10 | 20 | 0 | 0 |

**Verification Step 2:**
- Original BTC short: unchanged, qty=10
- New BCH short: qty = 10 * 2 = 20
- BCH totalProceeds: 0
- BCH averageProceeds: 0

### 4. Airdrop - Proportional to Holdings (Long Position)
| Step | Action | Details | ETH Position Qty | AIRDROP Position Qty | AIRDROP Total Cost |
|------|--------|---------|------------------|----------------------|--------------------|
| 1    | Open Long ETH | price=100, qty=10, comm=100 | 10 | - | - |
| 2    | Airdrop | amountPerToken=2, airdropAsset=AIRDROP | 10 | 20 | 0 |

**Verification Step 2:**
- Original ETH position: unchanged, qty=10
- Airdrop quantity: 10 * 2 = 20
- AIRDROP totalCost: 0 (airdropped tokens have no cost basis)
- AIRDROP averageCost: 0

### 5. Airdrop - Fixed Amount (No Holder Asset)
| Step | Action | Details | AIRDROP Position Qty | AIRDROP Total Cost |
|------|--------|---------|----------------------|--------------------|
| 1    | Airdrop | fixedAmount=100, airdropAsset=AIRDROP | 100 | 0 |

**Verification Step 1:**
- Airdrop quantity: 100
- AIRDROP totalCost: 0
- AIRDROP averageCost: 0

### 6. Airdrop - No Holdings (Should Do Nothing)
| Step | Action | Details | AIRDROP Position Qty |
|------|--------|---------|----------------------|
| 1    | Airdrop | holderAsset=ETH (not held), amountPerToken=2 | - |

**Verification Step 1:**
- No airdrop received (no ETH holdings)
- AIRDROP position: undefined

### 7. Airdrop - Into Existing Position
| Step | Action | Details | ETH Position Qty | AIRDROP Position Qty | AIRDROP Avg Cost | AIRDROP Total Cost |
|------|--------|---------|------------------|----------------------|------------------|--------------------|
| 1    | Open Long ETH | price=100, qty=10, comm=100 | 10 | - | - | - |
| 2    | Open Long AIRDROP | price=50, qty=20, comm=50 | 10 | 20 | 52.5 | 1,050 |
| 3    | Airdrop | amountPerToken=2, airdropAsset=AIRDROP | 10 | 40 | 26.25 | 1,050 |

**Verification Step 3:**
- ETH position: unchanged, qty=10
- Original AIRDROP: qty=20, totalCost=1,050
- Airdrop adds: qty=20 (10 * 2), totalCost=0
- Combined AIRDROP: qty=40, totalCost=1,050, avgCost=26.25

### 8. Token Swap - 1-for-1 (Long Position)
| Step | Action | Details | OLD Position | NEW Position Qty | NEW Avg Cost | NEW Total Cost |
|------|--------|---------|--------------|------------------|--------------|----------------|
| 1    | Open Long OLD | price=100, qty=10, comm=100 | qty=10 | - | - | - |
| 2    | Token Swap | ratio=1, newAsset=NEW | deleted | 10 | 110 | 1,100 |

**Verification Step 2:**
- OLD position: deleted
- NEW position: qty = 10 * 1 = 10
- NEW totalCost: 1,100 (transferred, preserves cost basis)
- NEW averageCost: 1,100 / 10 = 110

### 9. Token Swap - 2-for-1 (Long Position)
| Step | Action | Details | OLD Position | NEW Position Qty | NEW Avg Cost | NEW Total Cost |
|------|--------|---------|--------------|------------------|--------------|----------------|
| 1    | Open Long OLD | price=100, qty=10, comm=100 | qty=10 | - | - | - |
| 2    | Token Swap | ratio=2, newAsset=NEW | deleted | 20 | 55 | 1,100 |

**Verification Step 2:**
- OLD position: deleted
- NEW position: qty = 10 * 2 = 20
- NEW totalCost: 1,100 (transferred)
- NEW averageCost: 1,100 / 20 = 55

### 10. Token Swap - Short Position
| Step | Action | Details | OLD Position | NEW Position Qty | NEW Avg Proceeds | NEW Total Proceeds |
|------|--------|---------|--------------|------------------|------------------|--------------------|
| 1    | Open Short OLD | price=100, qty=10, comm=100 | qty=10 | - | - | - |
| 2    | Token Swap | ratio=2, newAsset=NEW | deleted | 20 | 45 | 900 |

**Verification Step 2:**
- OLD position: deleted
- NEW position: qty = 10 * 2 = 20
- NEW totalProceeds: 900 (transferred)
- NEW averageProceeds: 900 / 20 = 45

### 11. Token Swap - Into Existing Position (Long)
| Step | Action | Details | OLD Position | NEW Position Qty | NEW Avg Cost | NEW Total Cost |
|------|--------|---------|--------------|------------------|--------------|----------------|
| 1    | Open Long OLD | price=100, qty=10, comm=100 | qty=10 | - | - | - |
| 2    | Open Long NEW | price=50, qty=20, comm=50 | qty=10 | 20 | 52.5 | 1,050 |
| 3    | Token Swap | ratio=2, newAsset=NEW | deleted | 40 | 53.75 | 2,150 |

**Verification Step 3:**
- OLD position: deleted
- Original NEW: qty=20, totalCost=1,050
- From swap: qty=20 (10*2), totalCost=1,100
- Combined NEW: qty=40, totalCost=2,150, avgCost=53.75

### 12. Token Swap - Into Existing Position (Short)
| Step | Action | Details | OLD Position | NEW Position Qty | NEW Avg Proceeds | NEW Total Proceeds |
|------|--------|---------|--------------|------------------|------------------|--------------------|
| 1    | Open Short OLD | price=100, qty=10, comm=100 | qty=10 | - | - | - |
| 2    | Open Short NEW | price=50, qty=20, comm=50 | qty=10 | 20 | 47.5 | 950 |
| 3    | Token Swap | ratio=2, newAsset=NEW | deleted | 40 | 46.25 | 1,850 |

**Verification Step 3:**
- OLD position: deleted
- Original NEW: qty=20, totalProceeds=950
- From swap: qty=20, totalProceeds=900
- Combined NEW: qty=40, totalProceeds=1,850, avgProceeds=46.25

### 13. Staking Reward - Long Position
| Step | Action | Details | ETH Position Qty | ETH Avg Cost | ETH Total Cost |
|------|--------|---------|------------------|--------------|----------------|
| 1    | Open Long ETH | price=100, qty=10, comm=100 | 10 | 110 | 1,100 |
| 2    | Staking Reward | rewardPerToken=0.5 | 15 | 73.33 | 1,100 |

**Verification Step 2:**
- Reward quantity: 10 * 0.5 = 5
- New quantity: 10 + 5 = 15
- TotalCost: unchanged = 1,100 (rewards have no cost)
- Average Cost: 1,100 / 15 = 73.33

### 14. Staking Reward - No Position (Should Return 0)
| Step | Action | Details | Rewards Received |
|------|--------|---------|------------------|
| 1    | Staking Reward | asset=ETH (not held), rewardPerToken=0.5 | 0 |

**Verification Step 1:**
- No ETH holdings
- Rewards received: 0

### 15. Multiple Crypto Actions Sequence
| Step | Action | Details | BTC Qty | BCH Qty | ETH Qty | Notes |
|------|--------|---------|---------|---------|---------|-------|
| 1    | Open Long BTC | price=100, qty=10, comm=100 | 10 | - | - | Cash=98,900 |
| 2    | Hard Fork BTC→BCH | ratio=1 | 10 | 10 | - | Cash=98,900 |
| 3    | Staking Reward BTC | rewardPerToken=0.5 | 15 | 10 | - | Cash=98,900 |
| 4    | Token Swap BCH→ETH | ratio=2 | 15 | deleted | 20 | Cash=98,900 |

**Verification:**
- Step 2: BTC qty=10, BCH qty=10 (cost=0)
- Step 3: BTC qty=15, totalCost=1,100, avgCost=73.33
- Step 4: BCH deleted, ETH qty=20, totalCost=0, avgCost=0
