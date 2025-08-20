# Own vs Rent Calculator - Claude Development Guide

This document provides detailed technical information about the Own vs Rent Calculator web application for AI assistants and developers working on the project.

## 🎯 Project Overview

**Application Type**: Single-page React application for financial analysis
**Purpose**: Compare long-term wealth implications of homeownership vs renting
**Target Users**: General public interested in personal finance decisions
**Deployment**: GitHub Pages (static hosting)

## 🏗️ Technical Architecture

### Frontend Stack
- **Framework**: React 18+ with functional components and hooks
- **Visualization**: D3.js for interactive charts and data visualization
- **Styling**: CSS3 with CSS Grid/Flexbox for responsive layouts
- **State Management**: React Context API or useState/useReducer for local state
- **Storage**: Browser localStorage for scenario persistence
- **Build Tool**: Create React App or Vite for development and production builds

### Project Structure
```
src/
├── components/
│   ├── Calculator/
│   │   ├── InputForm.jsx
│   │   ├── ParameterSection.jsx
│   │   └── PresetTemplates.jsx
│   ├── Charts/
│   │   ├── NetWorthChart.jsx
│   │   ├── AssetBreakdownChart.jsx
│   │   ├── CashFlowChart.jsx
│   │   └── BreakEvenChart.jsx
│   ├── ScenarioManager/
│   │   ├── SaveLoad.jsx
│   │   ├── ScenarioList.jsx
│   │   └── URLSharing.jsx
│   └── Layout/
│       ├── Header.jsx
│       ├── Footer.jsx
│       └── Navigation.jsx
├── hooks/
│   ├── useCalculations.js
│   ├── useLocalStorage.js
│   └── useURLParams.js
├── utils/
│   ├── calculations.js
│   ├── chartHelpers.js
│   └── formatters.js
├── data/
│   └── presetTemplates.js
├── styles/
│   ├── global.css
│   ├── components.css
│   └── charts.css
└── App.jsx
```

## 💾 Data Models

### Scenario Object Structure
```javascript
{
  id: string,
  name: string,
  createdAt: timestamp,
  parameters: {
    // Property & Mortgage
    homePrice: number,
    downPayment: number, // percentage
    mortgageRate: number, // percentage
    loanTerm: number, // years
    propertyTaxRate: number, // percentage
    homeInsurance: number, // annual amount
    maintenanceCost: number, // annual amount
    hoaFees: number, // monthly amount
    
    // Rental
    monthlyRent: number,
    rentIncreaseRate: number, // percentage
    
    // Investment
    investmentStartBalance: number,
    monthlyInvestment: number,
    investmentReturn: number, // percentage
    
    // Analysis
    timeHorizon: number // years
  },
  results: {
    ownScenario: {
      netWorth: number[],
      homeEquity: number[],
      investments: number[],
      totalCosts: number[],
      monthlyPayments: number[]
    },
    rentScenario: {
      netWorth: number[],
      investments: number[],
      totalCosts: number[],
      monthlyPayments: number[]
    },
    breakEvenPoint: number // years
  }
}
```

## 🧮 Core Calculations

### Financial Calculations Module (`utils/calculations.js`)

#### Mortgage Calculations
```javascript
// Monthly mortgage payment (principal + interest)
const monthlyPayment = (principal, rate, term) => {
  const monthlyRate = rate / 12 / 100;
  const numPayments = term * 12;
  return principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
         (Math.pow(1 + monthlyRate, numPayments) - 1);
};

// Remaining loan balance at given month
const remainingBalance = (principal, rate, term, monthsPaid) => {
  const monthlyRate = rate / 12 / 100;
  const numPayments = term * 12;
  const payment = monthlyPayment(principal, rate, term);
  
  return principal * (Math.pow(1 + monthlyRate, numPayments) - 
         Math.pow(1 + monthlyRate, monthsPaid)) / 
         (Math.pow(1 + monthlyRate, numPayments) - 1);
};
```

#### Investment Growth
```javascript
// Compound investment growth with monthly contributions
const investmentGrowth = (principal, monthlyContribution, annualRate, months) => {
  const monthlyRate = annualRate / 12 / 100;
  let balance = principal;
  const values = [balance];
  
  for (let month = 1; month <= months; month++) {
    balance = (balance + monthlyContribution) * (1 + monthlyRate);
    values.push(balance);
  }
  
  return values;
};
```

#### Home Equity Calculation
```javascript
// Home equity = current home value - remaining mortgage balance
const homeEquity = (initialPrice, appreciationRate, years, remainingBalance) => {
  const currentValue = initialPrice * Math.pow(1 + appreciationRate / 100, years);
  return Math.max(0, currentValue - remainingBalance);
};
```

## 📊 Chart Specifications

### D3.js Implementation Guidelines

#### 1. Net Worth Comparison Chart
- **Type**: Multi-line chart
- **Data**: Time series comparing own vs rent net worth
- **Features**: Interactive tooltips, zoom, pan
- **Responsive**: SVG with viewBox for scaling

#### 2. Asset Breakdown Chart
- **Type**: Stacked area chart
- **Data**: Home equity, investments, cash over time
- **Features**: Hover effects, legend toggle
- **Color Scheme**: Distinct colors for each asset type

#### 3. Cash Flow Analysis
- **Type**: Bar chart or line chart
- **Data**: Monthly costs comparison
- **Features**: Grouped bars for own vs rent costs

