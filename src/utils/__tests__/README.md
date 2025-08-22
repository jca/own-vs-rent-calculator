# Unit Tests

This directory contains comprehensive unit tests for the Own vs Rent Calculator's financial calculation functions.

## Running Tests

```bash
# Run tests in watch mode (development)
npm test

# Run tests once (CI/production)
npm run test:run

# Run tests with UI
npm run test:ui
```

## Test Coverage

The test suite covers all major calculation functions:

### Core Financial Functions
- **`calculateMonthlyPayment`** - Mortgage payment calculations
- **`calculateRemainingBalance`** - Loan balance over time
- **`calculateInvestmentGrowth`** - Investment growth with fixed contributions
- **`calculateInvestmentGrowthWithVariableContributions`** - Investment growth with changing contributions
- **`calculateHomeEquity`** - Home equity accumulation over time
- **`calculateMonthlyHousingCost`** - Total monthly housing expenses
- **`calculateRentalCosts`** - Rental cost increases over time

### Integration Tests
- **`calculateScenario`** - Complete own vs rent comparison scenarios

## Test Categories

### 1. **Standard Cases**
Tests verify correct calculations with typical input values.

### 2. **Edge Cases**
- Zero values for all inputs (debugging support)
- Negative inputs (should be handled gracefully)
- Extreme values (very high rates, long time horizons)

### 3. **Validation Tests**
- All results are finite numbers
- Home equity never exceeds home value
- Remaining mortgage balance is never negative
- Net worth generally increases over time

### 4. **Mathematical Accuracy**
- Precise calculations with floating-point tolerance
- Compound interest formulas
- Time-based appreciation calculations

## Key Test Scenarios

### Zero Input Validation
All functions handle zero inputs correctly for debugging purposes:
```javascript
calculateMonthlyPayment(0, 6.5, 30) // Returns 0
calculateHomeEquity(0, 3, 0, 0, 6.5, 30, 60) // All equity values are 0
```

### Financial Logic Validation
```javascript
// Home equity should never exceed home value
homeEquity[month] <= currentHomeValue

// Remaining balance should decrease over time
remainingBalance[month] >= remainingBalance[month + 1]

// Investment growth should be positive with positive returns
finalInvestmentValue > initialInvestmentValue
```

### Integration Scenarios
- Standard first-time buyer scenario
- High-income urban professional scenario
- Rental income scenarios
- Extreme market conditions

## Test Framework

- **Vitest** - Fast unit test runner
- **jsdom** - DOM environment for React component testing (if needed)
- **@vitest/ui** - Optional web UI for test visualization

## Debugging Failed Tests

If tests fail, they will show:
1. Which calculation function failed
2. Expected vs actual values
3. Input parameters that caused the failure

This helps identify calculation bugs and ensure all financial logic is correct.
