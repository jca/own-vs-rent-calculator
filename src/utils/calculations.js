/**
 * Financial calculation utilities for the Own vs Rent Calculator
 */

/**
 * Calculate monthly mortgage payment (principal + interest)
 * @param {number} principal - Loan amount
 * @param {number} annualRate - Annual interest rate (percentage)
 * @param {number} termYears - Loan term in years
 * @returns {number} Monthly payment amount
 */
export const calculateMonthlyPayment = (principal, annualRate, termYears) => {
  if (annualRate === 0) {
    return principal / (termYears * 12);
  }
  
  const monthlyRate = annualRate / 12 / 100;
  const numPayments = termYears * 12;
  
  return principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
         (Math.pow(1 + monthlyRate, numPayments) - 1);
};

/**
 * Calculate remaining loan balance at given month
 * @param {number} principal - Original loan amount
 * @param {number} annualRate - Annual interest rate (percentage)
 * @param {number} termYears - Loan term in years
 * @param {number} monthsPaid - Number of months paid
 * @returns {number} Remaining balance
 */
export const calculateRemainingBalance = (principal, annualRate, termYears, monthsPaid) => {
  if (annualRate === 0) {
    return Math.max(0, principal - (principal / (termYears * 12)) * monthsPaid);
  }
  
  const monthlyRate = annualRate / 12 / 100;
  const numPayments = termYears * 12;
  
  if (monthsPaid >= numPayments) {
    return 0;
  }
  
  return principal * (Math.pow(1 + monthlyRate, numPayments) - 
         Math.pow(1 + monthlyRate, monthsPaid)) / 
         (Math.pow(1 + monthlyRate, numPayments) - 1);
};

/**
 * Calculate investment growth with monthly contributions
 * @param {number} principal - Initial investment amount
 * @param {number} monthlyContribution - Monthly investment amount
 * @param {number} annualRate - Annual return rate (percentage)
 * @param {number} months - Number of months
 * @returns {number[]} Array of investment values by month
 */
export const calculateInvestmentGrowth = (principal, monthlyContribution, annualRate, months) => {
  const monthlyRate = annualRate / 12 / 100;
  let balance = principal;
  const values = [balance];
  
  for (let month = 1; month <= months; month++) {
    balance = (balance + monthlyContribution) * (1 + monthlyRate);
    values.push(balance);
  }
  
  return values;
};

/**
 * Calculate home equity over time
 * @param {number} initialPrice - Initial home price
 * @param {number} appreciationRate - Annual appreciation rate (percentage)
 * @param {number} downPayment - Down payment amount
 * @param {number} principal - Loan amount
 * @param {number} mortgageRate - Mortgage interest rate (percentage)
 * @param {number} termYears - Loan term in years
 * @param {number} months - Number of months
 * @returns {number[]} Array of home equity values by month
 */
export const calculateHomeEquity = (initialPrice, appreciationRate, downPayment, principal, mortgageRate, termYears, months) => {
  const equity = [];
  
  for (let month = 0; month <= months; month++) {
    const years = month / 12;
    const currentValue = initialPrice * Math.pow(1 + appreciationRate / 100, years);
    const remainingBalance = calculateRemainingBalance(principal, mortgageRate, termYears, month);
    const equityValue = Math.max(0, currentValue - remainingBalance);
    equity.push(equityValue);
  }
  
  return equity;
};

/**
 * Calculate total monthly housing costs for ownership
 * @param {number} monthlyPayment - Principal and interest payment
 * @param {number} propertyTaxes - Annual property taxes
 * @param {number} homeInsurance - Annual home insurance
 * @param {number} maintenanceCost - Annual maintenance cost
 * @param {number} hoaFees - Monthly HOA fees
 * @returns {number} Total monthly housing cost
 */
export const calculateMonthlyHousingCost = (monthlyPayment, propertyTaxes, homeInsurance, maintenanceCost, hoaFees) => {
  const monthlyTaxes = propertyTaxes / 12;
  const monthlyInsurance = homeInsurance / 12;
  const monthlyMaintenance = maintenanceCost / 12;
  
  return monthlyPayment + monthlyTaxes + monthlyInsurance + monthlyMaintenance + hoaFees;
};

/**
 * Calculate rental costs over time
 * @param {number} initialRent - Initial monthly rent
 * @param {number} rentIncreaseRate - Annual rent increase rate (percentage)
 * @param {number} months - Number of months
 * @returns {number[]} Array of monthly rent amounts
 */
