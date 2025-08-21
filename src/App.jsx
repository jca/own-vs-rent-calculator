import React, { useState, useEffect, useMemo } from 'react';
import InputForm from './components/Calculator/InputForm';
import NetWorthChart from './components/Charts/NetWorthChart';
import CapitalCompositionChart from './components/Charts/CapitalCompositionChart';
import ScenarioManager from './components/ScenarioManager/ScenarioManager';
import { defaultParameters } from './data/presetTemplates';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useURLParams } from './hooks/useURLParams';
import { useCalculations } from './hooks/useCalculations';
import { formatCurrency } from './utils/calculations';
import './App.css';

function App() {
  const [parameters, setParameters] = useState(defaultParameters);
  const [scenarios, setScenarios] = useLocalStorage('ownVsRentScenarios', []);
  
  const { urlParameters, hasUrlParams, updateURL } = useURLParams(defaultParameters);
  const { results, summary, chartData, isValid, error } = useCalculations(parameters);

  // Debug scenarios on startup
  useEffect(() => {
    console.log('App startup - scenarios from useLocalStorage:', scenarios);
    const directCheck = localStorage.getItem('ownVsRentScenarios');
    console.log('App startup - direct localStorage check:', directCheck);
  }, []);

  // Monitor scenarios changes
  useEffect(() => {
    console.log('Scenarios state changed:', scenarios);
  }, [scenarios]);

  // Load URL parameters on first render
  useEffect(() => {
    if (hasUrlParams && urlParameters) {
      setParameters(prev => ({ ...prev, ...urlParameters }));
    }
  }, [hasUrlParams, urlParameters]);

  // Update URL when parameters change (debounced)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      updateURL(parameters);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [parameters, updateURL]);

  const handleParameterChange = (field, value) => {
    setParameters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePresetSelect = (presetParameters) => {
    setParameters(presetParameters);
  };

  const handleSaveScenario = (scenario) => {
    console.log('Saving scenario:', scenario);
    
    // Update localStorage directly to ensure persistence
    try {
      const currentScenarios = JSON.parse(localStorage.getItem('ownVsRentScenarios') || '[]');
      const updatedScenarios = [...currentScenarios, scenario];
      localStorage.setItem('ownVsRentScenarios', JSON.stringify(updatedScenarios));
      console.log('Successfully saved to localStorage:', updatedScenarios);
      
      // Update React state
      setScenarios(updatedScenarios);
    } catch (error) {
      console.error('Error saving scenario:', error);
      // Fallback to React state only
      setScenarios(prev => [...prev, scenario]);
    }
  };

  const handleLoadScenario = (scenario) => {
    setParameters(scenario.parameters);
  };

  const handleDeleteScenario = (scenarioId) => {
    try {
      const currentScenarios = JSON.parse(localStorage.getItem('ownVsRentScenarios') || '[]');
      const updatedScenarios = currentScenarios.filter(s => s.id !== scenarioId);
      localStorage.setItem('ownVsRentScenarios', JSON.stringify(updatedScenarios));
      
      // Update React state
      setScenarios(updatedScenarios);
    } catch (error) {
      console.error('Error deleting scenario:', error);
      // Fallback to React state only
      setScenarios(prev => prev.filter(s => s.id !== scenarioId));
    }
  };

  const summaryCards = useMemo(() => {
    if (!summary) return null;

    return (
      <div className="summary-cards">
        <div className="summary-card primary">
          <div className="card-header">
            <h4>📊 Net Worth Comparison</h4>
            <span className="card-subtitle">After {summary.timeHorizon} years</span>
          </div>
          <div className="card-content">
            <div className="scenario-comparison">
              <div className="comparison-item own-scenario">
                <span className="scenario-label">🏠 Own + Invest</span>
                <div className="scenario-details">
                  <span className="value">{formatCurrency(summary.ownFinalNetWorth)}</span>
                  <small>Home equity + Investments</small>
                </div>
              </div>
              <div className="comparison-item rent-scenario">
                <span className="scenario-label">🏠 Rent + Invest</span>
                <div className="scenario-details">
                  <span className="value">{formatCurrency(summary.rentFinalNetWorth)}</span>
                  <small>Investment portfolio only</small>
                </div>
              </div>
            </div>
            <div className="comparison-result">
              <span className="result-label">Net Advantage:</span>
              <span className={`result-value ${summary.netWorthDifference > 0 ? 'own-advantage' : 'rent-advantage'}`}>
                {summary.netWorthDifference > 0 ? 'Own' : 'Rent + Invest'} by {formatCurrency(Math.abs(summary.netWorthDifference))}
              </span>
            </div>
          </div>
        </div>

        <div className="summary-card">
          <div className="card-header">
            <h4>💰 Total Housing Costs</h4>
            <span className="card-subtitle">{summary.timeHorizon} years</span>
          </div>
          <div className="card-content">
            <div className="comparison-item">
              <span className="label own">Owning:</span>
              <span className="value">{formatCurrency(summary.ownTotalCosts)}</span>
            </div>
            {summary.rentalIncome > 0 && (
              <div className="comparison-item rental-income">
                <span className="label">Rental Income:</span>
                <span className="value positive">-{formatCurrency(summary.rentalIncome * 12 * summary.timeHorizon)}</span>
              </div>
            )}
            <div className="comparison-item">
              <span className="label rent">Renting:</span>
              <span className="value">{formatCurrency(summary.rentTotalCosts)}</span>
            </div>
            <div className="comparison-item difference">
              <span className="label">Cost Difference:</span>
              <span className={`value ${summary.costDifference < 0 ? 'positive' : 'negative'}`}>
                {formatCurrency(summary.costDifference)}
              </span>
            </div>
          </div>
        </div>

        <div className="summary-card">
          <div className="card-header">
            <h4>💳 Down Payment Impact</h4>
            <span className="card-subtitle">Investment allocation comparison</span>
          </div>
          <div className="card-content">
            <div className="comparison-item">
              <span className="label">Down Payment Required:</span>
              <span className="value">{formatCurrency(summary.downPaymentAmount)}</span>
            </div>
            <div className="comparison-item">
              <span className="label own">Own: Starting Investments:</span>
              <span className="value">{formatCurrency(summary.ownStartingInvestments)}</span>
              <small>(After down payment deduction)</small>
            </div>
            <div className="comparison-item">
              <span className="label rent">Rent: Starting Investments:</span>
              <span className="value">{formatCurrency(summary.rentStartingInvestments)}</span>
              <small>(Down payment kept as cash/emergency fund)</small>
            </div>
          </div>
        </div>

        <div className="summary-card">
          <div className="card-header">
            <h4>🎯 Recommendation</h4>
            {summary.breakEvenPoint && (
              <span className="card-subtitle">
                Break-even: {summary.breakEvenPoint.toFixed(1)} years
              </span>
            )}
          </div>
          <div className="card-content">
            <div className={`recommendation ${summary.recommendation}`}>
              <div className="recommendation-icon">
                {summary.recommendation === 'own' ? '🏠' : '📈'}
              </div>
              <div className="recommendation-text">
                <strong>
                  {summary.recommendation === 'own' ? 'Owning + Investing' : 'Renting + Investing'} 
                </strong>
                <span>
                  appears to be the better wealth-building strategy for your scenario
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }, [summary]);

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>Own vs Rent + Invest Calculator</h1>
          <p>Compare wealth-building strategies: <strong>Owning a home + investing</strong> versus <strong>Renting + investing the difference</strong></p>
          <div className="strategy-badges">
            <span className="strategy-badge own">🏠 Own + Invest</span>
            <span className="vs">vs</span>
            <span className="strategy-badge rent">🏠 Rent + Invest</span>
          </div>
        </div>
      </header>

      <main className="app-main">
        <div className="container">
          <div className="app-grid">
            {/* Left Column - Inputs */}
            <div className="input-section">
              <InputForm
                parameters={parameters}
                onParameterChange={handleParameterChange}
                onPresetSelect={handlePresetSelect}
              />
              
              <ScenarioManager
                parameters={parameters}
                scenarios={scenarios}
                onSaveScenario={handleSaveScenario}
                onLoadScenario={handleLoadScenario}
                onDeleteScenario={handleDeleteScenario}
              />
            </div>

            {/* Right Column - Results */}
            <div className="results-section">
              {error && (
                <div className="error-card">
                  <div className="error-icon">⚠️</div>
                  <div className="error-content">
                    <h4>Calculation Error</h4>
                    <p>{error}</p>
                  </div>
                </div>
              )}

              {isValid && summaryCards && (
                <>
                  {summaryCards}
                  
                  {chartData && (
                    <>
                      <NetWorthChart data={chartData} />
                      <CapitalCompositionChart data={chartData} />
                    </>
                  )}
                </>
              )}

              {!isValid && !error && (
                <div className="placeholder-card">
                  <div className="placeholder-icon">📊</div>
                  <div className="placeholder-content">
                    <h4>Enter your details</h4>
                    <p>Fill in the calculator inputs to see your personalized own vs rent analysis</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="app-footer">
        <div className="container">
          <div className="footer-content">
            <p>
              <strong>Disclaimer:</strong> This calculator is for educational purposes only. 
              Results are estimates based on your inputs and should not be considered financial advice. 
              Please consult with a qualified financial advisor for personalized advice.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
