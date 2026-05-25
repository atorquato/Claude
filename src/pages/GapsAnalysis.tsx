import { useMemo, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { AlertTriangle, Layers, Users, Settings, Database, GitBranch } from 'lucide-react';
import { useStore, useFilteredFlows } from '../store/useStore';
import { Badge, CriticalityBadge } from '../components/ui/Badge';
import type { GapType, Gap } from '../data/mockData';

const GAP_ICONS: Record<GapType, typeof AlertTriangle> = {
  Processo: GitBranch, Sistema: Settings, Pessoas: Users,
  Governança: Layers, Dados: Database,
};
const GAP_COLORS: Record<GapType, string> = {
  Processo: '#003B5C', Sistema: '#005A7A', Pessoas: '#7A9A01',
  Governança: '#d97706', Dados: '#7c3aed',
};

const CAUSES = [
  'Crescimento acelerado', 'Legado tecnológico', 'Falta de governança',
  'Capacitação insuficiente', 'Integração incompleta', 'Ausência de controles',
];

export function GapsAnalysis() {
  const flows = useFilteredFlows();
  const gaps = useStore(s => s.gaps);
  const [selectedType, setSelectedType] = useState<GapType | null>(null);
  const [view, setView] = useState<'heatmap' | 'ishikawa' | 'matrix'>('heatmap');

  const filtered = selectedType ? gaps.filter(g => g.type === selectedType) : gaps;
  const openGaps = filtered.filter(g => g.status !== 'Resolvido');

  const byType = useMemo(() => {
    const types: GapType[] = ['Processo', 'Sistema', 'Pessoas', 'Governança', 'Dados'];
    return types.map(t => ({
      type: t,
      total: gaps.filter(g => g.type === t).length,
      open: gaps.filter(g => g.type === t && g.status !== 'Resolvido').length,
      high: gaps.filter(g => g.type === t && g.impact === 'Alto').length,
      color: GAP_COLORS[t],
    }));
  }, [gaps]);

  const byFront = useMemo(() => {
    const fronts = [...new Set(flows.map(f => f.front))].slice(0, 8);
    return fronts.map(front => {
      const frontFlows = flows.filter(f => f.front === front);
      const frontGaps = gaps.filter(g => frontFlows.some(f => f.id === g.flowId));
      return {
        front: front.length > 12 ? front.slice(0, 12) + '…' : front,
        gaps: frontGaps.filter(g => g.status !== 'Resolvido').length,
        high: frontGaps.filter(g => g.impact === 'Alto').length,
      };
    }).sort((a, b) => b.gaps - a.gaps);
  }, [flows, gaps]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
        {byType.map(t => {
          const Icon = GAP_ICONS[t.type as GapType];
          return (
            <div
              key={t.type}
              onClick={() => setSelectedType(selectedType === t.type as GapType ? null : t.type as GapType)}
              style={{
                padding: '16px', background: '#FFFFFF', border: '1.5px solid',
                borderColor: selectedType === t.type ? GAP_COLORS[t.type as GapType] : '#D9E1E7',
                borderRadius: 12, cursor: 'pointer', transition: 'all 0.2s ease',
                boxShadow: selectedType === t.type ? `0 4px 20px ${GAP_COLORS[t.type as GapType]}30` : 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: GAP_COLORS[t.type as GapType] + '15', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={16} color={GAP_COLORS[t.type as GapType]} />
                </div>
                {t.high > 0 && <Badge variant="red">{t.high} alto</Badge>}
              </div>
              <p style={{ margin: 0, fontSize: 11, color: '#667085', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{t.type}</p>
              <p style={{ margin: '4px 0 0', fontSize: 26, fontWeight: 800, color: GAP_COLORS[t.type as GapType], letterSpacing: '-0.03em', lineHeight: 1 }}>
                {t.open}
              </p>
              <p style={{ margin: '2px 0 0', fontSize: 11, color: '#B0BFCC' }}>de {t.total} total</p>
            </div>
          );
        })}
      </div>

      {/* View tabs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div className="tab-group">
          {[
            { id: 'heatmap', label: 'Heatmap Operacional' },
            { id: 'ishikawa', label: 'Ishikawa' },
            { id: 'matrix', label: 'Matriz Impacto' },
          ].map(t => (
            <button key={t.id} className={`tab-item ${view === t.id ? 'active' : ''}`} onClick={() => setView(t.id as any)}>
              {t.label}
            </button>
          ))}
        </div>
        <span style={{ marginLeft: 'auto', fontSize: 13, color: '#667085' }}>
          {openGaps.length} GAPs abertos · {filtered.filter(g => g.status === 'Resolvido').length} resolvidos
        </span>
      </div>

      {view === 'heatmap' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 20 }}>
          <div className="enterprise-card" style={{ padding: 22 }}>
            <div className="section-header">
              <div>
                <p className="section-title">GAPs por Frente Operacional</p>
                <p className="section-subtitle">Concentração e criticidade por área</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={byFront} layout="vertical" barSize={14}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EDF1F5" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#B0BFCC', fontFamily: 'Inter' }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="front" tick={{ fontSize: 11.5, fill: '#667085', fontFamily: 'Inter' }} axisLine={false} tickLine={false} width={110} />
                <Tooltip contentStyle={{ background: '#102A43', border: 'none', borderRadius: 10, color: '#FFFFFF', fontSize: 12, fontFamily: 'Inter' }} />
                <Bar dataKey="gaps" fill="#003B5C" radius={[0, 4, 4, 0]} name="GAPs Abertos" />
                <Bar dataKey="high" fill="#dc2626" radius={[0, 4, 4, 0]} name="Alto Impacto" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="enterprise-card" style={{ padding: 22 }}>
            <div className="section-header">
              <p className="section-title">Top GAPs Críticos</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {openGaps.filter(g => g.impact === 'Alto').slice(0, 6).map(gap => (
                <div key={gap.id} style={{
                  padding: '10px 12px', background: '#FFF8F7',
                  border: '1px solid #FECACA', borderRadius: 9,
                  borderLeft: `3px solid ${GAP_COLORS[gap.type]}`,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                    <Badge variant="brand">{gap.type}</Badge>
                    <CriticalityBadge criticality={gap.criticality} />
                  </div>
                  <p style={{ margin: 0, fontSize: 12.5, color: '#102A43', lineHeight: 1.4 }}>{gap.description}</p>
                  <p style={{ margin: '5px 0 0', fontSize: 11, color: '#667085' }}>
                    Ganho estimado: <strong>{gap.estimatedGain}h</strong> · {gap.recommendation.slice(0, 45)}...
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {view === 'ishikawa' && (
        <div className="enterprise-card" style={{ padding: 28 }}>
          <div className="section-header" style={{ marginBottom: 24 }}>
            <div>
              <p className="section-title">Diagrama de Ishikawa — Causa e Efeito</p>
              <p className="section-subtitle">Análise de causa raiz por categoria operacional</p>
            </div>
          </div>
          <IshikawaDiagram gaps={openGaps} />
        </div>
      )}

      {view === 'matrix' && (
        <div className="enterprise-card" style={{ padding: 22 }}>
          <div className="section-header">
            <p className="section-title">Matriz Impacto × Criticidade</p>
          </div>
          <ImpactMatrix gaps={openGaps} />
        </div>
      )}

      {/* Gap table */}
      <div className="enterprise-card" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #EDF1F5' }}>
          <p className="section-title">Catálogo de GAPs Operacionais</p>
          <p className="section-subtitle">Lista completa de diagnósticos identificados</p>
        </div>
        <table className="enterprise-table">
          <thead>
            <tr>
              <th>ID</th><th>Tipo</th><th>Descrição</th><th>Impacto</th>
              <th>Causa Raiz</th><th>Recomendação</th><th>Ganho Est.</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            {openGaps.slice(0, 20).map(gap => (
              <tr key={gap.id}>
                <td><span style={{ fontSize: 11, fontFamily: 'monospace', color: '#B0BFCC' }}>{gap.id}</span></td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: GAP_COLORS[gap.type] }} />
                    <span style={{ fontSize: 12 }}>{gap.type}</span>
                  </div>
                </td>
                <td><span style={{ fontSize: 12.5 }}>{gap.description}</span></td>
                <td><Badge variant={gap.impact === 'Alto' ? 'red' : gap.impact === 'Médio' ? 'yellow' : 'green'}>{gap.impact}</Badge></td>
                <td><span style={{ fontSize: 12, color: '#667085' }}>{gap.rootCause}</span></td>
                <td><span style={{ fontSize: 12, color: '#667085' }}>{gap.recommendation}</span></td>
                <td><span style={{ fontSize: 12.5, fontWeight: 600, color: '#7A9A01' }}>{gap.estimatedGain}h</span></td>
                <td><Badge variant={gap.status === 'Resolvido' ? 'green' : gap.status === 'Em análise' ? 'blue' : 'red'}>{gap.status}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function IshikawaDiagram({ gaps }: { gaps: Gap[] }) {
  const categories = [
    { label: 'Processo', causes: gaps.filter(g => g.type === 'Processo').map(g => g.rootCause), color: '#003B5C' },
    { label: 'Sistema', causes: gaps.filter(g => g.type === 'Sistema').map(g => g.rootCause), color: '#005A7A' },
    { label: 'Pessoas', causes: gaps.filter(g => g.type === 'Pessoas').map(g => g.rootCause), color: '#7A9A01' },
    { label: 'Governança', causes: gaps.filter(g => g.type === 'Governança').map(g => g.rootCause), color: '#d97706' },
    { label: 'Dados', causes: gaps.filter(g => g.type === 'Dados').map(g => g.rootCause), color: '#7c3aed' },
  ];

  const W = 900, H = 440;
  const spineY = H / 2;
  const headX = W - 100;

  const topCats = categories.slice(0, 3);
  const bottomCats = categories.slice(3);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 360, fontFamily: 'Inter, sans-serif' }}>
      {/* Background */}
      <rect x="0" y="0" width={W} height={H} fill="#FAFBFD" rx="8" />

      {/* Main spine */}
      <line x1="60" y1={spineY} x2={headX} y2={spineY} stroke="#003B5C" strokeWidth="2.5" />
      <polygon points={`${headX},${spineY - 12} ${headX + 30},${spineY} ${headX},${spineY + 12}`} fill="#003B5C" />

      {/* Head label */}
      <rect x={headX + 32} y={spineY - 24} width={66} height={48} rx="8" fill="#003B5C" />
      <text x={headX + 65} y={spineY - 4} textAnchor="middle" fill="white" fontSize="10" fontWeight="700">INEFICIÊNCIA</text>
      <text x={headX + 65} y={spineY + 10} textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="9">OPERACIONAL</text>

      {/* Top categories */}
      {topCats.map((cat, i) => {
        const x = 120 + i * 240;
        const causes = [...new Set(cat.causes)].slice(0, 2);
        return (
          <g key={cat.label}>
            <line x1={x} y1={20} x2={x + 60} y2={spineY} stroke={cat.color} strokeWidth="1.8" strokeDasharray="0" opacity={0.7} />
            <rect x={x - 50} y={10} width={100} height={22} rx="5" fill={cat.color} />
            <text x={x} y={24} textAnchor="middle" fill="white" fontSize="10" fontWeight="700">{cat.label}</text>
            {causes.map((cause, ci) => (
              <g key={ci}>
                <line x1={x - 20 + ci * 40} y1={40} x2={x + 10 + ci * 20} y2={spineY - 30} stroke={cat.color} strokeWidth="1" opacity={0.3} />
                <text x={x - 30 + ci * 10} y={55 + ci * 14} fontSize="8.5" fill="#667085" textAnchor="middle">{String(cause).slice(0, 25)}</text>
              </g>
            ))}
          </g>
        );
      })}

      {/* Bottom categories */}
      {bottomCats.map((cat, i) => {
        const x = 150 + i * 300;
        const causes = [...new Set(cat.causes)].slice(0, 2);
        return (
          <g key={cat.label}>
            <line x1={x} y1={H - 20} x2={x + 60} y2={spineY} stroke={cat.color} strokeWidth="1.8" opacity={0.7} />
            <rect x={x - 50} y={H - 32} width={100} height={22} rx="5" fill={cat.color} />
            <text x={x} y={H - 17} textAnchor="middle" fill="white" fontSize="10" fontWeight="700">{cat.label}</text>
            {causes.map((cause, ci) => (
              <g key={ci}>
                <text x={x - 30 + ci * 10} y={H - 50 - ci * 14} fontSize="8.5" fill="#667085" textAnchor="middle">{String(cause).slice(0, 25)}</text>
              </g>
            ))}
          </g>
        );
      })}

      {/* Effect label on spine */}
      <text x="80" y={spineY - 8} fontSize="9" fill="#B0BFCC" fontWeight="600">CAUSAS</text>
      <text x={headX - 50} y={spineY - 8} fontSize="9" fill="#B0BFCC" fontWeight="600">EFEITO</text>
    </svg>
  );
}

function ImpactMatrix({ gaps }: { gaps: any[] }) {
  const cells = [
    { x: 'Alto', y: 'Alta', label: 'AÇÃO IMEDIATA', bg: '#fee2e2', border: '#dc2626', color: '#991b1b' },
    { x: 'Alto', y: 'Média', label: 'PRIORITÁRIO', bg: '#fef3c7', border: '#d97706', color: '#92400e' },
    { x: 'Alto', y: 'Baixa', label: 'MONITORAR', bg: '#dbeafe', border: '#2563eb', color: '#1e40af' },
    { x: 'Médio', y: 'Alta', label: 'PLANEJAR', bg: '#fef3c7', border: '#d97706', color: '#92400e' },
    { x: 'Médio', y: 'Média', label: 'MELHORAR', bg: '#D9EAF4', border: '#005A7A', color: '#003B5C' },
    { x: 'Médio', y: 'Baixa', label: 'OPORTUNIDADE', bg: '#dcfce7', border: '#16a34a', color: '#166534' },
    { x: 'Baixo', y: 'Alta', label: 'REVISAR', bg: '#dbeafe', border: '#2563eb', color: '#1e40af' },
    { x: 'Baixo', y: 'Média', label: 'OTIMIZAR', bg: '#dcfce7', border: '#16a34a', color: '#166534' },
    { x: 'Baixo', y: 'Baixa', label: 'ACEITÁVEL', bg: '#f3f4f6', border: '#d1d5db', color: '#6b7280' },
  ];

  return (
    <div>
      <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
        <div style={{ width: 100 }} />
        {['Alto', 'Médio', 'Baixo'].map(imp => (
          <div key={imp} style={{ flex: 1, textAlign: 'center', fontSize: 11, fontWeight: 700, color: '#667085', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Impacto {imp}
          </div>
        ))}
      </div>
      {['Alta', 'Média', 'Baixa'].map(crit => (
        <div key={crit} style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
          <div style={{ width: 100, display: 'flex', alignItems: 'center', fontSize: 11, fontWeight: 700, color: '#667085', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Crit. {crit}
          </div>
          {['Alto', 'Médio', 'Baixo'].map(imp => {
            const cell = cells.find(c => c.x === imp && c.y === crit)!;
            const count = gaps.filter(g => g.impact === imp && g.criticality === crit).length;
            return (
              <div key={imp} style={{
                flex: 1, minHeight: 80, background: cell.bg, border: `1.5px solid ${cell.border}`,
                borderRadius: 10, padding: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: cell.color }}>{count}</div>
                <div style={{ fontSize: 10, fontWeight: 700, color: cell.color, textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'center', marginTop: 4 }}>
                  {cell.label}
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
