import { useState, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Cell, ComposedChart, Line, ReferenceLine, AreaChart, Area,
} from 'recharts';
import { Zap, TrendingUp, DollarSign, Users, Clock, ChevronRight, Play } from 'lucide-react';
import { useStore, useFilteredFlows } from '../store/useStore';
import { Badge } from '../components/ui/Badge';
import { fmt, fmtCurrency, fmtHours, fmtPercent } from '../utils/format';

const INTERVENTIONS = [
  { id: 'automate', label: 'Automatizar atividades manuais', impact: 0.65, category: 'Automação' },
  { id: 'remove_approval', label: 'Remover aprovações redundantes', impact: 0.15, category: 'Simplificação' },
  { id: 'integrate', label: 'Integrar sistemas legados', impact: 0.25, category: 'Integração' },
  { id: 'eliminate_rework', label: 'Eliminar retrabalho', impact: 0.20, category: 'Qualidade' },
  { id: 'reduce_validation', label: 'Reduzir validações manuais', impact: 0.18, category: 'Automação' },
  { id: 'simplify_ops', label: 'Simplificar operações paralelas', impact: 0.12, category: 'Simplificação' },
  { id: 'remove_parallel', label: 'Remover controles paralelos', impact: 0.10, category: 'Governança' },
  { id: 'data_governance', label: 'Implementar governança de dados', impact: 0.08, category: 'Dados' },
];

