import React from 'react';
import type { LucideIcon } from 'lucide-react';

type Accent = 'brand' | 'accent' | 'red' | 'yellow' | 'purple' | 'teal' | 'gray';

interface Props {
  label: string;
  value: string | number;
  sub?: string;
  icon?: LucideIcon;
  trend?: number;
  accent?: Accent;
  onClick?: () => void;
  description?: string;
  loading?: boolean;
  compact?: boolean;
}

const ACCENT_COLORS: Record<Accent, { top: string; icon: string; iconBg: string }> = {
  brand:  { top: 'linear-gradient(90deg,#003B5C,#005A7A)', icon: '#005A7A', iconBg: '#D9EAF4' },
  accent: { top: 'linear-gradient(90deg,#5A7200,#7A9A01)', icon: '#5A7200', iconBg: '#ecfccb' },
  red:    { top: 'linear-gradient(90deg,#991b1b,#dc2626)', icon: '#dc2626', iconBg: '#fee2e2' },
  yellow: { top: 'linear-gradient(90deg,#92400e,#d97706)', icon: '#d97706', iconBg: '#fef3c7' },
  purple: { top: 'linear-gradient(90deg,#5b21b6,#7c3aed)', icon: '#7c3aed', iconBg: '#ede9fe' },
  teal:   { top: 'linear-gradient(90deg,#0f766e,#14b8a6)', icon: '#0f766e', iconBg: '#ccfbf1' },
  gray:   { top: 'linear-gradient(90deg,#4b5563,#6b7280)', icon: '#6b7280', iconBg: '#f3f4f6' },
};

export function KPICard({ label, value, sub, icon: Icon, trend, accent = 'brand', onClick, description, loading, compact }: Props) {
  const colors = ACCENT_COLORS[accent];
  const trendPos = trend !== undefined && trend > 0;
  const trendNeg = trend !== undefined && trend < 0;

  return (
    <div
      className="kpi-card"
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      onClick={onClick}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: colors.top, borderRadius: '12px 12px 0 0' }} />

      {loading ? (
        <div>
          <div className="shimmer" style={{ height: 12, width: '60%', borderRadius: 6, marginBottom: 16 }} />
          <div className="shimmer" style={{ height: 32, width: '40%', borderRadius: 6 }} />
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#667085', margin: '0 0 8px' }}>
              {label}
            </p>
            <p style={{ fontSize: compact ? 24 : 30, fontWeight: 700, color: '#102A43', letterSpacing: '-0.03em', margin: 0, lineHeight: 1 }}>
              {value}
            </p>
            {sub && (
              <p style={{ fontSize: 12, color: '#667085', marginTop: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
                {trend !== undefined && (
                  <span style={{ color: trendPos ? '#16a34a' : trendNeg ? '#dc2626' : '#667085', fontWeight: 600 }}>
                    {trendPos ? '↑' : trendNeg ? '↓' : '→'} {Math.abs(trend)}%
                  </span>
                )}
                {sub}
              </p>
            )}
            {description && (
              <p style={{ fontSize: 11, color: '#B0BFCC', marginTop: 4 }}>{description}</p>
            )}
          </div>
          {Icon && (
            <div style={{
              width: 44, height: 44, borderRadius: 10, background: colors.iconBg,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
            }}>
              <Icon size={20} color={colors.icon} strokeWidth={2} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
