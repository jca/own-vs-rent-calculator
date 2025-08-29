import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

/**
 * Chart comparing monthly costs between owning and renting over time
 */
const MonthlyCostsChart = ({ data, parameters }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!data) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Chart dimensions and margins
    const margin = { top: 20, right: 80, bottom: 60, left: 80 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Create main chart group
    const chartGroup = svg
      .attr('viewBox', `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Prepare data
    const timeHorizon = parameters.timeHorizon || 30;
    
    // Set up scales
    const xScale = d3.scaleLinear()
      .domain([0, timeHorizon])
      .range([0, width]);

    const maxCost = d3.max(data, d => Math.max(d.ownMonthlyPayment, d.rentMonthlyPayment)) || 0;
    const yScale = d3.scaleLinear()
      .domain([0, maxCost * 1.1])
      .range([height, 0]);

    // Create line generators
    const ownLine = d3.line()
      .x(d => xScale(d.year))
      .y(d => yScale(d.ownMonthlyPayment))
      .curve(d3.curveMonotoneX);

    const rentLine = d3.line()
      .x(d => xScale(d.year))
      .y(d => yScale(d.rentMonthlyPayment))
      .curve(d3.curveMonotoneX);

    // Add grid lines
    const xGrid = d3.axisBottom(xScale)
      .tickSize(-height)
      .tickFormat('');

    const yGrid = d3.axisLeft(yScale)
      .tickSize(-width)
      .tickFormat('');

    chartGroup.append('g')
      .attr('class', 'grid')
      .attr('transform', `translate(0,${height})`)
      .call(xGrid)
      .style('stroke-dasharray', '3,3')
      .style('opacity', 0.3);

    chartGroup.append('g')
      .attr('class', 'grid')
      .call(yGrid)
      .style('stroke-dasharray', '3,3')
      .style('opacity', 0.3);

    // Add axes
    chartGroup.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale).tickFormat(d => `${d}y`))
      .style('font-size', '12px');

    chartGroup.append('g')
      .call(d3.axisLeft(yScale).tickFormat(d => `$${d3.format(',.0f')(d)}`))
      .style('font-size', '12px');

    // Add axis labels
    chartGroup.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - margin.left)
      .attr('x', 0 - (height / 2))
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('font-weight', 'bold')
      .text('Monthly Cost ($)');

    chartGroup.append('text')
      .attr('transform', `translate(${width / 2}, ${height + margin.bottom - 10})`)
      .style('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('font-weight', 'bold')
      .text('Years');

    // Add chart title
    chartGroup.append('text')
      .attr('x', width / 2)
      .attr('y', -5)
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .style('font-weight', 'bold')
      .text('Monthly Housing Costs Over Time');

    // Add own cost line
    chartGroup.append('path')
      .datum(data)
      .attr('class', 'own-line')
      .attr('fill', 'none')
      .attr('stroke', '#2563eb')
      .attr('stroke-width', 3)
      .attr('d', ownLine);

    // Add rent cost line
    chartGroup.append('path')
      .datum(data)
      .attr('class', 'rent-line')
      .attr('fill', 'none')
      .attr('stroke', '#dc2626')
      .attr('stroke-width', 3)
      .attr('d', rentLine);

    // Add data points
    chartGroup.selectAll('.own-dot')
      .data(data)
      .enter().append('circle')
      .attr('class', 'own-dot')
      .attr('cx', d => xScale(d.year))
      .attr('cy', d => yScale(d.ownMonthlyPayment))
      .attr('r', 4)
      .attr('fill', '#2563eb')
      .style('cursor', 'pointer');

    chartGroup.selectAll('.rent-dot')
      .data(data)
      .enter().append('circle')
      .attr('class', 'rent-dot')
      .attr('cx', d => xScale(d.year))
      .attr('cy', d => yScale(d.rentMonthlyPayment))
      .attr('r', 4)
      .attr('fill', '#dc2626')
      .style('cursor', 'pointer');

    // Add legend
    const legend = chartGroup.append('g')
      .attr('class', 'legend')
      .attr('transform', `translate(${width - 150}, 20)`);

    const legendData = [
      { label: 'Own', color: '#2563eb' },
      { label: 'Rent', color: '#dc2626' }
    ];

    const legendItems = legend.selectAll('.legend-item')
      .data(legendData)
      .enter().append('g')
      .attr('class', 'legend-item')
      .attr('transform', (d, i) => `translate(0, ${i * 25})`);

    legendItems.append('line')
      .attr('x1', 0)
      .attr('x2', 20)
      .attr('y1', 0)
      .attr('y2', 0)
      .attr('stroke', d => d.color)
      .attr('stroke-width', 3);

    legendItems.append('text')
      .attr('x', 25)
      .attr('y', 0)
      .attr('dy', '0.35em')
      .style('font-size', '14px')
      .text(d => d.label);

    // Add tooltips
    const tooltip = d3.select('body').selectAll('.monthly-costs-tooltip')
      .data([null])
      .join('div')
      .attr('class', 'monthly-costs-tooltip')
      .style('position', 'absolute')
      .style('visibility', 'hidden')
      .style('background-color', 'rgba(0, 0, 0, 0.8)')
      .style('color', 'white')
      .style('padding', '10px')
      .style('border-radius', '5px')
      .style('font-size', '12px')
      .style('pointer-events', 'none')
      .style('z-index', '1000');

    // Add hover interactions
    const addHoverEffects = (selector, dataType) => {
      chartGroup.selectAll(selector)
        .on('mouseover', function(event, d) {
          d3.select(this).attr('r', 6);
          
          const cost = dataType === 'own' ? d.ownMonthlyPayment : d.rentMonthlyPayment;
          const costType = dataType === 'own' ? 'Own' : 'Rent';
          
          tooltip
            .style('visibility', 'visible')
            .html(`
              <strong>Year ${d.year}</strong><br/>
              ${costType} Monthly Cost: $${d3.format(',.0f')(cost)}<br/>
              Annual Cost: $${d3.format(',.0f')(cost * 12)}
            `);
        })
        .on('mousemove', function(event) {
          tooltip
            .style('top', (event.pageY - 10) + 'px')
            .style('left', (event.pageX + 10) + 'px');
        })
        .on('mouseout', function() {
          d3.select(this).attr('r', 4);
          tooltip.style('visibility', 'hidden');
        });
    };

    addHoverEffects('.own-dot', 'own');
    addHoverEffects('.rent-dot', 'rent');

    // Add cost difference annotations
    const midPoint = Math.floor(data.length / 2);
    if (data[midPoint]) {
      const midData = data[midPoint];
      const difference = midData.ownMonthlyPayment - midData.rentMonthlyPayment;
      const xPos = xScale(midData.year);
      const yPos = yScale(Math.max(midData.ownMonthlyPayment, midData.rentMonthlyPayment)) - 20;

      if (Math.abs(difference) > maxCost * 0.05) { // Only show if difference is significant
        const annotation = chartGroup.append('g')
          .attr('class', 'cost-annotation')
          .attr('transform', `translate(${xPos}, ${yPos})`);

        annotation.append('rect')
          .attr('x', -40)
          .attr('y', -15)
          .attr('width', 80)
          .attr('height', 25)
          .attr('fill', 'white')
          .attr('stroke', '#666')
          .attr('stroke-width', 1)
          .attr('rx', 3);

        annotation.append('text')
          .attr('text-anchor', 'middle')
          .attr('dy', '0.35em')
          .style('font-size', '11px')
          .style('font-weight', 'bold')
          .style('fill', difference > 0 ? '#dc2626' : '#16a34a')
          .text(`${difference > 0 ? '+' : ''}$${d3.format(',.0f')(difference)}`);
      }
    }

    // Cleanup function
    return () => {
      d3.select('body').selectAll('.monthly-costs-tooltip').remove();
    };

  }, [data, parameters]);

  if (!data) {
    return (
      <div className="chart-container">
        <div className="chart-placeholder">
          <p>Enter parameters to see monthly costs comparison</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chart-container">
      <div className="chart-header">
        <h3>Monthly Housing Costs Comparison</h3>
        <p className="chart-description">
          Compare monthly housing expenses over time. Rent typically increases annually while mortgage payments remain fixed.
        </p>
      </div>
      <div className="chart-content">
        <svg ref={svgRef} style={{ width: '100%', height: 'auto' }}></svg>
      </div>
      <div className="chart-insights">
        <div className="insight-box">
          <h4>📊 Key Insights</h4>
          <ul>
            <li><strong>Own costs</strong> include mortgage payment + taxes + insurance + maintenance + HOA fees</li>
            <li><strong>Rent costs</strong> increase annually based on rent increase rate ({parameters.rentIncreaseRate || 3}% per year)</li>
            <li>Mortgage payments stay fixed, making ownership costs more predictable long-term</li>
            {parameters.rentalIncome && (
              <li>Rental income of ${d3.format(',.0f')(parameters.rentalIncome || 0)}/month reduces effective own costs</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MonthlyCostsChart;
