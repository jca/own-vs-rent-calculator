/**
 * Unit tests for calculation utilities
 * Tests each function with various inputs to ensure valid results
 */

import {
  calculateMonthlyPayment,
  calculateRemainingBalance,
  calculateInvestmentGrowth,
  calculateInvestmentGrowthWithVariableContributions,
  calculateHomeEquity,
  calculateMonthlyHousingCost,
  calculateRentalCosts,
  calculateScenario
} from '../calculations';

describe('calculateMonthlyPayment', () => {
  test('should calculate correct payment for standard mortgage', () => {
    const payment = calculateMonthlyPayment(400000, 6.5, 30);
    expect(payment).toBeCloseTo(2528.27, 2);
    expect(payment).toBeGreaterThan(0);
    expect(isFinite(payment)).toBe(true);
  });

  test('should handle zero principal', () => {
    const payment = calculateMonthlyPayment(0, 6.5, 30);
    expect(payment).toBe(0);
  });

  test('should handle zero interest rate', () => {
    const payment = calculateMonthlyPayment(300000, 0, 30);
    expect(payment).toBeCloseTo(833.33, 2);
    expect(payment).toBeGreaterThan(0);
  });

  test('should handle zero term', () => {
    const payment = calculateMonthlyPayment(300000, 6.5, 0);
    expect(payment).toBe(0);
  });

  test('should handle negative inputs gracefully', () => {
    expect(calculateMonthlyPayment(-100000, 6.5, 30)).toBe(0);
    expect(calculateMonthlyPayment(300000, -2, 30)).toBe(0);
    expect(calculateMonthlyPayment(300000, 6.5, -5)).toBe(0);
  });

  test('should return finite numbers for extreme values', () => {
    const payment = calculateMonthlyPayment(1000000, 15, 5);
    expect(isFinite(payment)).toBe(true);
    expect(payment).toBeGreaterThan(0);
  });
});

describe('calculateRemainingBalance', () => {
  test('should calculate correct remaining balance', () => {
    const balance = calculateRemainingBalance(400000, 6.5, 30, 60);
    expect(balance).toBeGreaterThan(0);
    expect(balance).toBeLessThan(400000);
    expect(isFinite(balance)).toBe(true);
  });

  test('should return zero when loan is paid off', () => {
    const balance = calculateRemainingBalance(300000, 6.5, 30, 360);
    expect(balance).toBeCloseTo(0, 2);
  });

  test('should handle zero principal', () => {
    const balance = calculateRemainingBalance(0, 6.5, 30, 60);
    expect(balance).toBe(0);
  });

  test('should handle zero interest rate', () => {
    const balance = calculateRemainingBalance(300000, 0, 30, 60);
    expect(balance).toBeGreaterThan(0);
    expect(balance).toBeLessThan(300000);
    expect(isFinite(balance)).toBe(true);
  });

  test('should never return negative balance', () => {
    const balance = calculateRemainingBalance(100000, 1, 30, 500);
    expect(balance).toBeGreaterThanOrEqual(0);
  });

  test('should handle edge cases', () => {
    expect(calculateRemainingBalance(0, 0, 0, 0)).toBe(0);
    expect(calculateRemainingBalance(100000, 6.5, 0, 12)).toBe(0);
  });
});

describe('calculateInvestmentGrowth', () => {
  test('should calculate investment growth correctly', () => {
    const growth = calculateInvestmentGrowth(10000, 500, 7, 120);
    expect(growth).toHaveLength(121); // 0 to 120 months
    expect(growth[0]).toBe(10000); // Initial value
    expect(growth[120]).toBeGreaterThan(10000); // Should grow
    expect(growth.every(value => isFinite(value))).toBe(true);
  });

  test('should handle zero inputs', () => {
    const growth = calculateInvestmentGrowth(0, 0, 0, 0);
    expect(growth).toEqual([0]);
  });

  test('should handle zero monthly contribution', () => {
    const growth = calculateInvestmentGrowth(10000, 0, 7, 12);
    expect(growth[0]).toBe(10000);
    expect(growth[12]).toBeGreaterThan(10000); // Should still grow from returns
  });

  test('should handle zero return rate', () => {
    const growth = calculateInvestmentGrowth(10000, 500, 0, 12);
    expect(growth[0]).toBe(10000);
    expect(growth[12]).toBe(16000); // 10000 + 12 * 500
  });

  test('should handle negative months', () => {
    const growth = calculateInvestmentGrowth(10000, 500, 7, -5);
    expect(growth).toEqual([10000]);
  });

  test('should always return finite values', () => {
    const growth = calculateInvestmentGrowth(50000, 2000, 15, 60);
    expect(growth.every(value => isFinite(value))).toBe(true);
    expect(growth.every(value => value >= 0)).toBe(true);
  });
});

