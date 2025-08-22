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
  // Safety checks
  if (!principal || principal <= 0) return 0;
  if (!termYears || termYears <= 0) return 0;
  if (!annualRate || annualRate < 0) return principal / (termYears * 12);
  
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
  // Safety checks
  if (!principal || principal <= 0) return 0;
  if (!termYears || termYears <= 0) return 0;
  if (monthsPaid < 0) return principal;
  if (monthsPaid >= termYears * 12) return 0;
  
  if (annualRate === 0) {
    return Math.max(0, principal - (principal / (termYears * 12)) * monthsPaid);
  }
  
  const monthlyRate = annualRate / 12 / 100;
  const numPayments = termYears * 12;
  
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
  // Safety checks
  const safePrincipal = Number(principal) || 0;
  const safeMonthlyContribution = Number(monthlyContribution) || 0;
  const safeAnnualRate = Number(annualRate) || 0;
  const safeMonths = Number(months) || 0;
  
  if (safeMonths <= 0) return [safePrincipal];
  
  const monthlyRate = safeAnnualRate / 12 / 100;
  let balance = safePrincipal;
  const values = [balance];
  
  for (let month = 1; month <= safeMonths; month++) {
    balance = (balance + safeMonthlyContribution) * (1 + monthlyRate);
    values.push(balance);
  }
  
  return values;
};

/**
 * Calculate investment growth with variable monthly contributions
 * @param {number} principal - Initial investment amount
 * @param {number[]} monthlyContributions - Array of monthly investment amounts
 * @param {number} annualRate - Annual return rate (percentage)
 * @param {number} months - Number of months
 * @returns {number[]} Array of investment values by month
 */
export const calculateInvestmentGrowthWithVariableContributions = (principal, monthlyContributions, annualRate, months) => {
  // Safety checks
  const safePrincipal = Number(principal) || 0;
  const safeAnnualRate = Number(annualRate) || 0;
  const safeMonths = Number(months) || 0;
  
  if (safeMonths <= 0) return [safePrincipal];
  
  const monthlyRate = safeAnnualRate / 12 / 100;
  let balance = safePrincipal;
  const values = [balance];
  
  for (let month = 1; month <= safeMonths; month++) {
    // Use the contribution for this specific month (accounting for rent increases)
    const monthlyContribution = Number(monthlyContributions[month - 1]) || 0;
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
    homePrice = 0,
    downPayment = 0,
    mortgageRate = 0,
    loanTerm = 30,
    propertyTaxRate = 0,
    homeInsurance = 0,
    maintenanceCost = 0,
    hoaFees = 0,
    monthlyRent = 0,
    rentIncreaseRate = 0,
    investmentStartBalance = 0,
    monthlyBudget = 0,  // Changed from monthlyInvestment to monthlyBudget
    investmentReturn = 0,
    timeHorizon = 30
  } = params;

  // Ensure all values are numbers and not NaN
  const safeParams = {
    homePrice: Number(homePrice) || 0,
    downPayment: Number(downPayment) || 0,
    mortgageRate: Number(mortgageRate) || 0,
    loanTerm: Number(loanTerm) || 30,
    propertyTaxRate: Number(propertyTaxRate) || 0,
    homeInsurance: Number(homeInsurance) || 0,
    maintenanceCost: Number(maintenanceCost) || 0,
    hoaFees: Number(hoaFees) || 0,
    homeAppreciationRate: Number(params.homeAppreciationRate) || 3.0,
    rentalIncome: Number(params.rentalIncome) || 0,
    monthlyRent: Number(monthlyRent) || 0,
    rentIncreaseRate: Number(rentIncreaseRate) || 0,
    investmentStartBalance: Number(investmentStartBalance) || 0,
    monthlyBudget: Number(monthlyBudget) || 0,  // Changed from monthlyInvestment
    investmentReturn: Number(investmentReturn) || 0,
    timeHorizon: Number(timeHorizon) || 30
  };

  const months = safeParams.timeHorizon * 12;
  const downPaymentAmount = (safeParams.downPayment / 100) * safeParams.homePrice;
  const loanAmount = safeParams.homePrice - downPaymentAmount;
  const monthlyMortgagePayment = calculateMonthlyPayment(loanAmount, safeParams.mortgageRate, safeParams.loanTerm);
  const monthlyHousingCost = calculateMonthlyHousingCost(
    monthlyMortgagePayment,
    (safeParams.propertyTaxRate / 100) * safeParams.homePrice,
    safeParams.homeInsurance,
    safeParams.maintenanceCost,
    safeParams.hoaFees
  );

  // Calculate effective monthly housing cost (rental income reduces effective housing costs)
  const effectiveMonthlyHousingCost = Math.max(0, monthlyHousingCost - safeParams.rentalIncome);

  // Own scenario calculations
  const homeEquity = calculateHomeEquity(
    safeParams.homePrice,
    safeParams.homeAppreciationRate,
    downPaymentAmount,
    loanAmount,
    safeParams.mortgageRate,
    safeParams.loanTerm,
    months
  );

  // For own scenario, rental income can be invested monthly
  // Down payment is deducted from starting investment balance
  // Monthly budget minus housing costs plus rental income goes to investments
  const ownMonthlyInvestment = Math.max(0, safeParams.monthlyBudget - monthlyHousingCost + safeParams.rentalIncome);
  const ownStartingInvestmentBalance = Math.max(0, safeParams.investmentStartBalance - downPaymentAmount);
  const ownInvestments = calculateInvestmentGrowth(
    ownStartingInvestmentBalance,
    ownMonthlyInvestment,
    safeParams.investmentReturn,
    months
  );

  const ownNetWorth = homeEquity.map((equity, index) => equity + ownInvestments[index]);

  // Rent scenario calculations - budget minus rent goes to investments
  const rentCosts = calculateRentalCosts(safeParams.monthlyRent, safeParams.rentIncreaseRate, months);
  
  // Calculate monthly investment amounts that vary with rent increases
  const rentMonthlyInvestments = rentCosts.map(monthlyRent => 
    Math.max(0, safeParams.monthlyBudget - monthlyRent)
  );
  
  // Rent scenario: invest starting balance + variable monthly budget allocation
  // Need to calculate investment growth with varying monthly contributions
  const rentInvestments = calculateInvestmentGrowthWithVariableContributions(
    safeParams.investmentStartBalance, // Keep full investment balance (no down payment needed)
    rentMonthlyInvestments, // Variable investment amounts as rent increases
    safeParams.investmentReturn,
    months
  );

  // Calculate cumulative costs
  const ownCumulativeCosts = [];
  const rentCumulativeCosts = [];
  let ownTotal = 0;
  let rentTotal = 0;

  for (let month = 0; month <= months; month++) {
    if (month > 0) {
      // Own scenario pays effective monthly housing cost (reduced by rental income)
      ownTotal += effectiveMonthlyHousingCost;
      // Rent scenario pays current month's rent
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
      monthlyPayments: Array(months + 1).fill(effectiveMonthlyHousingCost),
      monthlyInvestment: ownMonthlyInvestment
    },
    rentScenario: {
      netWorth: rentInvestments,
      investments: rentInvestments,
      totalCosts: rentCumulativeCosts,
      monthlyPayments: rentCosts,
      monthlyInvestment: rentMonthlyInvestments // Array of investment amounts that decrease as rent increases
    },
    breakEvenPoint: breakEvenPoint,
    downPaymentAmount: downPaymentAmount,
    ownStartingInvestmentBalance: ownStartingInvestmentBalance,
    monthlyMortgagePayment: monthlyMortgagePayment,
    monthlyHousingCost: monthlyHousingCost,
    effectiveMonthlyHousingCost: effectiveMonthlyHousingCost,
    rentalIncome: safeParams.rentalIncome,
    monthlyBudget: safeParams.monthlyBudget
  };
};

