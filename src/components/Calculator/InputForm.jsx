import React, { useState } from 'react';
import { getPresetOptions, getPresetTemplate } from '../../data/presetTemplates';
import './InputForm.css';

/**
 * Main input form for Own vs Rent Calculator
 */
const InputForm = ({ parameters, onParameterChange, onPresetSelect }) => {
  const [activeSection, setActiveSection] = useState('property');
  const presetOptions = getPresetOptions();

  const handleInputChange = (field, value) => {
    const numericValue = parseFloat(value) || 0;
    onParameterChange(field, numericValue);
  };

  const handlePresetChange = (presetId) => {
    if (presetId) {
      const preset = getPresetTemplate(presetId);
      if (preset) {
        onPresetSelect(preset.parameters);
      }
    }
  };

  const sections = [
    { id: 'property', label: 'Property & Mortgage', icon: '🏠' },
    { id: 'rental', label: 'Rental', icon: '🏠' },
    { id: 'investment', label: 'Investment', icon: '📈' },
    { id: 'analysis', label: 'Analysis Period', icon: '📅' }
  ];

  return (
    <div className="input-form">
      <div className="form-header">
        <h2>Calculator Inputs</h2>
        
        <div className="preset-selector">
          <label htmlFor="preset-select">Quick Start Templates:</label>
          <select 
            id="preset-select"
            onChange={(e) => handlePresetChange(e.target.value)}
            defaultValue=""
          >
            <option value="">Choose a preset...</option>
            {presetOptions.map(preset => (
              <option key={preset.id} value={preset.id}>
                {preset.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="section-tabs">
        {sections.map(section => (
          <button
            key={section.id}
            className={`section-tab ${activeSection === section.id ? 'active' : ''}`}
            onClick={() => setActiveSection(section.id)}
          >
            <span className="tab-icon">{section.icon}</span>
            <span className="tab-label">{section.label}</span>
          </button>
        ))}
      </div>

      <div className="form-content">
        {activeSection === 'property' && (
          <PropertySection 
            parameters={parameters} 
            onInputChange={handleInputChange} 
          />
        )}
        
        {activeSection === 'rental' && (
          <RentalSection 
            parameters={parameters} 
            onInputChange={handleInputChange} 
          />
        )}
        
        {activeSection === 'investment' && (
          <InvestmentSection 
            parameters={parameters} 
            onInputChange={handleInputChange} 
          />
        )}
        
        {activeSection === 'analysis' && (
          <AnalysisSection 
            parameters={parameters} 
            onInputChange={handleInputChange} 
          />
        )}
      </div>
    </div>
  );
};

/**
 * Property & Mortgage section
 */
const PropertySection = ({ parameters, onInputChange }) => (
  <div className="form-section">
    <h3>Property & Mortgage Details</h3>
    
    <div className="input-grid">
      <div className="input-group">
        <label htmlFor="homePrice">Home Purchase Price</label>
        <div className="input-wrapper">
          <span className="input-prefix">$</span>
          <input
            type="number"
            id="homePrice"
            value={parameters.homePrice || ''}
            onChange={(e) => onInputChange('homePrice', e.target.value)}
            placeholder="500,000"
            min="0"
            step="1000"
          />
        </div>
      </div>

      <div className="input-group">
        <label htmlFor="downPayment">Down Payment</label>
        <div className="input-wrapper">
          <input
            type="number"
            id="downPayment"
            value={parameters.downPayment || ''}
            onChange={(e) => onInputChange('downPayment', e.target.value)}
            placeholder="20"
            min="0"
            max="100"
            step="0.1"
          />
          <span className="input-suffix">%</span>
        </div>
      </div>

      <div className="input-group">
        <label htmlFor="mortgageRate">Mortgage Interest Rate</label>
        <div className="input-wrapper">
          <input
            type="number"
            id="mortgageRate"
            value={parameters.mortgageRate || ''}
            onChange={(e) => onInputChange('mortgageRate', e.target.value)}
            placeholder="6.5"
            min="0"
            max="50"
            step="0.01"
          />
          <span className="input-suffix">%</span>
        </div>
      </div>

      <div className="input-group">
        <label htmlFor="loanTerm">Loan Term</label>
        <div className="input-wrapper">
          <input
            type="number"
            id="loanTerm"
            value={parameters.loanTerm || ''}
            onChange={(e) => onInputChange('loanTerm', e.target.value)}
            placeholder="30"
            min="1"
            max="50"
            step="1"
          />
          <span className="input-suffix">years</span>
        </div>
      </div>

      <div className="input-group">
        <label htmlFor="propertyTaxRate">Property Tax Rate</label>
        <div className="input-wrapper">
          <input
            type="number"
            id="propertyTaxRate"
            value={parameters.propertyTaxRate || ''}
            onChange={(e) => onInputChange('propertyTaxRate', e.target.value)}
            placeholder="1.2"
            min="0"
            max="10"
            step="0.01"
          />
          <span className="input-suffix">%</span>
        </div>
      </div>

      <div className="input-group">
        <label htmlFor="homeInsurance">Home Insurance</label>
        <div className="input-wrapper">
          <span className="input-prefix">$</span>
          <input
            type="number"
            id="homeInsurance"
            value={parameters.homeInsurance || ''}
            onChange={(e) => onInputChange('homeInsurance', e.target.value)}
            placeholder="1,500"
            min="0"
            step="100"
          />
          <span className="input-suffix">/year</span>
        </div>
      </div>

      <div className="input-group">
        <label htmlFor="maintenanceCost">Maintenance & Repairs</label>
        <div className="input-wrapper">
          <span className="input-prefix">$</span>
          <input
            type="number"
            id="maintenanceCost"
            value={parameters.maintenanceCost || ''}
            onChange={(e) => onInputChange('maintenanceCost', e.target.value)}
            placeholder="5,000"
            min="0"
            step="100"
          />
          <span className="input-suffix">/year</span>
        </div>
      </div>

      <div className="input-group">
        <label htmlFor="hoaFees">HOA Fees</label>
        <div className="input-wrapper">
          <span className="input-prefix">$</span>
          <input
            type="number"
            id="hoaFees"
            value={parameters.hoaFees || ''}
            onChange={(e) => onInputChange('hoaFees', e.target.value)}
            placeholder="0"
            min="0"
            step="10"
          />
          <span className="input-suffix">/month</span>
        </div>
      </div>

      <div className="input-group">
        <label htmlFor="homeAppreciationRate">Home Appreciation Rate</label>
        <div className="input-wrapper">
          <input
            type="number"
            id="homeAppreciationRate"
            value={parameters.homeAppreciationRate || ''}
            onChange={(e) => onInputChange('homeAppreciationRate', e.target.value)}
            placeholder="3.0"
            min="-10"
            max="20"
            step="0.1"
          />
          <span className="input-suffix">%/year</span>
        </div>
        <small className="input-help">Expected annual increase in home value (historical average ~3-4%)</small>
      </div>

      <div className="input-group">
        <label htmlFor="rentalIncome">Rental Income (Optional)</label>
        <div className="input-wrapper">
          <span className="input-prefix">$</span>
          <input
            type="number"
            id="rentalIncome"
            value={parameters.rentalIncome || ''}
            onChange={(e) => onInputChange('rentalIncome', e.target.value)}
            placeholder="0"
            min="0"
            step="100"
          />
          <span className="input-suffix">/month</span>
        </div>
        <small className="input-help">Income from renting out rooms, basement, or duplex unit</small>
      </div>
    </div>
  </div>
);

/**
 * Rental section
 */
const RentalSection = ({ parameters, onInputChange }) => (
  <div className="form-section">
    <h3>Rental Details</h3>
    
    <div className="input-grid">
      <div className="input-group">
        <label htmlFor="monthlyRent">Monthly Rent</label>
        <div className="input-wrapper">
          <span className="input-prefix">$</span>
          <input
            type="number"
            id="monthlyRent"
            value={parameters.monthlyRent || ''}
            onChange={(e) => onInputChange('monthlyRent', e.target.value)}
            placeholder="2,500"
            min="0"
            step="50"
          />
          <span className="input-suffix">/month</span>
        </div>
      </div>

      <div className="input-group">
        <label htmlFor="rentIncreaseRate">Annual Rent Increase</label>
        <div className="input-wrapper">
          <input
            type="number"
            id="rentIncreaseRate"
            value={parameters.rentIncreaseRate || ''}
            onChange={(e) => onInputChange('rentIncreaseRate', e.target.value)}
            placeholder="3.0"
            min="0"
            max="20"
            step="0.1"
          />
          <span className="input-suffix">%</span>
        </div>
      </div>
    </div>
  </div>
);

/**
 * Investment section
 */
const InvestmentSection = ({ parameters, onInputChange }) => (
  <div className="form-section">
    <h3>Investment Strategy</h3>
    <div className="section-note">
      <p>💡 <strong>Investment Strategy Comparison:</strong></p>
      <ul>
        <li><strong>If you rent:</strong> Invest full starting balance + monthly investment + monthly cost savings (ownership costs - rent)</li>
        <li><strong>If you own:</strong> Invest starting balance minus down payment + monthly investment + rental income</li>
      </ul>
    </div>
    
    <div className="input-grid">
      <div className="input-group">
        <label htmlFor="investmentStartBalance">Starting Investment Balance</label>
        <div className="input-wrapper">
          <span className="input-prefix">$</span>
          <input
            type="number"
            id="investmentStartBalance"
            value={parameters.investmentStartBalance || ''}
            onChange={(e) => onInputChange('investmentStartBalance', e.target.value)}
            placeholder="10,000"
            min="0"
            step="1000"
          />
        </div>
        <small className="input-help">Money you already have available to invest</small>
      </div>

      <div className="input-group">
        <label htmlFor="monthlyInvestment">Monthly Investment Contribution</label>
        <div className="input-wrapper">
          <span className="input-prefix">$</span>
          <input
            type="number"
            id="monthlyInvestment"
            value={parameters.monthlyInvestment || ''}
            onChange={(e) => onInputChange('monthlyInvestment', e.target.value)}
            placeholder="500"
            min="0"
            step="50"
          />
          <span className="input-suffix">/month</span>
        </div>
        <small className="input-help">Additional monthly amount you can invest regardless of housing choice</small>
      </div>

      <div className="input-group">
        <label htmlFor="investmentReturn">Expected Annual Return</label>
        <div className="input-wrapper">
          <input
            type="number"
            id="investmentReturn"
            value={parameters.investmentReturn || ''}
            onChange={(e) => onInputChange('investmentReturn', e.target.value)}
            placeholder="7.0"
            min="-50"
            max="50"
            step="0.1"
          />
          <span className="input-suffix">%</span>
        </div>
        <small className="input-help">Long-term average return for index funds (~7%), bonds (~4%), or other investments</small>
      </div>
    </div>
    
    <div className="comparison-explanation">
      <h4>📊 How the Comparison Works:</h4>
      <div className="scenario-boxes">
        <div className="scenario-box own">
          <h5>🏠 Own Scenario</h5>
          <ul>
            <li>Build home equity through mortgage payments</li>
            <li>Invest your starting balance + monthly contributions</li>
            <li>Net worth = Home equity + Investments</li>
          </ul>
        </div>
        <div className="scenario-box rent">
          <h5>🏠 Rent + Invest Scenario</h5>
          <ul>
            <li>Invest down payment amount immediately</li>
            <li>Invest monthly housing cost savings</li>
            <li>Invest your additional monthly contributions</li>
            <li>Net worth = Total investments</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

/**
 * Analysis section
 */
const AnalysisSection = ({ parameters, onInputChange }) => (
  <div className="form-section">
    <h3>Analysis Period</h3>
    
    <div className="input-grid">
      <div className="input-group">
        <label htmlFor="timeHorizon">Time Horizon</label>
        <div className="input-wrapper">
          <input
            type="number"
            id="timeHorizon"
            value={parameters.timeHorizon || ''}
            onChange={(e) => onInputChange('timeHorizon', e.target.value)}
            placeholder="30"
            min="1"
            max="50"
            step="1"
          />
          <span className="input-suffix">years</span>
        </div>
      </div>
    </div>
    
    <div className="section-note">
      <p>📍 This determines how far into the future the analysis will project your wealth accumulation for both owning and renting scenarios.</p>
    </div>
  </div>
);

export default InputForm;
