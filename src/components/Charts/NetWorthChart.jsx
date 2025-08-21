import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { formatCurrency } from '../../utils/calculations';
import './NetWorthChart.css';

/**
 * Net Worth Comparison Chart using D3.js
 */
const NetWorthChart = ({ data, width = 800, height = 400 }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous render

    const margin = { top: 20, right: 80, bottom: 60, left: 80 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    // Create chart group
    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Scales
    const xScale = d3.scaleLinear()
      .domain(d3.extent(data, d => d.year))
      .range([0, chartWidth]);

    const maxNetWorth = d3.max(data, d => Math.max(d.ownNetWorth, d.rentNetWorth));
    const yScale = d3.scaleLinear()
      .domain([0, maxNetWorth * 1.1])
      .range([chartHeight, 0]);

    // Line generators
    const ownLine = d3.line()
      .x(d => xScale(d.year))
      .y(d => yScale(d.ownNetWorth))
      .curve(d3.curveMonotoneX);

    const rentLine = d3.line()
      .x(d => xScale(d.year))
      .y(d => yScale(d.rentNetWorth))
      .curve(d3.curveMonotoneX);

    // Add grid lines
    const xGrid = d3.axisBottom(xScale)
      .tickSize(-chartHeight)
      .tickFormat('');

    const yGrid = d3.axisLeft(yScale)
      .tickSize(-chartWidth)
      .tickFormat('');

    g.append('g')
      .attr('class', 'grid')
      .attr('transform', `translate(0,${chartHeight})`)
      .call(xGrid);

    g.append('g')
      .attr('class', 'grid')
      .call(yGrid);

    // Add axes
    g.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${chartHeight})`)
      .call(d3.axisBottom(xScale).tickFormat(d => `Year ${d}`));

    g.append('g')
      .attr('class', 'y-axis')
      .call(d3.axisLeft(yScale).tickFormat(d => formatCurrency(d, true)));

    // Add axis labels
    g.append('text')
      .attr('class', 'axis-label')
      .attr('text-anchor', 'middle')
      .attr('x', chartWidth / 2)
      .attr('y', chartHeight + 45)
      .text('Years');

    g.append('text')
      .attr('class', 'axis-label')
      .attr('text-anchor', 'middle')
      .attr('transform', 'rotate(-90)')
      .attr('x', -chartHeight / 2)
      .attr('y', -50)
      .text('Net Worth');

    // Add lines
    g.append('path')
      .datum(data)
      .attr('class', 'line own-line')
      .attr('d', ownLine)
      .attr('stroke', '#2563eb')
      .attr('stroke-width', 3)
      .attr('fill', 'none');

    g.append('path')
      .datum(data)
      .attr('class', 'line rent-line')
      .attr('d', rentLine)
      .attr('stroke', '#dc2626')
      .attr('stroke-width', 3)
      .attr('fill', 'none');

    // Add dots for data points
    g.selectAll('.own-dot')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'own-dot')
      .attr('cx', d => xScale(d.year))
      .attr('cy', d => yScale(d.ownNetWorth))
      .attr('r', 4)
      .attr('fill', '#2563eb');

    g.selectAll('.rent-dot')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'rent-dot')
      .attr('cx', d => xScale(d.year))
      .attr('cy', d => yScale(d.rentNetWorth))
      .attr('r', 4)
      .attr('fill', '#dc2626');

    // Add legend
    const legend = g.append('g')
      .attr('class', 'legend')
      .attr('transform', `translate(${chartWidth - 180}, 20)`);

    const legendItems = [
      { label: '🏠 Own + Invest', color: '#2563eb' },
      { label: '🏠 Rent + Invest', color: '#dc2626' }
    ];

    const legendItem = legend.selectAll('.legend-item')
      .data(legendItems)
      .enter()
      .append('g')
      .attr('class', 'legend-item')
      .attr('transform', (d, i) => `translate(0, ${i * 25})`);

    legendItem.append('line')
      .attr('x1', 0)
      .attr('x2', 20)
      .attr('y1', 0)
      .attr('y2', 0)
      .attr('stroke', d => d.color)
      .attr('stroke-width', 3);

    legendItem.append('text')
      .attr('x', 25)
      .attr('y', 0)
      .attr('dy', '0.35em')
      .attr('class', 'legend-text')
      .text(d => d.label);

    // Tooltip
    const tooltip = d3.select('body').selectAll('.chart-tooltip')
      .data([0])
      .enter()
      .append('div')
      .attr('class', 'chart-tooltip')
      .style('opacity', 0);

    // Overlay for mouse events
    const overlay = g.append('rect')
      .attr('class', 'overlay')
      .attr('width', chartWidth)
      .attr('height', chartHeight)
      .style('fill', 'none')
      .style('pointer-events', 'all');

    // Mouse events for tooltip
    overlay
      .on('mouseover', () => tooltip.style('opacity', 1))
      .on('mouseout', () => tooltip.style('opacity', 0))
      .on('mousemove', function(event) {
        const [mouseX] = d3.pointer(event, this);
        const year = Math.round(xScale.invert(mouseX));
        const dataPoint = data.find(d => d.year === year);
        
        if (dataPoint) {
          tooltip
            .html(`
              <div class="tooltip-content">
                <div class="tooltip-title">Year ${year}</div>
                <div class="tooltip-item">
                  <span class="tooltip-label own">🏠 Own + Invest:</span>
                  <span class="tooltip-value">${formatCurrency(dataPoint.ownNetWorth)}</span>
                </div>
                <div class="tooltip-item">
                  <span class="tooltip-label rent">🏠 Rent + Invest:</span>
                  <span class="tooltip-value">${formatCurrency(dataPoint.rentNetWorth)}</span>
                </div>
                <div class="tooltip-item">
                  <span class="tooltip-label difference">Advantage:</span>
                  <span class="tooltip-value ${dataPoint.ownNetWorth > dataPoint.rentNetWorth ? 'positive' : 'negative'}">
                    ${dataPoint.ownNetWorth > dataPoint.rentNetWorth ? 'Own' : 'Rent'} by ${formatCurrency(Math.abs(dataPoint.ownNetWorth - dataPoint.rentNetWorth))}
                  </span>
                </div>
              </div>
            `)
            .style('left', (event.pageX + 10) + 'px')
            .style('top', (event.pageY - 10) + 'px');
        }
      });

  }, [data, width, height]);

  return (
    <div className="chart-container">
      <div className="chart-header">
        <h3>📊 Net Worth Comparison: Own + Invest vs Rent + Invest</h3>
        <p>Compare total wealth accumulation between the two strategies over time</p>
      </div>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        style={{ width: '100%', height: 'auto' }}
      />
    </div>
  );
};

export default NetWorthChart;
