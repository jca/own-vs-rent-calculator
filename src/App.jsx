import React, { useState, useEffect, useMemo } from 'react';
import InputForm from './components/Calculator/InputForm';
import NetWorthChart from './components/Charts/NetWorthChart';
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
    setScenarios(prev => [...prev, scenario]);
  };

  const handleLoadScenario = (scenario) => {
    setParameters(scenario.parameters);
  };

  const handleDeleteScenario = (scenarioId) => {
    setScenarios(prev => prev.filter(s => s.id !== scenarioId));
  };

  const summaryCards = useMemo(() => {
    if (!summary) return null;

    return (
      <div className="summary-cards">
        <div className="summary-card">
          <div className="card-header">
            <h4>Final Net Worth</h4>
            <span className="card-subtitle">{summary.timeHorizon} years</span>
          </div>
          <div className="card-content">
            <div className="comparison-item">
              <span className="label own">Own:</span>
              <span className="value">{formatCurrency(summary.ownFinalNetWorth)}</span>
            </div>
            <div className="comparison-item">
              <span className="label rent">Rent:</span>
              <span className="value">{formatCurrency(summary.rentFinalNetWorth)}</span>
            </div>
            <div className="comparison-item difference">
              <span className="label">Difference:</span>
              <span className={`value ${summary.netWorthDifference > 0 ? 'positive' : 'negative'}`}>
                {formatCurrency(summary.netWorthDifference)}
              </span>
            </div>
          </div>
        </div>

        <div className="summary-card">
          <div className="card-header">
            <h4>Total Costs</h4>
            <span className="card-subtitle">{summary.timeHorizon} years</span>
          </div>
          <div className="card-content">
            <div className="comparison-item">
              <span className="label own">Own:</span>
              <span className="value">{formatCurrency(summary.ownTotalCosts)}</span>
            </div>
            <div className="comparison-item">
              <span className="label rent">Rent:</span>
              <span className="value">{formatCurrency(summary.rentTotalCosts)}</span>
            </div>
            <div className="comparison-item difference">
              <span className="label">Difference:</span>
              <span className={`value ${summary.costDifference < 0 ? 'positive' : 'negative'}`}>
                {formatCurrency(summary.costDifference)}
              </span>
            </div>
          </div>
        </div>

        <div className="summary-card">
          <div className="card-header">
            <h4>Recommendation</h4>
            {summary.breakEvenPoint && (
              <span className="card-subtitle">
                Break-even: {summary.breakEvenPoint.toFixed(1)} years
              </span>
            )}
          </div>
          <div className="card-content">
            <div className={`recommendation ${summary.recommendation}`}>
              <div className="recommendation-icon">
                {summary.recommendation === 'own' ? '🏠' : '🏠'}
              </div>
              <div className="recommendation-text">
                <strong>
                  {summary.recommendation === 'own' ? 'Owning' : 'Renting'} 
                </strong>
                <span>
                  appears to be the better financial choice for your scenario
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
          <h1>Own vs Rent Calculator</h1>
          <p>Make informed financial decisions by comparing the long-term wealth implications of owning versus renting a home</p>
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
                    <NetWorthChart data={chartData} />
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