#### 4. Break-even Analysis
- **Type**: Line chart with intersection point
- **Data**: Cumulative costs until break-even
- **Features**: Highlight break-even point

### Chart Component Pattern
```javascript
// Example D3 React component structure
const NetWorthChart = ({ data, width, height }) => {
  const svgRef = useRef();
  
  useEffect(() => {
    const svg = d3.select(svgRef.current);
    // D3 rendering logic
  }, [data, width, height]);
  
  return <svg ref={svgRef} viewBox={`0 0 ${width} ${height}`} />;
};
```

## 🔗 URL Parameter System

### Supported Parameters
```javascript
const urlParams = {
  homePrice: 'hp',
  downPayment: 'dp', 
  mortgageRate: 'mr',
  loanTerm: 'lt',
  propertyTaxRate: 'pt',
  homeInsurance: 'hi',
  maintenanceCost: 'mc',
  hoaFees: 'hoa',
  monthlyRent: 'rent',
  rentIncreaseRate: 'rir',
  investmentStartBalance: 'isb',
  monthlyInvestment: 'mi',
  investmentReturn: 'ir',
  timeHorizon: 'th'
};
```

### URL Generation/Parsing
```javascript
// Generate shareable URL
const generateShareURL = (parameters) => {
  const params = new URLSearchParams();
  Object.entries(parameters).forEach(([key, value]) => {
    if (urlParams[key] && value) {
      params.set(urlParams[key], value);
    }
  });
  return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
};

// Parse URL parameters
const parseURLParams = () => {
  const params = new URLSearchParams(window.location.search);
  const scenario = {};
  
  Object.entries(urlParams).forEach(([fullKey, shortKey]) => {
    const value = params.get(shortKey);
    if (value) {
      scenario[fullKey] = parseFloat(value);
    }
  });
  
  return scenario;
};
```

## 🗃️ Local Storage Implementation

### Storage Structure
```javascript
// localStorage key: 'ownVsRentScenarios'
const storageStructure = {
  scenarios: [
    {
      id: 'uuid',
      name: 'My Scenario',
      parameters: { /* full parameter object */ },
      createdAt: timestamp,
      lastModified: timestamp
    }
  ],
  activeScenarioId: 'uuid',
  userPreferences: {
    theme: 'light',
    defaultTimeHorizon: 30,
    currency: 'USD'
  }
};
```

### Storage Utilities
```javascript
const useLocalStorage = (key, defaultValue) => {
  const [value, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return defaultValue;
    }
  });

  const setStoredValue = (newValue) => {
    try {
      setValue(newValue);
      window.localStorage.setItem(key, JSON.stringify(newValue));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [value, setStoredValue];
};
```

## 🎨 Preset Templates

### Template Structure
```javascript
const presetTemplates = {
  firstTimeBuyer: {
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
  // Additional templates...
};
```

## 🧪 Testing Strategy

### Unit Tests
- Financial calculation functions
- URL parameter parsing/generation
- Local storage utilities
- Chart data transformation

### Integration Tests
- Complete calculation flow
- Scenario save/load functionality
- URL sharing workflow

### Visual Tests
- Chart rendering accuracy
- Responsive design
- Cross-browser compatibility

## 📱 Responsive Design Considerations

### Breakpoints
```css
/* Mobile first approach */
.container {
  /* Base mobile styles */
}

@media (min-width: 768px) {
  /* Tablet styles */
}

@media (min-width: 1024px) {
  /* Desktop styles */
}
```

### Chart Responsiveness
- Use SVG viewBox for scalable charts
- Adjust chart margins and text size for mobile
- Consider chart interaction methods (touch vs mouse)

## 🔧 Development Workflow

### Git Workflow
1. **Main branch**: Production-ready code
2. **Develop branch**: Integration branch for features
3. **Feature branches**: Individual feature development
4. **Hotfix branches**: Critical bug fixes

### Deployment Pipeline
1. **Development**: Local development server
2. **Staging**: GitHub Pages preview branch
3. **Production**: GitHub Pages main deployment

### Code Quality
- ESLint configuration for React
- Prettier for code formatting
- Husky for pre-commit hooks
- Jest for testing

## 🚀 Performance Optimization

### Calculation Optimization
- Memoize expensive calculations with useMemo
- Debounce input changes to avoid excessive recalculation
- Web Workers for complex calculations (if needed)

### Chart Performance
- Limit data points for very long time horizons
- Use canvas for large datasets if SVG becomes slow
- Implement chart lazy loading

### Bundle Optimization
- Code splitting for charts (lazy load D3 components)
- Tree shaking for unused D3 modules
- Image optimization for any assets

## 🛡️ Error Handling

### Input Validation
```javascript
const validateParameters = (params) => {
  const errors = {};
  
  if (!params.homePrice || params.homePrice <= 0) {
    errors.homePrice = "Home price must be greater than 0";
  }
  
  if (params.downPayment < 0 || params.downPayment > 100) {
    errors.downPayment = "Down payment must be between 0% and 100%";
  }
  
  // Additional validations...
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
```

### Graceful Degradation
- Fallback calculations if complex features fail
- Error boundaries for chart components
- Local storage fallbacks if quota exceeded

## 📚 Documentation

### Code Documentation
- JSDoc comments for all functions
- README with setup instructions
- Component documentation with PropTypes

### User Documentation
- In-app help tooltips
- Getting started guide
- FAQ section

---

**This guide serves as the technical foundation for implementing and maintaining the Own vs Rent Calculator application.**