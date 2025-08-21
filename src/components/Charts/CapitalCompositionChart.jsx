import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { formatCurrency } from '../../utils/calculations';

/**
 * Capital Composition Chart - Shows stacked areas for own (above 0) vs rent (below 0) scenarios
 */
const CapitalCompositionChart = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 60, right: 150, bottom: 80, left: 100 };
    const width = 900 - margin.left - margin.right;
    const height = 500 - margin.bottom - margin.top;

    const g = svg
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Prepare data for stacking
    const ownData = data.map(d => ({
      year: d.year,
      homeEquity: d.homeEquity || 0,
      ownInvestments: d.ownInvestments || 0
    }));

    const rentData = data.map(d => ({
      year: d.year,
      rentInvestments: -(d.rentInvestments || 0) // Negative for below zero display
    }));

    // Set up scales
    const xScale = d3.scaleLinear()
      .domain(d3.extent(data, d => d.year))
      .range([0, width]);

    // Find max values for scale
    const maxOwnValue = d3.max(data, d => (d.homeEquity || 0) + (d.ownInvestments || 0));
    const maxRentValue = d3.max(data, d => d.rentInvestments || 0);
    const maxValue = Math.max(maxOwnValue, maxRentValue);

    const yScale = d3.scaleLinear()
      .domain([-maxValue * 1.1, maxValue * 1.1])
      .range([height, 0]);

    // Create stack generators
    const ownStack = d3.stack()
      .keys(['homeEquity', 'ownInvestments'])
      .order(d3.stackOrderNone)
      .offset(d3.stackOffsetNone);

    const rentStack = d3.stack()
      .keys(['rentInvestments'])
      .order(d3.stackOrderNone)
      .offset(d3.stackOffsetNone);

    const ownStackedData = ownStack(ownData);
    const rentStackedData = rentStack(rentData);

    // Color schemes - consistent investment color
    const ownColors = ['#3b82f6', '#10b981']; // Blue for home equity, green for investments
    const rentColors = ['#10b981']; // Same green for investments to maintain consistency

    // Area generator
    const area = d3.area()
      .x(d => xScale(d.data.year))
      .y0(d => yScale(d[0]))
      .y1(d => yScale(d[1]))
      .curve(d3.curveCardinal);

    // Draw own scenario areas (above zero)
    g.selectAll('.own-area')
      .data(ownStackedData)
      .enter()
      .append('path')
      .attr('class', 'own-area')
      .attr('d', area)
      .attr('fill', (d, i) => ownColors[i])
      .attr('opacity', 0.8)
      .attr('stroke', 'white')
      .attr('stroke-width', 1);

    // Draw rent scenario areas (below zero)
    g.selectAll('.rent-area')
      .data(rentStackedData)
      .enter()
      .append('path')
      .attr('class', 'rent-area')
      .attr('d', area)
      .attr('fill', (d, i) => rentColors[i])
      .attr('opacity', 0.8)
      .attr('stroke', 'white')
      .attr('stroke-width', 1);

    // Add zero line
    g.append('line')
      .attr('x1', 0)
      .attr('x2', width)
      .attr('y1', yScale(0))
      .attr('y2', yScale(0))
      .attr('stroke', '#374151')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '5,5');

    // Add axes
    const xAxis = d3.axisBottom(xScale)
      .tickFormat(d => `Year ${d}`);

    const yAxis = d3.axisLeft(yScale)
      .tickFormat(d => formatCurrency(Math.abs(d), true));

    g.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${height})`)
      .call(xAxis)
      .selectAll('text')
      .style('font-size', '12px')
      .style('fill', '#6b7280');

    g.append('g')
      .attr('class', 'y-axis')
      .call(yAxis)
      .selectAll('text')
      .style('font-size', '12px')
      .style('fill', '#6b7280');

    // Add axis labels
    g.append('text')
      .attr('class', 'x-label')
      .attr('text-anchor', 'middle')
      .attr('x', width / 2)
      .attr('y', height + 40)
      .style('font-size', '14px')
      .style('fill', '#374151')
      .style('font-weight', '500')
      .text('Years');

    g.append('text')
      .attr('class', 'y-label')
      .attr('text-anchor', 'middle')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', -50)
      .style('font-size', '14px')
      .style('fill', '#374151')
      .style('font-weight', '500')
      .text('Net Worth');

    // Add title
    g.append('text')
      .attr('class', 'chart-title')
      .attr('text-anchor', 'middle')
      .attr('x', width / 2)
      .attr('y', -20)
      .style('font-size', '18px')
      .style('font-weight', 'bold')
      .style('fill', '#1f2937')
      .text('Capital Composition Over Time');

    // Add legend
    const legend = g.append('g')
      .attr('class', 'legend')
      .attr('transform', `translate(${width + 20}, 20)`);

    // Add legend background
    legend.append('rect')
      .attr('x', -10)
      .attr('y', -10)
      .attr('width', 120)
      .attr('height', 90)
      .attr('fill', 'white')
      .attr('stroke', '#e5e7eb')
      .attr('stroke-width', 1)
      .attr('rx', 4);

    const legendData = [
      { label: 'Home Equity', color: ownColors[0], scenario: 'own' },
      { label: 'Investments (Own)', color: ownColors[1], scenario: 'own' },
      { label: 'Investments (Rent)', color: rentColors[0], scenario: 'rent' }
    ];

    const legendItems = legend.selectAll('.legend-item')
      .data(legendData)
      .enter()
      .append('g')
      .attr('class', 'legend-item')
      .attr('transform', (d, i) => `translate(0, ${i * 25})`);

    legendItems.append('rect')
      .attr('width', 15)
      .attr('height', 15)
      .attr('fill', d => d.color)
      .attr('opacity', 0.8);

    legendItems.append('text')
      .attr('x', 20)
      .attr('y', 12)
      .style('font-size', '12px')
      .style('fill', '#374151')
      .style('font-weight', '500')
      .text(d => d.label);

    legendItems.append('text')
      .attr('x', 20)
      .attr('y', 12)
      .style('font-size', '12px')
      .style('fill', '#374151')
      .text(d => d.label);

    // Add scenario labels
    g.append('text')
      .attr('class', 'scenario-label')
      .attr('text-anchor', 'start')
      .attr('x', 10)
      .attr('y', yScale(maxValue * 0.8))
      .style('font-size', '16px')
      .style('font-weight', 'bold')
      .style('fill', '#059669')
      .text('🏠 Own + Invest');

    g.append('text')
      .attr('class', 'scenario-label')
      .attr('text-anchor', 'start')
      .attr('x', 10)
      .attr('y', yScale(-maxValue * 0.8))
      .style('font-size', '16px')
      .style('font-weight', 'bold')
      .style('fill', '#6b7280')
      .text('🏠 Rent + Invest');

    // Add interactive tooltips
    const tooltip = d3.select('body').append('div')
      .attr('class', 'chart-tooltip')
      .style('opacity', 0)
      .style('position', 'absolute')
      .style('background', 'rgba(0, 0, 0, 0.8)')
      .style('color', 'white')
      .style('padding', '8px 12px')
      .style('border-radius', '4px')
      .style('font-size', '12px')
      .style('pointer-events', 'none')
      .style('z-index', '1000');

    // Add invisible overlay for mouse tracking
    g.append('rect')
      .attr('class', 'overlay')
      .attr('width', width)
      .attr('height', height)
      .style('fill', 'none')
      .style('pointer-events', 'all')
      .on('mousemove', function(event) {
        const [mouseX] = d3.pointer(event);
        const year = Math.round(xScale.invert(mouseX));
        const dataPoint = data.find(d => d.year === year);
        
        if (dataPoint) {
          tooltip
            .style('opacity', 1)
            .html(`
              <div><strong>Year ${year}</strong></div>
              <div style="margin-top: 4px;">
                <div style="color: ${ownColors[0]};">Home Equity: ${formatCurrency(dataPoint.homeEquity)}</div>
                <div style="color: ${ownColors[1]};">Own Investments: ${formatCurrency(dataPoint.ownInvestments)}</div>
                <div style="color: ${rentColors[0]};">Rent Investments: ${formatCurrency(dataPoint.rentInvestments)}</div>
              </div>
              <div style="margin-top: 4px; border-top: 1px solid #444; padding-top: 4px;">
                <div><strong>Own Total: ${formatCurrency(dataPoint.ownNetWorth)}</strong></div>
                <div><strong>Rent Total: ${formatCurrency(dataPoint.rentNetWorth)}</strong></div>
              </div>
            `)
            .style('left', (event.pageX + 10) + 'px')
            .style('top', (event.pageY - 10) + 'px');
        }
      })
      .on('mouseout', function() {
        tooltip.style('opacity', 0);
      });

    // Cleanup function
    return () => {
      d3.select('body').selectAll('.chart-tooltip').remove();
    };

  }, [data]);

  return (
    <div className="chart-container">
      <div style={{ width: '100%', overflowX: 'auto' }}>
        <svg 
          ref={svgRef} 
          style={{ 
            width: '100%', 
            height: 'auto',
            minWidth: '900px',
            display: 'block' 
          }}
          viewBox={`0 0 900 500`}
          preserveAspectRatio="xMidYMid meet"
        ></svg>
      </div>
    </div>
  );
};

export default CapitalCompositionChart;
