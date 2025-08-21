import { useState, useEffect, useCallback } from 'react';

/**
 * URL parameter mapping for compact URLs
 */
const urlParams = {
  homePrice: 'hp',
  downPayment: 'dp',
  mortgageRate: 'mr',
  loanTerm: 'lt',
  propertyTaxRate: 'pt',
  homeInsurance: 'hi',
  maintenanceCost: 'mc',
  hoaFees: 'hoa',
  homeAppreciationRate: 'har',
  rentalIncome: 'ri',
  monthlyRent: 'rent',
  rentIncreaseRate: 'rir',
  investmentStartBalance: 'isb',
  monthlyInvestment: 'mi',
  investmentReturn: 'ir',
  timeHorizon: 'th'
};

/**
 * Custom hook for URL parameter management
 * @param {Object} defaultParams - Default parameter values
 * @returns {Object} - URL parameter utilities
 */
export const useURLParams = (defaultParams = {}) => {
  const [urlParameters, setUrlParameters] = useState(null);

  /**
   * Parse URL parameters on component mount
   */
  useEffect(() => {
    const params = parseURLParams();
    if (Object.keys(params).length > 0) {
      setUrlParameters(params);
    }
  }, []);

  /**
   * Parse URL parameters into parameter object
   */
  const parseURLParams = useCallback(() => {
    const params = new URLSearchParams(window.location.search);
    const scenario = {};
    
    Object.entries(urlParams).forEach(([fullKey, shortKey]) => {
      const value = params.get(shortKey);
      if (value !== null && !isNaN(value)) {
        scenario[fullKey] = parseFloat(value);
      }
    });
    
    return scenario;
  }, []);

  /**
   * Generate shareable URL from parameters
   */
  const generateShareURL = useCallback((parameters) => {
    const params = new URLSearchParams();
    
    Object.entries(parameters).forEach(([key, value]) => {
      if (urlParams[key] && value !== null && value !== undefined) {
        // Only include non-default values to keep URL clean
        if (defaultParams[key] === undefined || value !== defaultParams[key]) {
          params.set(urlParams[key], value.toString());
        }
      }
    });
    
    const baseURL = `${window.location.origin}${window.location.pathname}`;
    const queryString = params.toString();
    
    return queryString ? `${baseURL}?${queryString}` : baseURL;
  }, [defaultParams]);

  /**
   * Update URL without page reload
   */
  const updateURL = useCallback((parameters) => {
    const newURL = generateShareURL(parameters);
    const currentURL = window.location.href;
    
    if (newURL !== currentURL) {
      window.history.replaceState({}, '', newURL);
    }
  }, [generateShareURL]);

  /**
   * Copy share URL to clipboard
   */
  const copyShareURL = useCallback(async (parameters) => {
    const shareURL = generateShareURL(parameters);
    
    try {
      await navigator.clipboard.writeText(shareURL);
      return { success: true, url: shareURL };
    } catch (error) {
      console.error('Failed to copy URL to clipboard:', error);
      return { success: false, error: error.message };
    }
  }, [generateShareURL]);

  /**
   * Clear URL parameters
   */
  const clearURL = useCallback(() => {
    const baseURL = `${window.location.origin}${window.location.pathname}`;
    window.history.replaceState({}, '', baseURL);
    setUrlParameters(null);
  }, []);

  return {
    urlParameters,
    generateShareURL,
    updateURL,
    copyShareURL,
    clearURL,
    hasUrlParams: urlParameters !== null
  };
};
