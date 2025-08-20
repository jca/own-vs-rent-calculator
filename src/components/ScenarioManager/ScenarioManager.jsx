import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useURLParams } from '../../hooks/useURLParams';
import './ScenarioManager.css';

/**
 * Scenario Management Component
 * Handles saving, loading, and sharing scenarios
 */
const ScenarioManager = ({ 
  parameters, 
  scenarios, 
  onSaveScenario, 
  onLoadScenario, 
  onDeleteScenario 
}) => {
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [scenarioName, setScenarioName] = useState('');
  const [shareMessage, setShareMessage] = useState('');
  
  const { generateShareURL, copyShareURL } = useURLParams();

  const handleSaveScenario = () => {
    if (!scenarioName.trim()) {
      alert('Please enter a scenario name');
      return;
    }

    const scenario = {
      id: uuidv4(),
      name: scenarioName.trim(),
      parameters: { ...parameters },
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString()
    };

    onSaveScenario(scenario);
    setScenarioName('');
    setShowSaveDialog(false);
  };

  const handleShareScenario = async () => {
    const result = await copyShareURL(parameters);
    
    if (result.success) {
      setShareMessage('Share URL copied to clipboard!');
      setTimeout(() => setShareMessage(''), 3000);
    } else {
      setShareMessage('Failed to copy URL. Please try again.');
      setTimeout(() => setShareMessage(''), 3000);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="scenario-manager">
      <div className="manager-header">
        <h3>Scenario Management</h3>
        <div className="action-buttons">
          <button 
            className="btn btn-primary"
            onClick={() => setShowSaveDialog(true)}
          >
            📁 Save Scenario
          </button>
          <button 
            className="btn btn-secondary"
            onClick={handleShareScenario}
          >
            🔗 Share URL
          </button>
        </div>
      </div>

      {shareMessage && (
        <div className={`share-message ${shareMessage.includes('copied') ? 'success' : 'error'}`}>
          {shareMessage}
        </div>
      )}

      {showSaveDialog && (
        <div className="save-dialog">
          <div className="dialog-content">
            <h4>Save Current Scenario</h4>
            <div className="input-group">
              <label htmlFor="scenario-name">Scenario Name:</label>
              <input
                type="text"
                id="scenario-name"
                value={scenarioName}
                onChange={(e) => setScenarioName(e.target.value)}
                placeholder="e.g., First Home Purchase"
                maxLength={50}
                autoFocus
              />
            </div>
            <div className="dialog-actions">
              <button 
                className="btn btn-secondary"
                onClick={() => {
                  setShowSaveDialog(false);
                  setScenarioName('');
                }}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleSaveScenario}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {scenarios.length > 0 && (
        <div className="saved-scenarios">
          <h4>Saved Scenarios ({scenarios.length})</h4>
          <div className="scenarios-list">
            {scenarios.map(scenario => (
              <div key={scenario.id} className="scenario-item">
                <div className="scenario-info">
                  <div className="scenario-name">{scenario.name}</div>
                  <div className="scenario-meta">
                    <span className="scenario-date">
                      Saved: {formatDate(scenario.createdAt)}
                    </span>
                    <span className="scenario-preview">
                      ${(scenario.parameters.homePrice || 0).toLocaleString()} home, 
                      {scenario.parameters.timeHorizon || 0} years
                    </span>
                  </div>
                </div>
                <div className="scenario-actions">
                  <button
                    className="btn btn-small btn-primary"
                    onClick={() => onLoadScenario(scenario)}
                    title="Load this scenario"
                  >
                    📂 Load
                  </button>
                  <button
                    className="btn btn-small btn-danger"
                    onClick={() => {
                      if (window.confirm(`Delete scenario "${scenario.name}"?`)) {
                        onDeleteScenario(scenario.id);
                      }
                    }}
                    title="Delete this scenario"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {scenarios.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <div className="empty-text">
            <h4>No saved scenarios</h4>
            <p>Save your current parameters to quickly switch between different scenarios.</p>
          </div>
        </div>
      )}

      <div className="export-import">
        <h4>Export & Import</h4>
        <div className="export-buttons">
          <button 
            className="btn btn-outline"
            onClick={() => exportScenarios(scenarios)}
          >
            📤 Export All
          </button>
          <label className="btn btn-outline file-input-label">
            📥 Import
            <input
              type="file"
              accept=".json"
              onChange={(e) => handleImportScenarios(e, onSaveScenario)}
              style={{ display: 'none' }}
            />
          </label>
        </div>
      </div>
    </div>
  );
};

/**
 * Export scenarios to JSON file
 */
const exportScenarios = (scenarios) => {
  const dataStr = JSON.stringify(scenarios, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `own-vs-rent-scenarios-${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  
  URL.revokeObjectURL(url);
};

/**
 * Import scenarios from JSON file
 */
const handleImportScenarios = (event, onSaveScenario) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const importedScenarios = JSON.parse(e.target.result);
      
      if (Array.isArray(importedScenarios)) {
        importedScenarios.forEach(scenario => {
          // Validate scenario structure
          if (scenario.name && scenario.parameters) {
            const newScenario = {
              ...scenario,
              id: uuidv4(), // Generate new ID to avoid conflicts
              lastModified: new Date().toISOString()
            };
            onSaveScenario(newScenario);
          }
        });
        alert(`Successfully imported ${importedScenarios.length} scenarios!`);
      } else {
        throw new Error('Invalid file format');
      }
    } catch (error) {
      alert('Error importing scenarios. Please check the file format.');
      console.error('Import error:', error);
    }
  };
  
  reader.readAsText(file);
  event.target.value = ''; // Reset file input
};

export default ScenarioManager;
