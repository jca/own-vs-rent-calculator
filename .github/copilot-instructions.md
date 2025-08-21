# Copilot Instructions for Own vs Rent Calculator

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview
This is a React application that helps users compare the long-term financial implications of owning vs renting a home. The app uses D3.js for interactive charts and visualizations.

## Key Guidelines

### Technology Stack
- **Frontend**: React 18+ with functional components and hooks
- **Visualization**: D3.js for interactive charts
- **Styling**: CSS3 with CSS Grid/Flexbox for responsive layouts
- **State Management**: React Context API or useState/useReducer
- **Storage**: Browser localStorage for scenario persistence
- **Build Tool**: Vite for development and production builds

### Financial Calculations
- All calculations should be precise and use proper financial formulas
- Include mortgage calculations, investment growth, and net worth projections
- Implement proper compound interest calculations
- Handle edge cases like zero down payment or very long time horizons

### Component Structure
- Keep components focused and reusable
- Use custom hooks for complex logic (calculations, localStorage)
- Implement proper error boundaries for chart components
- Follow React best practices for performance (useMemo, useCallback)

### D3.js Integration
- Use useRef and useEffect for D3 integration with React
- Make charts responsive using SVG viewBox
- Implement interactive features like tooltips and zoom
- Handle chart updates efficiently when data changes

### Data Management
- Store scenarios in localStorage with proper error handling
- Implement URL parameter sharing for scenarios
- Use proper validation for all user inputs
- Handle data migration if storage schema changes

### Accessibility
- Ensure all interactive elements are keyboard accessible
- Provide proper ARIA labels for charts and form elements
- Use semantic HTML elements
- Test with screen readers

### Performance
- Debounce input changes to avoid excessive recalculation
- Use React.memo for expensive components
- Implement proper loading states
- Optimize bundle size with tree shaking

### Code Style
- Use descriptive variable names for financial calculations
- Add JSDoc comments for complex functions
- Follow consistent naming conventions
- Keep functions pure when possible