export const calculateRentalCosts = (initialRent, rentIncreaseRate, months) => {
  const rentCosts = [];
  
  for (let month = 0; month <= months; month++) {
    const years = month / 12;
    const currentRent = initialRent * Math.pow(1 + rentIncreaseRate / 100, years);
    rentCosts.push(currentRent);
  }
  
  return rentCosts;
};

/**
 * Calculate complete own vs rent scenario
 * @param {Object} params - All calculation parameters
 * @returns {Object} Complete calculation results
 */
export const calculateScenario = (params) => {
  const {
    homePrice,
    downPayment,
    mortgageRate,
    loanTerm,
    propertyTaxRate,
    homeInsurance,
    maintenanceCost,
    hoaFees,
    monthlyRent,
    rentIncreaseRate,
    investmentStartBalance,
    monthlyInvestment,
    investmentReturn,
    timeHorizon
  } = params;

  const months = timeHorizon * 12;
  const downPaymentAmount = (downPayment / 100) * homePrice;
  const loanAmount = homePrice - downPaymentAmount;
  const monthlyMortgagePayment = calculateMonthlyPayment(loanAmount, mortgageRate, loanTerm);
  const monthlyHousingCost = calculateMonthlyHousingCost(
    monthlyMortgagePayment,
    (propertyTaxRate / 100) * homePrice,
    homeInsurance,
    maintenanceCost,
    hoaFees
  );

  // Own scenario calculations
  const homeEquity = calculateHomeEquity(
    homePrice,
    3, // Assume 3% appreciation if not provided
    downPaymentAmount,
    loanAmount,
    mortgageRate,
    loanTerm,
    months
  );

  const ownInvestments = calculateInvestmentGrowth(
    investmentStartBalance,
    monthlyInvestment,
    investmentReturn,
    months
  );

  const ownNetWorth = homeEquity.map((equity, index) => equity + ownInvestments[index]);

  // Rent scenario calculations
  const rentCosts = calculateRentalCosts(monthlyRent, rentIncreaseRate, months);
  const rentSavings = monthlyHousingCost - monthlyRent; // Initial difference
  const rentInvestments = calculateInvestmentGrowth(
    investmentStartBalance + downPaymentAmount, // Include down payment in investments
    monthlyInvestment + Math.max(0, rentSavings),
    investmentReturn,
    months
  );

  // Calculate cumulative costs
  const ownCumulativeCosts = [];
  const rentCumulativeCosts = [];
  let ownTotal = 0;
  let rentTotal = 0;

  for (let month = 0; month <= months; month++) {
    if (month > 0) {
      ownTotal += monthlyHousingCost;
      rentTotal += rentCosts[month - 1];
    }
    ownCumulativeCosts.push(ownTotal);
    rentCumulativeCosts.push(rentTotal);
  }

  // Find break-even point
  let breakEvenPoint = null;
  for (let month = 0; month <= months; month++) {
    if (ownNetWorth[month] > rentInvestments[month]) {
      breakEvenPoint = month / 12;
      break;
    }
  }

  return {
    ownScenario: {
      netWorth: ownNetWorth,
      homeEquity: homeEquity,
      investments: ownInvestments,
      totalCosts: ownCumulativeCosts,
      monthlyPayments: Array(months + 1).fill(monthlyHousingCost)
    },
    rentScenario: {
      netWorth: rentInvestments,
      investments: rentInvestments,
      totalCosts: rentCumulativeCosts,
      monthlyPayments: rentCosts
    },
    breakEvenPoint: breakEvenPoint,
    downPaymentAmount: downPaymentAmount,
    monthlyMortgagePayment: monthlyMortgagePayment,
    monthlyHousingCost: monthlyHousingCost
  };
};

/**
 * Format currency values
 * @param {number} value - Numeric value
 * @param {boolean} compact - Use compact notation for large numbers
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (value, compact = false) => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: compact && Math.abs(value) >= 1000 ? 'compact' : 'standard',
    maximumFractionDigits: 0
  });
  
  return formatter.format(value);
};

/**
 * Format percentage values
 * @param {number} value - Percentage value
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted percentage string
 */
export const formatPercentage = (value, decimals = 1) => {
  return `${value.toFixed(decimals)}%`;
};
