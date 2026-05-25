export function fmt(n: number, decimals = 0) {
  return n.toLocaleString('pt-BR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

export function fmtCurrency(n: number) {
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
}

export function fmtPercent(n: number, decimals = 1) {
  return `${n.toFixed(decimals)}%`;
}

export function fmtHours(n: number) {
  return `${fmt(n)}h`;
}

export function statusColor(status: string): string {
  const map: Record<string, string> = {
    'Publicado': '#16a34a',
    'Aprovado': '#2563eb',
    'Em validação gestão': '#7c3aed',
    'Em validação operacional': '#0099CC',
    'Em mapeamento': '#d97706',
    'Em levantamento': '#f59e0b',
    'Ajustes solicitados': '#dc2626',
    'Não iniciado': '#6b7280',
  };
  return map[status] || '#6b7280';
}

export function statusBg(status: string): string {
  const map: Record<string, string> = {
    'Publicado': '#dcfce7',
    'Aprovado': '#dbeafe',
    'Em validação gestão': '#ede9fe',
    'Em validação operacional': '#D9EAF4',
    'Em mapeamento': '#fef3c7',
    'Em levantamento': '#fef9c3',
    'Ajustes solicitados': '#fee2e2',
    'Não iniciado': '#f3f4f6',
  };
  return map[status] || '#f3f4f6';
}

export function criticalityColor(c: string) {
  return c === 'Alta' ? '#dc2626' : c === 'Média' ? '#d97706' : '#16a34a';
}

export function criticalityBg(c: string) {
  return c === 'Alta' ? '#fee2e2' : c === 'Média' ? '#fef3c7' : '#dcfce7';
}

export function riskColor(r: string) {
  return r === 'Crítico' ? '#991b1b'
    : r === 'Alto' ? '#dc2626'
    : r === 'Médio' ? '#d97706'
    : '#16a34a';
}

export function healthColor(score: number) {
  return score >= 80 ? '#16a34a'
    : score >= 60 ? '#d97706'
    : score >= 40 ? '#f59e0b'
    : '#dc2626';
}

export function diffDays(a: string, b: string = new Date().toISOString().split('T')[0]) {
  return Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86400000);
}

export function clamp(val: number, min: number, max: number) {
  return Math.min(max, Math.max(min, val));
}

export function cn(...classes: (string | false | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
