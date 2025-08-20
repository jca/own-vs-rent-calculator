import { useMemo } from 'react';
import { calculateScenario } from '../utils/calculations';

/**
 * Custom hook for performing financial calculations
 * @param {Object} parameters - Calculation parameters
 * @returns {Object} - Calculation results and utilities
 */
export const useCalculations = (parameters) => {
  /**
   * Memoized calculation results
   */
  const results = useMemo(() => {
    try {
      // Validate required parameters
      const requiredParams = [
        'homePrice', 'downPayment', 'mortgageRate', 'loanTerm',
        'monthlyRent', 'investmentReturn', 'timeHorizon'
      ];
      
      const missingParams = requiredParams.filter(param => 
        parameters[param] === undefined || parameters[param] === null
      );
      
      if (missingParams.length > 0) {
        throw new Error(`Missing required parameters: ${missingParams.join(', ')}`);
      }

      // Validate parameter ranges
      const validationErrors = validateParameters(parameters);
      if (!validationErrors.isValid) {
        throw new Error(`Invalid parameters: ${Object.values(validationErrors.errors).join(', ')}`);
      }

      return calculateScenario(parameters);
    } catch (error) {
      console.error('Calculation error:', error);
      return {
        error: error.message,
        ownScenario: null,
        rentScenario: null,
        breakEvenPoint: null
      };
    }
  }, [parameters]);

  /**
   * Calculate summary statistics
   */
  const summary = useMemo(() => {
    if (results.error || !results.ownScenario) {
      return null;
    }

    const { ownScenario, rentScenario, timeHorizon } = results;
    const finalIndex = Math.min(timeHorizon * 12, ownScenario.netWorth.length - 1);

    const ownFinalNetWorth = ownScenario.netWorth[finalIndex];
    const rentFinalNetWorth = rentScenario.netWorth[finalIndex];
    const difference = ownFinalNetWorth - rentFinalNetWorth;
    const differencePercent = ((difference / rentFinalNetWorth) * 100);

    const ownTotalCosts = ownScenario.totalCosts[finalIndex];
    const rentTotalCosts = rentScenario.totalCosts[finalIndex];
    const costDifference = ownTotalCosts - rentTotalCosts;

    return {
      ownFinalNetWorth,
      rentFinalNetWorth,
      netWorthDifference: difference,
      netWorthDifferencePercent: differencePercent,
      ownTotalCosts,
      rentTotalCosts,
      costDifference,
      timeHorizon: parameters.timeHorizon,
      breakEvenPoint: results.breakEvenPoint,
      recommendation: difference > 0 ? 'own' : 'rent'
    };
  }, [results, parameters.timeHorizon]);

  /**
   * Calculate year-by-year data for charts
   */
  const chartData = useMemo(() => {
    if (results.error || !results.ownScenario) {
      return null;
    }

    const { ownScenario, rentScenario } = results;
    const years = parameters.timeHorizon;
    const data = [];

    for (let year = 0; year <= years; year++) {
      const monthIndex = year * 12;
      
      if (monthIndex < ownScenario.netWorth.length) {
        data.push({
          year,
          ownNetWorth: ownScenario.netWorth[monthIndex],
          rentNetWorth: rentScenario.netWorth[monthIndex],
          homeEquity: ownScenario.homeEquity[monthIndex],
          ownInvestments: ownScenario.investments[monthIndex],
          rentInvestments: rentScenario.investments[monthIndex],
          ownCosts: ownScenario.totalCosts[monthIndex],
          rentCosts: rentScenario.totalCosts[monthIndex],
          ownMonthlyPayment: ownScenario.monthlyPayments[monthIndex],
          rentMonthlyPayment: rentScenario.monthlyPayments[monthIndex]
        });
      }
    }

    return data;
  }, [results, parameters.timeHorizon]);

  return {
    results,
    summary,
    chartData,
    isValid: !results.error,
    error: results.error
  };
};

/**
 * Validate calculation parameters
 * @param {Object} params - Parameters to validate
 * @returns {Object} - Validation result
 */
const validateParameters = (params) => {
  const errors = {};

  // Home price validation
  if (!params.homePrice || params.homePrice <= 0) {
    errors.homePrice = "Home price must be greater than 0";
  }

  // Down payment validation
  if (params.downPayment < 0 || params.downPayment > 100) {
    errors.downPayment = "Down payment must be between 0% and 100%";
  }

  // Mortgage rate validation
  if (params.mortgageRate < 0 || params.mortgageRate > 50) {
    errors.mortgageRate = "Mortgage rate must be between 0% and 50%";
  }

  // Loan term validation
  if (params.loanTerm < 1 || params.loanTerm > 50) {
    errors.loanTerm = "Loan term must be between 1 and 50 years";
  }

  // Property tax rate validation
  if (params.propertyTaxRate < 0 || params.propertyTaxRate > 10) {
    errors.propertyTaxRate = "Property tax rate must be between 0% and 10%";
  }

  // Monthly rent validation
  if (!params.monthlyRent || params.monthlyRent <= 0) {
    errors.monthlyRent = "Monthly rent must be greater than 0";
  }

  // Rent increase rate validation
  if (params.rentIncreaseRate < 0 || params.rentIncreaseRate > 20) {
    errors.rentIncreaseRate = "Rent increase rate must be between 0% and 20%";
  }

  // Investment return validation
  if (params.investmentReturn < -50 || params.investmentReturn > 50) {
    errors.investmentReturn = "Investment return must be between -50% and 50%";
  }

  // Time horizon validation
  if (params.timeHorizon < 1 || params.timeHorizon > 50) {
    errors.timeHorizon = "Time horizon must be between 1 and 50 years";
  }

  // Insurance and maintenance validation
  if (params.homeInsurance < 0) {
    errors.homeInsurance = "Home insurance cannot be negative";
  }

  if (params.maintenanceCost < 0) {
    errors.maintenanceCost = "Maintenance cost cannot be negative";
  }

  if (params.hoaFees < 0) {
    errors.hoaFees = "HOA fees cannot be negative";
  }

  if (params.investmentStartBalance < 0) {
    errors.investmentStartBalance = "Investment start balance cannot be negative";
  }

  if (params.monthlyInvestment < 0) {
    errors.monthlyInvestment = "Monthly investment cannot be negative";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
