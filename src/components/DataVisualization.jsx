import React, { useState } from 'react';
import { calculateDailyAverages, convertTemp, calculateSummaryStats } from '../utils/weatherUtils';

const DataVisualization = ({ weatherData, unit }) => {
  const [tooltip, setTooltip] = useState(null);
  if (!weatherData?.list || !Array.isArray(weatherData.list) || weatherData.list.length === 0) {
    return <div className="data-visualization">No data available for visualization</div>;
  }
  const dailyData = calculateDailyAverages(weatherData.list);
  if (dailyData.length === 0) {
    return <div className="data-visualization">No valid data for visualization</div>;
  }
  const maxTemp = Math.max(...dailyData.map((d) => convertTemp(d.max, unit))) || 100;
  const minTemp = Math.min(...dailyData.map((d) => convertTemp(d.min, unit))) || 0;
  const range = maxTemp - minTemp || 10;

  const points = dailyData.map((day, i) => {
    const temp = convertTemp(day.avg, unit);
    if (isNaN(temp)) return null;
    const x = (i / (dailyData.length - 1)) * 460 + 30;
    const y = 220 - ((temp - minTemp) / range) * 180;
    return { x, y, temp, date: day.date, min: convertTemp(day.min, unit), max: convertTemp(day.max, unit) };
  }).filter(Boolean);

  const pathData = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');

  const handleMouseOver = (e, point) => {
    setTooltip({ x: e.clientX, y: e.clientY, temp: point.temp, date: point.date, min: point.min, max: point.max });
  };

  const handleMouseOut = () => {
    setTooltip(null);
  };

  const summary = calculateSummaryStats(dailyData, unit);

  return (
    <div className="data-visualization">
      <svg viewBox="0 0 500 260">
      
        {[0, 0.25, 0.5, 0.75, 1].map((t, i) => {
          const temp = minTemp + t * range;
          const y = 220 - (t * 180);
          return (
            <g key={i}>
              <line x1="30" x2="490" y1={y} y2={y} stroke="#ccc" strokeDasharray="2,2" />
              <text x="10" y={y + 5} fontSize="10">{temp.toFixed(1)}°{unit}</text>
            </g>
          );
        })}
     
        {points.map((point, i) => (
          <text key={i} x={point.x - 20} y="250" fontSize="10" transform={`rotate(-45 ${point.x} 250)`}>
            {point.date}
          </text>
        ))}
        
        {points.map((point, i) => {
          const minY = 220 - ((point.min - minTemp) / range) * 180;
          const maxY = 220 - ((point.max - minTemp) / range) * 180;
          return (
            <line
              key={i}
              x1={point.x}
              x2={point.x}
              y1={minY}
              y2={maxY}
              stroke="#0d6efd"
              strokeWidth="2"
              opacity="0.3"
            />
          );
        })}
       
        <path d={pathData} fill="none" stroke="#0d6efd" strokeWidth="2" />
        {/* Data Points */}
        {points.map((point, i) => (
          <circle
            key={point.date}
            cx={point.x.toString()}
            cy={point.y.toString()}
            r="5"
            fill="#0d6efd"
            onMouseOver={(e) => handleMouseOver(e, point)}
            onMouseOut={handleMouseOut}
          />
        ))}
        <text x="10" y="20" fontSize="12">Temperature (°{unit})</text>
      </svg>
      {tooltip && (
        <div
          className="tooltip"
          style={{ left: `${tooltip.x + 10}px`, top: `${tooltip.y - 50}px` }}
        >
          <p>{tooltip.date}</p>
          <p>Avg: {tooltip.temp.toFixed(1)}°{unit}</p>
          <p>Min: {tooltip.min.toFixed(1)}°{unit}</p>
          <p>Max: {tooltip.max.toFixed(1)}°{unit}</p>
        </div>
      )}
      <div className="summary">
        <p>Period Avg: {summary.avg.toFixed(1)}°{unit}</p>
        <p>Period Min: {summary.min.toFixed(1)}°{unit}</p>
        <p>Period Max: {summary.max.toFixed(1)}°{unit}</p>
      </div>
    </div>
  );
};

export default DataVisualization;