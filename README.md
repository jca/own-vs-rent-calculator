# Own vs Rent Calculator

A comprehensive web application that helps users make informed financial decisions by comparing the long-term wealth implications of owning versus renting a home. The calculator provides detailed projections and multiple visualizations to analyze different scenarios over customizable time periods.

## 🌟 Features

- **Comprehensive Input Parameters**: Configure all aspects of homeownership and renting scenarios
- **Interactive Visualizations**: D3.js charts showing wealth accumulation over time
- **Scenario Management**: Save, load, and compare multiple scenarios using local storage
- **URL Sharing**: Share specific scenarios via URL parameters
- **Preset Templates**: Quick-start templates for common situations
- **Flexible Time Range**: Analyze projections from 1-50 years
- **Mobile Responsive**: Works seamlessly on all devices

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd own-vs-rent
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Deploy to GitHub Pages

```bash
npm run deploy
```

## 📊 What It Calculates

### Homeownership Scenario
- **Total Net Worth**: Home equity + investments - remaining mortgage balance
- **Home Equity Growth**: Property appreciation over time
- **Investment Growth**: Returns on invested down payment difference and monthly savings
- **Total Costs**: Mortgage payments, taxes, insurance, maintenance, HOA fees

### Renting Scenario
- **Investment Portfolio**: Growth of invested funds (down payment + monthly rent savings)
- **Total Costs**: Rent payments with annual increases
- **Opportunity Cost**: Comparison of different investment strategies

### Input Parameters

#### Property & Mortgage
- Home purchase price
- Down payment amount/percentage
- Mortgage interest rate
- Loan term (15-30 years)
- Property taxes (annual)
- Home insurance (annual)
- Maintenance and repair costs
- HOA fees (if applicable)

#### Rental
- Monthly rent amount
- Annual rent increase rate

#### Investment
- Investment account starting balance
- Monthly investment contribution
- Expected annual investment return rate

#### Analysis Period
- Flexible time horizon (1-50 years)

## 🛠️ Technology Stack

- **Frontend**: React 18+ with Vite
- **Visualization**: D3.js for interactive charts
- **Styling**: CSS3 with modern features
- **Storage**: Local Storage for scenario persistence
- **Build Tool**: Vite for fast development and optimized builds

## 📱 Usage

1. **Enter Your Information**: Fill in the form with your specific financial details
2. **Analyze Results**: View interactive charts showing different aspects of the comparison
3. **Save Scenarios**: Store your calculations for future reference
4. **Compare Options**: Load different scenarios to compare side-by-side
5. **Share Results**: Use the generated URL to share your scenario with others

### Preset Templates

The application includes several preset templates:
- **First-time Buyer**: Conservative assumptions for new homeowners
- **High-income Professional**: Higher property values and investment returns
- **Retirement Planning**: Long-term 30+ year projections
- **Young Professional**: Starting career with growth potential
- **Suburban Family**: Family-oriented with moderate costs

## 🔧 Configuration

### URL Parameters

Share scenarios using URL parameters:
```
?hp=500000&dp=20&mr=6.5&rent=2500&th=30
```

### Local Storage

Scenarios are automatically saved to browser local storage and can be:
- Named and organized
- Exported as JSON
- Imported from saved files

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Guidelines

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Disclaimer

This calculator is for educational and informational purposes only. The results are estimates based on the inputs provided and should not be considered financial advice. Actual results may vary due to market conditions, tax implications, and other factors not included in the calculations. Please consult with a qualified financial advisor for personalized advice.

## 🔮 Future Enhancements

- Integration with real-time mortgage rate APIs
- Tax calculation features
- Inflation adjustment options
- Monte Carlo simulation for market volatility
- Export to PDF reports
- Additional chart types (asset breakdown, cash flow analysis)

---

**Made with ❤️ for better financial decisions**
