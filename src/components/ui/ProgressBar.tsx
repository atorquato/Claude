import React from 'react';
import { healthColor } from '../../utils/format';

interface Props {
  value: number;
  max?: number;
  color?: string;
  height?: number;
  showLabel?: boolean;
  autoColor?: boolean;
}

export function ProgressBar({ value, max = 100, color, height = 6, showLabel, autoColor }: Props) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const c = autoColor ? healthColor(pct) : (color || '#005A7A');
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{
        flex: 1, height, background: '#EDF1F5', borderRadius: 99, overflow: 'hidden'
      }}>
        <div style={{
          height: '100%', width: `${pct}%`, background: c,
          borderRadius: 99, transition: 'width 0.6s cubic-bezier(0.16,1,0.3,1)'
        }} />
      </div>
      {showLabel && (
        <span style={{ fontSize: 12, fontWeight: 600, color: c, minWidth: 36 }}>
          {Math.round(pct)}%
        </span>
      )}
    </div>
  );
}
