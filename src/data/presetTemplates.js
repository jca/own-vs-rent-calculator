/**
 * Preset templates for common Own vs Rent scenarios
 */

export const presetTemplates = {
  firstTimeBuyer: {
    id: 'first-time-buyer',
    name: "First-time Buyer",
    description: "Conservative scenario: Compare owning + investing vs renting + investing for new homeowners",
    parameters: {
      homePrice: 400000,
      downPayment: 10,
      mortgageRate: 7.0,
      loanTerm: 30,
      propertyTaxRate: 1.2,
      homeInsurance: 1200,
      maintenanceCost: 4000,
      hoaFees: 0,
      homeAppreciationRate: 3.0,
      rentalIncome: 0,
      monthlyRent: 2000,
      rentIncreaseRate: 3.0,
      investmentStartBalance: 50000, // Increased to cover $40k down payment + emergency fund
      monthlyBudget: 3000, // Budget allocation for housing + investing
      investmentReturn: 7.0,
      timeHorizon: 30
    }
  },
  
  highIncomeUrban: {
    id: 'high-income-urban',
    name: "High-income Urban Professional",
    description: "High-cost area: Will rent + aggressive investing beat expensive homeownership?",
    parameters: {
      homePrice: 800000,
      downPayment: 20,
      mortgageRate: 6.5,
      loanTerm: 30,
      propertyTaxRate: 1.5,
      homeInsurance: 2000,
      maintenanceCost: 8000,
      hoaFees: 300,
      homeAppreciationRate: 4.0,
      rentalIncome: 1500,
      monthlyRent: 4000,
      rentIncreaseRate: 4.0,
      investmentStartBalance: 200000, // Increased to cover $160k down payment + buffer
      monthlyBudget: 6000, // Budget allocation for housing + investing
      investmentReturn: 8.0,
      timeHorizon: 25
    }
  },
  
  retirementPlanning: {
    id: 'retirement-planning',
    name: "Retirement Planning",
    description: "Long-term wealth building: Own + invest vs rent + invest over 35 years",
    parameters: {
      homePrice: 500000,
      downPayment: 20,
      mortgageRate: 6.0,
      loanTerm: 15,
      propertyTaxRate: 1.0,
      homeInsurance: 1500,
      maintenanceCost: 5000,
      hoaFees: 150,
      homeAppreciationRate: 2.5,
      rentalIncome: 0,
      monthlyRent: 2500,
      rentIncreaseRate: 2.5,
      investmentStartBalance: 120000, // Increased to cover $100k down payment + buffer
      monthlyBudget: 4000, // Budget allocation for housing + investing
      investmentReturn: 7.5,
      timeHorizon: 35
    }
  },
  
  youngProfessional: {
    id: 'young-professional',
    name: "Young Professional",
    description: "Early career: Small down payment vs investing the money in markets",
    parameters: {
      homePrice: 300000,
      downPayment: 5,
      mortgageRate: 7.5,
      loanTerm: 30,
      propertyTaxRate: 1.1,
      homeInsurance: 900,
      maintenanceCost: 3000,
      hoaFees: 0,
      homeAppreciationRate: 4.5,
      rentalIncome: 800,
      monthlyRent: 1500,
      rentIncreaseRate: 3.5,
      investmentStartBalance: 20000, // Increased to cover $15k down payment + buffer
      monthlyBudget: 2200, // Budget allocation for housing + investing
      investmentReturn: 8.5,
      timeHorizon: 20
    }
  },
  
  suburbanFamily: {
    id: 'suburban-family',
    name: "Suburban Family",
    description: "Family scenario: Larger home ownership vs renting + investing the difference",
    parameters: {
      homePrice: 600000,
      downPayment: 15,
      mortgageRate: 6.8,
      loanTerm: 30,
      propertyTaxRate: 1.3,
      homeInsurance: 1800,
      maintenanceCost: 6000,
      hoaFees: 100,
      homeAppreciationRate: 3.2,
      rentalIncome: 0,
      monthlyRent: 3000,
      rentIncreaseRate: 3.2,
      investmentStartBalance: 110000, // Increased to cover $90k down payment + buffer
      monthlyBudget: 4200, // Budget allocation for housing + investing
      investmentReturn: 7.2,
      timeHorizon: 30
    }
  }
};

/**
 * Get all preset template options for dropdown/selection
 */
export const getPresetOptions = () => {
  return Object.values(presetTemplates).map(template => ({
    id: template.id,
    name: template.name,
    description: template.description
  }));
};

/**
 * Get preset template by ID
 */
export const getPresetTemplate = (id) => {
  return Object.values(presetTemplates).find(template => template.id === id) || null;
};

/**
 * Default parameter values
 */
export const defaultParameters = {
  homePrice: 500000,
  downPayment: 20,
  mortgageRate: 6.5,
  loanTerm: 30,
  propertyTaxRate: 1.2,
  homeInsurance: 1500,
  maintenanceCost: 5000,
  hoaFees: 0,
  homeAppreciationRate: 3.0,
  rentalIncome: 0,
  monthlyRent: 2500,
  rentIncreaseRate: 3.0,
  investmentStartBalance: 120000, // Increased to cover $100k down payment + buffer
  monthlyBudget: 3500, // Budget allocation for housing + investing
  investmentReturn: 7.0,
  timeHorizon: 30
};
