import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'green' | 'yellow' | 'red' | 'blue' | 'gray' | 'brand' | 'accent' | 'purple';
  size?: 'sm' | 'md';
  dot?: boolean;
}

const COLORS = {
  green: { bg: '#dcfce7', color: '#16a34a', dot: '#16a34a' },
  yellow: { bg: '#fef3c7', color: '#d97706', dot: '#d97706' },
  red: { bg: '#fee2e2', color: '#dc2626', dot: '#dc2626' },
  blue: { bg: '#dbeafe', color: '#2563eb', dot: '#2563eb' },
  gray: { bg: '#f3f4f6', color: '#6b7280', dot: '#6b7280' },
  brand: { bg: '#D9EAF4', color: '#003B5C', dot: '#005A7A' },
  accent: { bg: '#ecfccb', color: '#5A7200', dot: '#7A9A01' },
  purple: { bg: '#ede9fe', color: '#7c3aed', dot: '#7c3aed' },
};

export function Badge({ children, variant = 'gray', size = 'sm', dot }: BadgeProps) {
  const c = COLORS[variant];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '5px',
      padding: size === 'md' ? '3px 10px' : '2px 8px',
      borderRadius: '99px',
      background: c.bg, color: c.color,
      fontSize: size === 'md' ? '12px' : '11px',
      fontWeight: 600, letterSpacing: '0.02em',
      whiteSpace: 'nowrap',
    }}>
      {dot && (
        <span style={{
          width: 6, height: 6, borderRadius: '50%', background: c.dot, flexShrink: 0
        }} />
      )}
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, BadgeProps['variant']> = {
    'Publicado': 'green',
    'Aprovado': 'blue',
    'Em validação gestão': 'purple',
    'Em validação operacional': 'brand',
    'Em mapeamento': 'yellow',
    'Em levantamento': 'yellow',
    'Ajustes solicitados': 'red',
    'Não iniciado': 'gray',
  };
  return <Badge variant={map[status] || 'gray'} dot>{status}</Badge>;
}

export function CriticalityBadge({ criticality }: { criticality: string }) {
  const map: Record<string, BadgeProps['variant']> = {
    'Alta': 'red', 'Média': 'yellow', 'Baixa': 'green'
  };
  return <Badge variant={map[criticality] || 'gray'}>{criticality}</Badge>;
}

export function RiskBadge({ risk }: { risk: string }) {
  const map: Record<string, BadgeProps['variant']> = {
    'Crítico': 'red', 'Alto': 'red', 'Médio': 'yellow', 'Baixo': 'green'
  };
  return <Badge variant={map[risk] || 'gray'}>{risk}</Badge>;
}
