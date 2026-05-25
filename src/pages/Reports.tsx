import React, { useState } from 'react';
import { FileText, Mail, Presentation, BarChart2, Download, Eye, Wand2, ChevronRight, CheckCircle } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Badge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';
import { fmt, fmtCurrency, fmtHours, healthColor } from '../utils/format';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, AreaChart, Area
} from 'recharts';
import { maturityRadar, monthlyTrend } from '../data/mockData';

type ReportType = 'email' | 'onepage' | 'presentation' | 'builder';

const REPORT_TYPES = [
  { id: 'email' as ReportType, label: 'Quick Status E-mail', icon: Mail, desc: 'Report HTML exportável para e-mail executivo', color: '#005A7A', badge: 'E-mail' },
  { id: 'onepage' as ReportType, label: 'One Page Executive', icon: FileText, desc: 'Snapshot executivo estilo consultoria estratégica', color: '#003B5C', badge: 'PDF / PNG' },
  { id: 'presentation' as ReportType, label: 'Executive Presentation', icon: Presentation, desc: 'Slides automáticos para diretoria e board', color: '#7A9A01', badge: 'PowerPoint' },
  { id: 'builder' as ReportType, label: 'Report Builder', icon: BarChart2, desc: 'Construa reports customizados com drag & drop', color: '#7c3aed', badge: 'Custom' },
];