/**
 * Format currency values
 * @param {number} value - Numeric value
 * @param {boolean} compact - Use compact notation for large numbers
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (value, compact = false) => {
  // Safety check for NaN, null, undefined
  const safeValue = Number(value);
  if (isNaN(safeValue)) return '$0';
  
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: compact && Math.abs(safeValue) >= 1000 ? 'compact' : 'standard',
    maximumFractionDigits: 0
  });
  
  return formatter.format(safeValue);
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

/**
 * Validate input parameters
 * @param {object} params - Input parameters to validate
 * @returns {object} Validation result with isValid flag and errors object
 */
export const validateParameters = (params) => {
  const errors = {};
  
  if (!params.homePrice || params.homePrice <= 0) {
    errors.homePrice = "Home price must be greater than 0";
  }
  
  if (params.downPayment < 0 || params.downPayment > 100) {
    errors.downPayment = "Down payment must be between 0% and 100%";
  }
  
  if (params.mortgageRate < 0 || params.mortgageRate > 50) {
    errors.mortgageRate = "Mortgage rate must be between 0% and 50%";
  }
  
  if (!params.loanTerm || params.loanTerm <= 0 || params.loanTerm > 50) {
    errors.loanTerm = "Loan term must be between 1 and 50 years";
  }
  
  if (params.propertyTaxRate < 0 || params.propertyTaxRate > 10) {
    errors.propertyTaxRate = "Property tax rate must be between 0% and 10%";
  }
  
  if (!params.monthlyRent || params.monthlyRent <= 0) {
    errors.monthlyRent = "Monthly rent must be greater than 0";
  }
  
  if (params.rentIncreaseRate < 0 || params.rentIncreaseRate > 20) {
    errors.rentIncreaseRate = "Rent increase rate must be between 0% and 20%";
  }
  
  if (params.investmentReturn < -50 || params.investmentReturn > 50) {
    errors.investmentReturn = "Investment return must be between -50% and 50%";
  }
  
  if (!params.timeHorizon || params.timeHorizon <= 0 || params.timeHorizon > 50) {
    errors.timeHorizon = "Time horizon must be between 1 and 50 years";
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