export function Transformation() {
  const flows = useFilteredFlows();
  const kpiSummary = useStore(s => s.kpiSummary);
  const [selected, setSelected] = useState<Set<string>>(new Set(['automate', 'eliminate_rework']));
  const [simulated, setSimulated] = useState(false);

  const baseHours = flows.reduce((s, f) => s + f.manualHours, 0);
  const baseRework = flows.reduce((s, f) => s + f.rework, 0) / flows.length;
  const HOURLY_COST = 85;
  const MONTHS_PER_YEAR = 12;

  const totalImpact = useMemo(() =>
    Array.from(selected).reduce((sum, id) => {
      const intv = INTERVENTIONS.find(i => i.id === id);
      return sum + (intv?.impact || 0);
    }, 0),
    [selected]
  );

  const clampedImpact = Math.min(0.95, totalImpact);
  const hoursRecovered = Math.round(baseHours * clampedImpact);
  const fteEquivalent = +(hoursRecovered / 160).toFixed(1);
  const annualSavings = hoursRecovered * HOURLY_COST * MONTHS_PER_YEAR;
  const reworkReduction = Math.min(95, Math.round(baseRework * clampedImpact * 1.5));
  const capacityGain = Math.round(clampedImpact * 100);

  const waterfallData = [
    { name: 'Base', value: baseHours, fill: '#D9E1E7' },
    ...Array.from(selected).map(id => {
      const intv = INTERVENTIONS.find(i => i.id === id)!;
      return { name: intv.label.slice(0, 22) + '…', value: -Math.round(baseHours * intv.impact * 0.8), fill: '#005A7A' };
    }),
    { name: 'Resultado', value: baseHours - hoursRecovered, fill: '#7A9A01' },
  ];

  const beforAfterData = [
    { metric: 'Horas Manuais', before: baseHours, after: baseHours - hoursRecovered, unit: 'h' },
    { metric: 'Retrabalho', before: Math.round(baseRework), after: Math.round(baseRework * (1 - clampedImpact * 0.7)), unit: '%' },
    { metric: 'Lead Time', before: 45, after: Math.round(45 * (1 - clampedImpact * 0.5)), unit: 'dias' },
    { metric: 'SLA Violações', before: kpiSummary.slaBreaches, after: Math.max(0, Math.round(kpiSummary.slaBreaches * (1 - clampedImpact * 0.7))), unit: '' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #001f35, #003B5C)',
        borderRadius: 14, padding: '22px 28px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <Zap size={20} color="#7A9A01" />
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
              Transformation Impact Engine
            </h2>
          </div>
          <p style={{ margin: 0, fontSize: 13, color: 'rgba(255,255,255,0.6)', maxWidth: 520 }}>
            Simule o impacto de iniciativas de automação, simplificação e melhoria operacional.
            Selecione as intervenções desejadas e calcule automaticamente os ganhos projetados.
          </p>
        </div>
        <button
          className="btn-primary"
          style={{ fontFamily: 'inherit', padding: '10px 22px', fontSize: 14 }}
          onClick={() => setSimulated(true)}
        >
          <Play size={14} />
          Executar Simulação
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 20 }}>
        {/* Intervention selector */}
        <div className="enterprise-card" style={{ padding: 22 }}>
          <div className="section-header">
            <p className="section-title">Intervenções Disponíveis</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {INTERVENTIONS.map(intv => {
              const active = selected.has(intv.id);
              return (
                <div
                  key={intv.id}
                  onClick={() => {
                    const s = new Set(selected);
                    active ? s.delete(intv.id) : s.add(intv.id);
                    setSelected(s);
                    setSimulated(false);
                  }}
                  style={{
                    padding: '11px 14px', borderRadius: 10, cursor: 'pointer',
                    border: `1.5px solid ${active ? '#005A7A' : '#EDF1F5'}`,
                    background: active ? '#D9EAF4' : '#F9FBFD',
                    transition: 'all 0.2s ease',
                    display: 'flex', alignItems: 'center', gap: 12,
                  }}
                >
                  <div style={{
                    width: 18, height: 18, borderRadius: 5, border: `2px solid ${active ? '#005A7A' : '#D9E1E7'}`,
                    background: active ? '#005A7A' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    {active && <div style={{ width: 6, height: 6, borderRadius: 2, background: '#FFFFFF' }} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: active ? 600 : 400, color: active ? '#003B5C' : '#102A43' }}>{intv.label}</p>
                    <p style={{ margin: 0, fontSize: 11, color: '#667085' }}>{intv.category} · {Math.round(intv.impact * 100)}% impacto estimado</p>
                  </div>
                  <Badge variant={intv.category === 'Automação' ? 'brand' : intv.category === 'Qualidade' ? 'accent' : intv.category === 'Simplificação' ? 'blue' : 'gray'}>
                    {intv.category}
                  </Badge>
                </div>
              );
            })}
          </div>
        </div>

        {/* Results */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Impact KPIs */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[
              { label: 'Horas Recuperadas', value: fmtHours(hoursRecovered), icon: Clock, color: '#005A7A', bg: '#D9EAF4', delta: `${capacityGain}% de ganho` },
              { label: 'FTEs Equivalentes', value: `${fteEquivalent} FTE`, icon: Users, color: '#7A9A01', bg: '#ecfccb', delta: `liberados operacionalmente` },
              { label: 'Economia Anual', value: fmtCurrency(annualSavings), icon: DollarSign, color: '#16a34a', bg: '#dcfce7', delta: `vs. cenário atual` },
              { label: 'Redução Retrabalho', value: `${reworkReduction}%`, icon: TrendingUp, color: '#d97706', bg: '#fef3c7', delta: `melhoria na qualidade` },
            ].map(k => (
              <div key={k.label} style={{
                padding: '16px 18px', background: '#FFFFFF',
                border: '1px solid #D9E1E7', borderRadius: 12,
                borderLeft: `3px solid ${k.color}`,
                boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ margin: 0, fontSize: 11, color: '#667085', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{k.label}</p>
                    <p style={{ margin: '6px 0 0', fontSize: 24, fontWeight: 800, color: k.color, letterSpacing: '-0.03em', lineHeight: 1 }}>{k.value}</p>
                    <p style={{ margin: '4px 0 0', fontSize: 11, color: '#667085' }}>{k.delta}</p>
                  </div>
                  <div style={{ width: 36, height: 36, borderRadius: 9, background: k.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <k.icon size={16} color={k.color} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Waterfall / Before-After */}
          <div className="enterprise-card" style={{ padding: 22 }}>
            <div className="section-header">
              <p className="section-title">Análise Before vs. After</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {beforAfterData.map(item => (
                <div key={item.metric} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ width: 110, fontSize: 12.5, fontWeight: 500, color: '#102A43' }}>{item.metric}</span>
                  <div style={{ flex: 1, display: 'flex', gap: 6, alignItems: 'center' }}>
                    <div style={{ flex: item.before, height: 28, background: '#003B5C', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#FFFFFF' }}>{item.before}{item.unit}</span>
                    </div>
                    <ChevronRight size={14} color="#B0BFCC" />
                    <div style={{ flex: item.after, height: 28, background: '#7A9A01', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 40 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#FFFFFF' }}>{item.after}{item.unit}</span>
                    </div>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#16a34a', minWidth: 52 }}>
                    -{Math.round(((item.before - item.after) / item.before) * 100)}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Narrative */}
          <div style={{
            padding: '16px 20px', background: 'linear-gradient(135deg, #D9EAF4, #EDF1F5)',
            borderRadius: 12, border: '1px solid rgba(0,90,122,0.2)',
          }}>
            <p style={{ margin: '0 0 8px', fontSize: 12, fontWeight: 700, color: '#003B5C', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              NARRATIVA EXECUTIVA GERADA
            </p>
            <p style={{ margin: 0, fontSize: 13.5, color: '#102A43', lineHeight: 1.6, fontStyle: 'italic' }}>
              "Com a implementação das {selected.size} intervenções selecionadas, a operação tem potencial de recuperar{' '}
              <strong>{fmtHours(hoursRecovered)}</strong> mensais, equivalentes a{' '}
              <strong>{fteEquivalent} FTEs</strong>, gerando economia anual estimada de{' '}
              <strong>{fmtCurrency(annualSavings)}</strong>. A redução do retrabalho em{' '}
              <strong>{reworkReduction}%</strong> impactará diretamente a qualidade, escalabilidade e SLA da frente operacional."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