describe('calculateInvestmentGrowthWithVariableContributions', () => {
  test('should calculate growth with variable contributions', () => {
    const contributions = [500, 600, 700, 800];
    const growth = calculateInvestmentGrowthWithVariableContributions(10000, contributions, 7, 4);
    expect(growth).toHaveLength(5); // 0 to 4 months
    expect(growth[0]).toBe(10000);
    expect(growth[4]).toBeGreaterThan(10000);
    expect(growth.every(value => isFinite(value))).toBe(true);
  });

  test('should handle empty contributions array', () => {
    const growth = calculateInvestmentGrowthWithVariableContributions(10000, [], 7, 0);
    expect(growth).toEqual([10000]);
  });

  test('should handle zero inputs', () => {
    const growth = calculateInvestmentGrowthWithVariableContributions(0, [0], 0, 1);
    expect(growth).toEqual([0, 0]);
  });
});

describe('calculateHomeEquity', () => {
  test('should calculate home equity correctly', () => {
    const equity = calculateHomeEquity(500000, 3, 100000, 400000, 6.5, 30, 120);
    expect(equity).toHaveLength(121);
    expect(equity[0]).toBeCloseTo(100000, 2); // Initial down payment (allow for floating point precision)
    expect(equity[120]).toBeGreaterThan(100000); // Should increase over time
    expect(equity.every(value => isFinite(value))).toBe(true);
  });

  test('should never exceed home value', () => {
    const equity = calculateHomeEquity(300000, 5, 60000, 240000, 4, 15, 180);
    for (let month = 0; month < equity.length; month++) {
      const years = month / 12;
      const currentValue = 300000 * Math.pow(1.05, years);
      expect(equity[month]).toBeLessThanOrEqual(currentValue);
    }
  });

  test('should handle zero down payment', () => {
    const equity = calculateHomeEquity(400000, 3, 0, 400000, 6.5, 30, 60);
    expect(equity[0]).toBe(0);
    expect(equity[60]).toBeGreaterThan(0); // Should build equity through payments
  });

  test('should handle zero home price', () => {
    const equity = calculateHomeEquity(0, 3, 0, 0, 6.5, 30, 60);
    expect(equity.every(value => value === 0)).toBe(true);
  });

  test('should be non-negative', () => {
    const equity = calculateHomeEquity(200000, 2, 20000, 180000, 8, 30, 360);
    expect(equity.every(value => value >= 0)).toBe(true);
  });
});

describe('calculateMonthlyHousingCost', () => {
  test('should calculate total housing cost correctly', () => {
    const cost = calculateMonthlyHousingCost(2000, 6000, 1200, 3000, 150);
    // 2000 + (6000/12) + (1200/12) + (3000/12) + 150 = 2000 + 500 + 100 + 250 + 150 = 3000
    expect(cost).toBeCloseTo(3000, 2);
    expect(cost).toBeGreaterThan(0);
    expect(isFinite(cost)).toBe(true);
  });

  test('should handle zero inputs', () => {
    const cost = calculateMonthlyHousingCost(0, 0, 0, 0, 0);
    expect(cost).toBe(0);
  });

  test('should handle partial zero inputs', () => {
    const cost = calculateMonthlyHousingCost(2000, 0, 0, 0, 0);
    expect(cost).toBe(2000);
  });
});

describe('calculateRentalCosts', () => {
  test('should calculate rental costs with increases', () => {
    const costs = calculateRentalCosts(2000, 3, 24);
    expect(costs).toHaveLength(25); // 0 to 24 months
    expect(costs[0]).toBe(2000);
    expect(costs[12]).toBeCloseTo(2060, 2); // ~3% increase after 1 year
    expect(costs[24]).toBeGreaterThan(costs[12]); // Should keep increasing
    expect(costs.every(value => isFinite(value))).toBe(true);
  });

  test('should handle zero rent increase', () => {
    const costs = calculateRentalCosts(1500, 0, 12);
    expect(costs.every(value => value === 1500)).toBe(true);
  });

  test('should handle zero initial rent', () => {
    const costs = calculateRentalCosts(0, 5, 12);
    expect(costs.every(value => value === 0)).toBe(true);
  });
});

