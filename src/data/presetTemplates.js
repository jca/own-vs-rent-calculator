/**
 * Preset templates for common Own vs Rent scenarios
 */

export const presetTemplates = {
  firstTimeBuyer: {
    id: 'first-time-buyer',
    name: "First-time Buyer",
    description: "Conservative assumptions for new homeowners",
    parameters: {
      homePrice: 400000,
      downPayment: 10,
      mortgageRate: 7.0,
      loanTerm: 30,
      propertyTaxRate: 1.2,
      homeInsurance: 1200,
      maintenanceCost: 4000,
      hoaFees: 0,
      monthlyRent: 2000,
      rentIncreaseRate: 3.0,
      investmentStartBalance: 10000,
      monthlyInvestment: 500,
      investmentReturn: 7.0,
      timeHorizon: 30
    }
  },
  
  highIncomeUrban: {
    id: 'high-income-urban',
    name: "High-income Urban Professional",
    description: "Higher property values and investment capacity",
    parameters: {
      homePrice: 800000,
      downPayment: 20,
      mortgageRate: 6.5,
      loanTerm: 30,
      propertyTaxRate: 1.5,
      homeInsurance: 2000,
      maintenanceCost: 8000,
      hoaFees: 300,
      monthlyRent: 4000,
      rentIncreaseRate: 4.0,
      investmentStartBalance: 50000,
      monthlyInvestment: 1500,
      investmentReturn: 8.0,
      timeHorizon: 25
    }
  },
  
  retirementPlanning: {
    id: 'retirement-planning',
    name: "Retirement Planning",
    description: "Long-term 30+ year projections",
    parameters: {
      homePrice: 500000,
      downPayment: 20,
      mortgageRate: 6.0,
      loanTerm: 15,
      propertyTaxRate: 1.0,
      homeInsurance: 1500,
      maintenanceCost: 5000,
      hoaFees: 150,
      monthlyRent: 2500,
      rentIncreaseRate: 2.5,
      investmentStartBalance: 25000,
      monthlyInvestment: 1000,
      investmentReturn: 7.5,
      timeHorizon: 35
    }
  },
  
  youngProfessional: {
    id: 'young-professional',
    name: "Young Professional",
    description: "Starting career with growth potential",
    parameters: {
      homePrice: 300000,
      downPayment: 5,
      mortgageRate: 7.5,
      loanTerm: 30,
      propertyTaxRate: 1.1,
      homeInsurance: 900,
      maintenanceCost: 3000,
      hoaFees: 0,
      monthlyRent: 1500,
      rentIncreaseRate: 3.5,
      investmentStartBalance: 5000,
      monthlyInvestment: 300,
      investmentReturn: 8.5,
      timeHorizon: 20
    }
  },
  
  suburbanFamily: {
    id: 'suburban-family',
    name: "Suburban Family",
    description: "Family-oriented with moderate costs",
    parameters: {
      homePrice: 600000,
      downPayment: 15,
      mortgageRate: 6.8,
      loanTerm: 30,
      propertyTaxRate: 1.3,
      homeInsurance: 1800,
      maintenanceCost: 6000,
      hoaFees: 100,
      monthlyRent: 3000,
      rentIncreaseRate: 3.2,
      investmentStartBalance: 20000,
      monthlyInvestment: 800,
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
  return presetTemplates[id] || null;
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
  monthlyRent: 2500,
  rentIncreaseRate: 3.0,
  investmentStartBalance: 10000,
  monthlyInvestment: 500,
  investmentReturn: 7.0,
  timeHorizon: 30
};