export function Reports() {
  const { flows, gaps, kpiSummary, analysts } = useStore(s => ({
    flows: s.filteredFlows(), gaps: s.gaps, kpiSummary: s.kpiSummary, analysts: s.analysts,
  }));
  const [activeType, setActiveType] = useState<ReportType>('onepage');
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => { setGenerating(false); setGenerated(true); }, 1800);
  };

  const overallHealth = Math.round(flows.reduce((s, f) => s + f.healthScore, 0) / (flows.length || 1));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Report type selector */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {REPORT_TYPES.map(rt => (
          <div
            key={rt.id}
            onClick={() => { setActiveType(rt.id); setGenerated(false); }}
            style={{
              padding: '16px 18px', background: '#FFFFFF',
              border: `1.5px solid ${activeType === rt.id ? rt.color : '#D9E1E7'}`,
              borderRadius: 12, cursor: 'pointer', transition: 'all 0.2s ease',
              boxShadow: activeType === rt.id ? `0 4px 20px ${rt.color}25` : 'none',
              borderTop: `3px solid ${activeType === rt.id ? rt.color : 'transparent'}`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 9, background: rt.color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <rt.icon size={18} color={rt.color} />
              </div>
              <span style={{ fontSize: 10, fontWeight: 700, background: rt.color + '20', color: rt.color, borderRadius: 99, padding: '2px 8px' }}>{rt.badge}</span>
            </div>
            <p style={{ margin: 0, fontSize: 13.5, fontWeight: 700, color: '#102A43' }}>{rt.label}</p>
            <p style={{ margin: '4px 0 0', fontSize: 11.5, color: '#667085', lineHeight: 1.4 }}>{rt.desc}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 20, alignItems: 'start' }}>
        {/* Config panel */}
        <div className="enterprise-card" style={{ padding: 22 }}>
          <p className="section-title" style={{ marginBottom: 16 }}>Configuração do Report</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <p style={{ margin: '0 0 8px', fontSize: 12, fontWeight: 600, color: '#667085', textTransform: 'uppercase', letterSpacing: '0.05em' }}>CONTEÚDO</p>
              {[
                'KPIs Operacionais', 'Status de Fluxos', 'GAPs Críticos',
                'Análise de Riscos', 'Potencial de Transformação', 'Roadmap Estratégico',
                'Workload Analistas', 'Narrativa Executiva', 'Gráficos e Visões',
              ].map(item => (
                <label key={item} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, cursor: 'pointer' }}>
                  <input type="checkbox" defaultChecked style={{ accentColor: '#005A7A', width: 14, height: 14 }} />
                  <span style={{ fontSize: 13, color: '#102A43' }}>{item}</span>
                </label>
              ))}
            </div>

            <div>
              <p style={{ margin: '0 0 8px', fontSize: 12, fontWeight: 600, color: '#667085', textTransform: 'uppercase', letterSpacing: '0.05em' }}>TEMPLATES</p>
              {['Diretoria', 'Consultoria', 'Steering Committee', 'Board Executivo'].map(t => (
                <label key={t} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, cursor: 'pointer' }}>
                  <input type="radio" name="template" defaultChecked={t === 'Diretoria'} style={{ accentColor: '#005A7A' }} />
                  <span style={{ fontSize: 13, color: '#102A43' }}>{t}</span>
                </label>
              ))}
            </div>

            <div>
              <p style={{ margin: '0 0 8px', fontSize: 12, fontWeight: 600, color: '#667085', textTransform: 'uppercase', letterSpacing: '0.05em' }}>EXPORTAÇÃO</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {['PDF', 'PNG', 'EML', 'PPTX', 'Imprimir'].map(f => (
                  <label key={f} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px', border: '1px solid #D9E1E7', borderRadius: 7, cursor: 'pointer', fontSize: 12 }}>
                    <input type="checkbox" defaultChecked={['PDF', 'PNG'].includes(f)} style={{ accentColor: '#005A7A' }} />
                    {f}
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerate}
              className="btn-primary"
              style={{ fontFamily: 'inherit', justifyContent: 'center', marginTop: 8 }}
              disabled={generating}
            >
              {generating ? (
                <>
                  <div style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#FFFFFF', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  Gerando report...
                </>
              ) : (
                <>
                  <Wand2 size={14} />
                  Gerar Report Executivo
                </>
              )}
            </button>

            {generated && (
              <div style={{ padding: '10px 14px', background: '#dcfce7', border: '1px solid #86efac', borderRadius: 9, display: 'flex', alignItems: 'center', gap: 8 }}>
                <CheckCircle size={16} color="#16a34a" />
                <span style={{ fontSize: 13, color: '#16a34a', fontWeight: 600 }}>Report gerado com sucesso!</span>
              </div>
            )}
          </div>
        </div>

        {/* Preview */}
        <div className="enterprise-card" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid #EDF1F5', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Eye size={15} color="#667085" />
              <span style={{ fontSize: 13.5, fontWeight: 600, color: '#102A43' }}>Preview — One Page Executive Report</span>
            </div>
            {generated && (
              <button className="btn-primary" style={{ fontFamily: 'inherit', padding: '7px 14px', fontSize: 12 }}>
                <Download size={12} /> Exportar PDF
              </button>
            )}
          </div>

          {/* Actual report preview */}
          <div style={{ padding: 24, background: '#F9FBFD' }}>
            <div style={{
              background: '#FFFFFF', borderRadius: 12, overflow: 'hidden',
              boxShadow: '0 8px 32px rgba(0,0,0,0.08)', border: '1px solid #E8EDF2',
            }}>
              {/* Report header */}
              <div style={{ background: 'linear-gradient(135deg, #001f35, #003B5C)', padding: '22px 28px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ margin: 0, fontSize: 10, fontWeight: 700, color: '#7A9A01', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                      PROCESSFLOW · ENTERPRISE OPERATIONAL TRANSFORMATION
                    </p>
                    <h2 style={{ margin: '6px 0 0', fontSize: 20, fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
                      Executive Operational Report
                    </h2>
                    <p style={{ margin: '4px 0 0', fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>
                      Período: Janeiro — Maio 2025 · Gerado em 25/05/2025
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ margin: 0, fontSize: 36, fontWeight: 800, color: healthColor(overallHealth), letterSpacing: '-0.04em' }}>
                      {overallHealth}
                      <span style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)' }}>/100</span>
                    </p>
                    <p style={{ margin: '2px 0 0', fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>Health Score</p>
                  </div>
                </div>
              </div>

              {/* KPI strip */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', borderBottom: '1px solid #EDF1F5' }}>
                {[
                  { label: 'Fluxos', value: fmt(flows.length) },
                  { label: 'Publicados', value: fmt(kpiSummary.published) },
                  { label: 'Em andamento', value: fmt(kpiSummary.inProgress) },
                  { label: 'GAPs abertos', value: fmt(kpiSummary.openGaps) },
                  { label: 'Em risco', value: fmt(kpiSummary.atRisk) },
                  { label: 'Ganho potencial', value: fmtHours(kpiSummary.estimatedGainHours) },
                ].map((k, i) => (
                  <div key={i} style={{ padding: '12px 14px', borderRight: i < 5 ? '1px solid #EDF1F5' : 'none', textAlign: 'center' }}>
                    <p style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#102A43', letterSpacing: '-0.02em' }}>{k.value}</p>
                    <p style={{ margin: '2px 0 0', fontSize: 10.5, color: '#667085', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{k.label}</p>
                  </div>
                ))}
              </div>

              {/* Content */}
              <div style={{ padding: '20px 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                {/* Trend chart */}
                <div>
                  <p style={{ margin: '0 0 10px', fontSize: 12, fontWeight: 700, color: '#102A43', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    EVOLUÇÃO OPERACIONAL
                  </p>
                  <ResponsiveContainer width="100%" height={140}>
                    <AreaChart data={monthlyTrend.slice(0, 6)}>
                      <defs>
                        <linearGradient id="rptGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#005A7A" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="#005A7A" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#EDF1F5" vertical={false} />
                      <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#B0BFCC' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 10, fill: '#B0BFCC' }} axisLine={false} tickLine={false} width={20} />
                      <Tooltip contentStyle={{ background: '#102A43', border: 'none', borderRadius: 8, fontSize: 11 }} />
                      <Area type="monotone" dataKey="published" stroke="#005A7A" fill="url(#rptGrad)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Maturity radar */}
                <div>
                  <p style={{ margin: '0 0 10px', fontSize: 12, fontWeight: 700, color: '#102A43', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    RADAR DE MATURIDADE
                  </p>
                  <ResponsiveContainer width="100%" height={140}>
                    <RadarChart data={maturityRadar}>
                      <PolarGrid stroke="#EDF1F5" />
                      <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9, fill: '#667085' }} />
                      <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                      <Radar dataKey="value" stroke="#005A7A" fill="#005A7A" fillOpacity={0.15} strokeWidth={2} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                {/* Narrative */}
                <div style={{ gridColumn: 'span 2', padding: '14px 18px', background: '#F5F7FA', borderRadius: 10, borderLeft: '4px solid #003B5C' }}>
                  <p style={{ margin: '0 0 6px', fontSize: 11, fontWeight: 700, color: '#003B5C', textTransform: 'uppercase', letterSpacing: '0.06em' }}>NARRATIVA EXECUTIVA</p>
                  <p style={{ margin: 0, fontSize: 13, color: '#102A43', lineHeight: 1.6 }}>
                    "A operação apresenta <strong>{kpiSummary.published} fluxos publicados</strong> e{' '}
                    <strong>{kpiSummary.inProgress} em andamento</strong>, com health score médio de{' '}
                    <strong>{overallHealth}/100</strong>. O diagnóstico identificou{' '}
                    <strong>{kpiSummary.openGaps} GAPs abertos</strong>, dos quais{' '}
                    <strong>{kpiSummary.criticalGaps} de alta criticidade</strong>. O potencial de transformação aponta{' '}
                    ganho de <strong>{fmtHours(kpiSummary.estimatedGainHours)}</strong> mensais, equivalentes a{' '}
                    <strong>{kpiSummary.estimatedFTE} FTEs</strong> e economia anual estimada de{' '}
                    <strong>{fmtCurrency(kpiSummary.estimatedAnnualSavings)}</strong>."
                  </p>
                </div>

                {/* Risks */}
                <div>
                  <p style={{ margin: '0 0 10px', fontSize: 12, fontWeight: 700, color: '#102A43', textTransform: 'uppercase', letterSpacing: '0.05em' }}>RISCOS OPERACIONAIS</p>
                  {flows.filter(f => f.riskLevel === 'Crítico').slice(0, 3).map(f => (
                    <div key={f.id} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#dc2626', flexShrink: 0 }} />
                      <span style={{ fontSize: 12, color: '#102A43' }}>{f.name}</span>
                      <span style={{ fontSize: 11, color: '#667085', marginLeft: 'auto' }}>{f.slaConsumed}% SLA</span>
                    </div>
                  ))}
                </div>

                {/* Next steps */}
                <div>
                  <p style={{ margin: '0 0 10px', fontSize: 12, fontWeight: 700, color: '#102A43', textTransform: 'uppercase', letterSpacing: '0.05em' }}>PRÓXIMAS AÇÕES</p>
                  {[
                    'Validar fluxos em ajustes com gestores',
                    `Revisar ${kpiSummary.criticalGaps} GAPs críticos identificados`,
                    'Iniciar piloto de automação em processos elegíveis',
                    'Alinhar roadmap de transformação Q3 2025',
                  ].map((a, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 6 }}>
                      <ChevronRight size={14} color="#005A7A" style={{ flexShrink: 0, marginTop: 1 }} />
                      <span style={{ fontSize: 12, color: '#102A43' }}>{a}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div style={{ padding: '10px 24px', background: '#F5F7FA', borderTop: '1px solid #EDF1F5', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 10, color: '#B0BFCC' }}>ProcessFlow Enterprise Operational Transformation Platform</span>
                <span style={{ fontSize: 10, color: '#B0BFCC' }}>Confidencial — Uso Interno Restrito</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