describe('calculateScenario - Integration Tests', () => {
  const basicParams = {
    homePrice: 500000,
    downPayment: 20,
    mortgageRate: 6.5,
    loanTerm: 30,
    propertyTaxRate: 1.2,
    homeInsurance: 1500,
    maintenanceCost: 5000,
    hoaFees: 100,
    homeAppreciationRate: 3,
    rentalIncome: 0,
    monthlyRent: 2500,
    rentIncreaseRate: 3,
    investmentStartBalance: 120000,
    monthlyBudget: 4000,
    investmentReturn: 7,
    timeHorizon: 30
  };

  test('should calculate complete scenario successfully', () => {
    const result = calculateScenario(basicParams);
    
    expect(result.ownScenario).toBeDefined();
    expect(result.rentScenario).toBeDefined();
    expect(result.ownScenario.netWorth).toHaveLength(361); // 30 years * 12 + 1
    expect(result.rentScenario.netWorth).toHaveLength(361);
    
    // All values should be finite
    expect(result.ownScenario.netWorth.every(value => isFinite(value))).toBe(true);
    expect(result.rentScenario.netWorth.every(value => isFinite(value))).toBe(true);
    
    // Net worth should generally increase over time
    const ownInitial = result.ownScenario.netWorth[0];
    const ownFinal = result.ownScenario.netWorth[360];
    const rentInitial = result.rentScenario.netWorth[0];
    const rentFinal = result.rentScenario.netWorth[360];
    
    expect(ownFinal).toBeGreaterThan(ownInitial);
    expect(rentFinal).toBeGreaterThan(rentInitial);
  });

  test('should handle zero home price', () => {
    const zeroHomeParams = { ...basicParams, homePrice: 0 };
    const result = calculateScenario(zeroHomeParams);
    
    expect(result.ownScenario.netWorth.every(value => isFinite(value))).toBe(true);
    expect(result.rentScenario.netWorth.every(value => isFinite(value))).toBe(true);
  });

  test('should handle zero time horizon', () => {
    const zeroTimeParams = { ...basicParams, timeHorizon: 0 };
    const result = calculateScenario(zeroTimeParams);
    
    expect(result.ownScenario.netWorth).toHaveLength(1);
    expect(result.rentScenario.netWorth).toHaveLength(1);
  });

  test('should handle zero monthly budget', () => {
    const zeroBudgetParams = { ...basicParams, monthlyBudget: 0 };
    const result = calculateScenario(zeroBudgetParams);
    
    expect(result.ownScenario.netWorth.every(value => isFinite(value))).toBe(true);
    expect(result.rentScenario.netWorth.every(value => isFinite(value))).toBe(true);
  });

  test('should handle rental income scenario', () => {
    const rentalIncomeParams = { ...basicParams, rentalIncome: 1000 };
    const result = calculateScenario(rentalIncomeParams);
    
    expect(result.ownScenario.netWorth.every(value => isFinite(value))).toBe(true);
    expect(result.rentScenario.netWorth.every(value => isFinite(value))).toBe(true);
    
    // Rental income should improve own scenario performance
    const baseResult = calculateScenario(basicParams);
    const finalWithRental = result.ownScenario.netWorth[360];
    const finalWithoutRental = baseResult.ownScenario.netWorth[360];
    
    expect(finalWithRental).toBeGreaterThan(finalWithoutRental);
  });

  test('should ensure home equity never exceeds home value', () => {
    const result = calculateScenario(basicParams);
    
    for (let month = 0; month <= 360; month++) {
      const years = month / 12;
      const currentHomeValue = basicParams.homePrice * Math.pow(1 + basicParams.homeAppreciationRate / 100, years);
      const homeEquity = result.ownScenario.homeEquity[month];
      
      expect(homeEquity).toBeLessThanOrEqual(currentHomeValue);
    }
  });

  test('should handle extreme input values', () => {
    const extremeParams = {
      ...basicParams,
      mortgageRate: 0.1, // Very low rate
      investmentReturn: 50, // Very high return
      homeAppreciationRate: 20, // Very high appreciation
      rentIncreaseRate: 15 // Very high rent increases
    };
    
    const result = calculateScenario(extremeParams);
    
    expect(result.ownScenario.netWorth.every(value => isFinite(value))).toBe(true);
    expect(result.rentScenario.netWorth.every(value => isFinite(value))).toBe(true);
    expect(result.ownScenario.netWorth.every(value => value >= 0)).toBe(true);
    expect(result.rentScenario.netWorth.every(value => value >= 0)).toBe(true);
  });

  test('should validate break-even calculation', () => {
    const result = calculateScenario(basicParams);
    
    if (result.breakEvenPoint !== null) {
      expect(result.breakEvenPoint).toBeGreaterThanOrEqual(0);
      expect(result.breakEvenPoint).toBeLessThanOrEqual(basicParams.timeHorizon);
      expect(isFinite(result.breakEvenPoint)).toBe(true);
    }
  });
});
