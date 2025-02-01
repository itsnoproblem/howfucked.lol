import React from 'react';
import styles from './Gauge.module.css';

interface GaugeProps {
  value: number; // 0-100
  label: string;
  onChange?: (value: number) => void;
}

export const Gauge: React.FC<GaugeProps> = ({ value, label, onChange }) => {
  const normalizedValue = Math.min(100, Math.max(0, value));
  
  // Calculate the angle in radians
  const angleInDegrees = (normalizedValue / 100) * 180;
  const angleInRadians = (angleInDegrees * Math.PI) / 180;
  
  // Calculate end point coordinates for the arc
  const radius = 80;
  const centerX = 100;
  const centerY = 90;
  const endX = centerX + radius * Math.cos(Math.PI - angleInRadians);
  const endY = centerY - radius * Math.sin(angleInRadians);


  const getColor = (value: number) => {
    if (value <= 55) return '#4CAF50'; // Green
    if (value <= 80) return '#FFA500'; // Yellow/Orange
    return '#FF0000'; // Red
  };

  const handleClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.min(100, Math.max(0, (x / rect.width) * 100));
    
    // If parent needs to update the value, you'll need to add an onChange prop
    if (onChange) {
      onChange(Math.round(percentage));
    }
  };

  return (
    <div className={styles.gaugeContainer}>
      <svg
        className={styles.gauge}
        viewBox="0 0 200 100"
        xmlns="http://www.w3.org/2000/svg"
        onClick={handleClick}
        style={{ cursor: 'pointer' }}
      >
        {/* Background arc */}
        <path
          d="M20 90 A 80 80 0 0 1 180 90"
          fill="none"
          stroke="#e6e6e6"
          strokeWidth="20"
          strokeLinecap="round"
        />
        {/* Value arc - updated with correct path calculation */}
        <path
          d={`M20 90 A 80 80 0 0 1 ${endX} ${endY}`}
          fill="none"
          stroke={getColor(normalizedValue)}
          strokeWidth="20"
          strokeLinecap="round"
        />
        {/* Label */}
        <text
          x="100"
          y="70"
          textAnchor="middle"
          className={styles.gaugeLabel}
        >
          {label}
        </text>
        {/* Value text */}
        <text
          x="100"
          y="40"
          textAnchor="middle"
          className={styles.gaugeValue}
        >
          {normalizedValue}%
        </text>
      </svg>
    </div>
  );
}; 