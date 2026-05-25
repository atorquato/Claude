import React, { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  AreaChart, Area, PieChart, Pie, Cell, Legend, LineChart, Line,
} from 'recharts';
import {
  Activity, AlertTriangle, CheckCircle, Clock, TrendingUp,
  Zap, Users, GitBranch, Target, DollarSign, BarChart2,
  ArrowUpRight, Shield, Layers, ArrowRight, Info
} from 'lucide-react';
import { KPICard } from '../components/ui/KPICard';
import { Badge, StatusBadge, RiskBadge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';
import { useStore, useFilteredFlows } from '../store/useStore';
import { fmt, fmtCurrency, fmtHours, statusColor, criticalityColor, healthColor } from '../utils/format';
import { frontDistribution, monthlyTrend, maturityRadar } from '../data/mockData';

const STATUS_ORDER = [
  'Não iniciado', 'Em levantamento', 'Em mapeamento',
  'Em validação operacional', 'Em validação gestão',
  'Ajustes solicitados', 'Aprovado', 'Publicado'
];

const STATUS_COLORS = [
  '#6b7280','#f59e0b','#d97706','#0099CC','#7c3aed','#dc2626','#2563eb','#16a34a'
];

export function Dashboard() {
  const filteredFlows = useFilteredFlows();
  const { gaps, kpiSummary, analysts } = useStore(s => ({
    gaps: s.gaps,
    kpiSummary: s.kpiSummary,
    analysts: s.analysts,
  }));

  const statusDist = useMemo(() => STATUS_ORDER.map((s, i) => ({
    status: s.replace('Em ', '').replace(' operacional', ' Op.').replace(' gestão', ' Gest.'),
    count: filteredFlows.filter(f => f.status === s).length,
    color: STATUS_COLORS[i],
  })), [filteredFlows]);

  const gapTypeDist = useMemo(() => {
    const types = ['Processo', 'Sistema', 'Pessoas', 'Governança', 'Dados'];
    const colors = ['#003B5C', '#005A7A', '#7A9A01', '#d97706', '#7c3aed'];
    return types.map((t, i) => ({
      name: t,
      value: gaps.filter(g => g.type === t && g.status !== 'Resolvido').length,
      color: colors[i],
    }));
  }, [gaps]);

  const critRisk = filteredFlows.filter(f => f.riskLevel === 'Crítico' || f.riskLevel === 'Alto').slice(0, 5);
  const recentPublished = filteredFlows.filter(f => f.status === 'Publicado').slice(0, 4);
  const autoFlows = filteredFlows.filter(f => f.automatable);

  const efficiency = filteredFlows.length > 0
    ? Math.round(filteredFlows.reduce((s, f) => s + f.progress, 0) / filteredFlows.length)
    : 0;

  const overallHealth = filteredFlows.length > 0
    ? Math.round(filteredFlows.reduce((s, f) => s + f.healthScore, 0) / filteredFlows.length)
    : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Strategic Banner */}
      <div className="animate-fade-in-up" style={{
        background: 'linear-gradient(135deg, #001f35 0%, #003B5C 50%, #005A7A 100%)',
        borderRadius: 16, padding: '24px 32px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        overflow: 'hidden', position: 'relative',
      }}>
        <div style={{
          position: 'absolute', right: -40, top: -40,
          width: 280, height: 280, borderRadius: '50%',
          background: 'rgba(255,255,255,0.03)',
        }} />
        <div style={{
          position: 'absolute', right: 80, bottom: -60,
          width: 200, height: 200, borderRadius: '50%',
          background: 'rgba(122,154,1,0.08)',
        }} />
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <div style={{
              padding: '3px 10px', borderRadius: 99,
              background: 'rgba(122,154,1,0.2)', border: '1px solid rgba(122,154,1,0.4)',
              fontSize: 11, fontWeight: 700, color: '#B4D418', letterSpacing: '0.06em',
            }}>
              PLATAFORMA ATIVA
            </div>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#7A9A01', animation: 'pulse-slow 2s ease-in-out infinite' }} />
          </div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.03em', lineHeight: 1.2 }}>
            Central de Transformação Operacional
          </h2>
          <p style={{ margin: '6px 0 0', fontSize: 13, color: 'rgba(255,255,255,0.6)', maxWidth: 480 }}>
            {filteredFlows.length} fluxos mapeados · {kpiSummary.totalGaps} GAPs identificados ·
            Potencial de {fmtHours(kpiSummary.estimatedGainHours)} recuperados e {kpiSummary.estimatedFTE} FTEs equivalentes
          </p>
        </div>
        <div style={{ display: 'flex', gap: 20, flexShrink: 0 }}>
          {[
            { label: 'Health Score', value: `${overallHealth}`, unit: '/100', color: healthColor(overallHealth) },
            { label: 'Progresso Médio', value: `${efficiency}`, unit: '%', color: '#7A9A01' },
            { label: 'Em Risco', value: String(kpiSummary.atRisk), unit: ' fluxos', color: '#dc2626' },
          ].map((m, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <p style={{ margin: 0, fontSize: 28, fontWeight: 800, color: m.color, letterSpacing: '-0.04em', lineHeight: 1 }}>
                {m.value}<span style={{ fontSize: 14, fontWeight: 500, opacity: 0.8 }}>{m.unit}</span>
              </p>
              <p style={{ margin: '4px 0 0', fontSize: 11, color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>{m.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* KPI Row 1 — Operational */}
      <div className="animate-fade-in-up stagger-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
        <KPICard label="Total de Fluxos" value={fmt(filteredFlows.length)} sub="mapeados na plataforma" icon={GitBranch} accent="brand" trend={8} />
        <KPICard label="Publicados" value={fmt(kpiSummary.published)} sub="prontos para uso" icon={CheckCircle} accent="accent" trend={12} />
        <KPICard label="Em Andamento" value={fmt(kpiSummary.inProgress)} sub="em mapeamento ativo" icon={Activity} accent="brand" />
        <KPICard label="Em Risco" value={fmt(kpiSummary.atRisk)} sub="alto risco ou crítico" icon={AlertTriangle} accent="red" trend={-3} />
        <KPICard label="SLA Estourado" value={fmt(kpiSummary.slaBreaches)} sub="acima do limite" icon={Clock} accent="yellow" />
        <KPICard label="Health Score" value={`${overallHealth}`} sub="média operacional" icon={Shield} accent={overallHealth >= 70 ? 'accent' : overallHealth >= 50 ? 'yellow' : 'red'} />
      </div>

      {/* KPI Row 2 — Transformation */}
      <div className="animate-fade-in-up stagger-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
        <KPICard label="Horas Planejadas" value={fmtHours(kpiSummary.totalHoursPlanned)} sub="alocadas nos fluxos" icon={Clock} accent="brand" />
        <KPICard label="Horas Manuais" value={fmtHours(kpiSummary.totalManualHours)} sub="dependência manual" icon={Users} accent="yellow" />
        <KPICard label="Ganho Potencial" value={fmtHours(kpiSummary.estimatedGainHours)} sub="automatizáveis" icon={Zap} accent="accent" trend={15} />
        <KPICard label="FTEs Equivalentes" value={`${kpiSummary.estimatedFTE}`} sub="capacidade liberada" icon={TrendingUp} accent="accent" />
        <KPICard label="Economia Anual" value={fmtCurrency(kpiSummary.estimatedAnnualSavings)} sub="potencial financeiro" icon={DollarSign} accent="accent" trend={22} />
        <KPICard label="GAPs Críticos" value={fmt(kpiSummary.criticalGaps)} sub="abertos — alta criticidade" icon={AlertTriangle} accent="red" />
      </div>

      {/* Main grid */}
      <div className="animate-fade-in-up stagger-3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>

        {/* Status distribution */}
        <div className="enterprise-card" style={{ padding: 22, gridColumn: 'span 2' }}>
          <div className="section-header">
            <div>
              <p className="section-title">Distribuição por Status Operacional</p>
              <p className="section-subtitle">Volume de fluxos em cada etapa do pipeline</p>
            </div>
            <Badge variant="brand" size="md">{filteredFlows.length} fluxos</Badge>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={statusDist} barSize={26}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EDF1F5" vertical={false} />
              <XAxis dataKey="status" tick={{ fontSize: 10.5, fill: '#667085', fontFamily: 'Inter' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#B0BFCC', fontFamily: 'Inter' }} axisLine={false} tickLine={false} width={24} />
              <Tooltip
                contentStyle={{ background: '#102A43', border: 'none', borderRadius: 10, color: '#FFFFFF', fontSize: 12, fontFamily: 'Inter' }}
                cursor={{ fill: 'rgba(0,59,92,0.04)' }}
              />
              <Bar dataKey="count" radius={[5, 5, 0, 0]}>
                {statusDist.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* GAP Type Donut */}
        <div className="enterprise-card" style={{ padding: 22 }}>
          <div className="section-header">
            <div>
              <p className="section-title">GAPs por Categoria</p>
              <p className="section-subtitle">Distribuição diagnóstica</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={gapTypeDist} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                {gapTypeDist.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#102A43', border: 'none', borderRadius: 10, color: '#FFFFFF', fontSize: 12, fontFamily: 'Inter' }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, fontFamily: 'Inter', color: '#667085' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Second grid row */}
      <div className="animate-fade-in-up stagger-4" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>

        {/* Monthly trend */}
        <div className="enterprise-card" style={{ padding: 22, gridColumn: 'span 2' }}>
          <div className="section-header">
            <div>
              <p className="section-title">Evolução Mensal Operacional</p>
              <p className="section-subtitle">Tendência de publicações e eficiência — 2025</p>
            </div>
            <div className="tab-group">
              {['Fluxos', 'Horas', 'GAPs'].map(t => (
                <button key={t} className={`tab-item ${t === 'Fluxos' ? 'active' : ''}`}>{t}</button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={monthlyTrend}>
              <defs>
                <linearGradient id="gradPublished" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#005A7A" stopOpacity={0.18} />
                  <stop offset="95%" stopColor="#005A7A" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradProgress" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7A9A01" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#7A9A01" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#EDF1F5" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#B0BFCC', fontFamily: 'Inter' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#B0BFCC', fontFamily: 'Inter' }} axisLine={false} tickLine={false} width={24} />
              <Tooltip contentStyle={{ background: '#102A43', border: 'none', borderRadius: 10, color: '#FFFFFF', fontSize: 12, fontFamily: 'Inter' }} />
              <Area type="monotone" dataKey="published" stroke="#005A7A" strokeWidth={2} fill="url(#gradPublished)" name="Publicados" />
              <Area type="monotone" dataKey="inProgress" stroke="#7A9A01" strokeWidth={2} fill="url(#gradProgress)" name="Em andamento" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Radar Maturity */}
        <div className="enterprise-card" style={{ padding: 22 }}>
          <div className="section-header">
            <div>
              <p className="section-title">Radar de Maturidade</p>
              <p className="section-subtitle">Visão multidimensional</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={maturityRadar}>
              <PolarGrid stroke="#EDF1F5" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#667085', fontFamily: 'Inter' }} />
              <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
              <Radar name="Maturidade" dataKey="value" stroke="#005A7A" fill="#005A7A" fillOpacity={0.15} strokeWidth={2} dot={{ r: 3, fill: '#005A7A' }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Front Performance + Risk Table */}
      <div className="animate-fade-in-up stagger-5" style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 20 }}>

        {/* Front distribution */}
        <div className="enterprise-card" style={{ padding: 22 }}>
          <div className="section-header">
            <div>
              <p className="section-title">Performance por Frente Operacional</p>
              <p className="section-subtitle">Volume, publicações e eficiência por área</p>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {frontDistribution.map((fd, i) => (
              <div key={fd.front} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: i < 3 ? '#005A7A' : i < 6 ? '#7A9A01' : '#D9E1E7', flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: '#102A43', fontWeight: 500, width: 160, flexShrink: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {fd.front}
                </span>
                <div style={{ flex: 1 }}>
                  <ProgressBar value={fd.published} max={Math.max(fd.flows, 1)} color={i < 3 ? '#005A7A' : '#7A9A01'} height={5} />
                </div>
                <span style={{ fontSize: 12, color: '#667085', width: 32, textAlign: 'right' }}>{fd.flows}</span>
                <Badge variant={fd.efficiency >= 80 ? 'accent' : fd.efficiency >= 60 ? 'brand' : 'yellow'} size="sm">
                  {fd.efficiency}%
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Critical Risk Table */}
        <div className="enterprise-card" style={{ padding: 22 }}>
          <div className="section-header">
            <div>
              <p className="section-title">Fluxos em Risco Crítico</p>
              <p className="section-subtitle">Ação imediata requerida</p>
            </div>
            <Badge variant="red" size="md" dot>{kpiSummary.atRisk} itens</Badge>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {critRisk.map(flow => (
              <div key={flow.id} style={{
                display: 'flex', alignItems: 'flex-start', gap: 12,
                padding: '10px 12px', background: '#FFF8F7',
                border: '1px solid #FECACA', borderRadius: 10,
                borderLeft: `3px solid ${flow.riskLevel === 'Crítico' ? '#dc2626' : '#d97706'}`,
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: 12.5, fontWeight: 600, color: '#102A43', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {flow.name}
                  </p>
                  <p style={{ margin: '2px 0 0', fontSize: 11, color: '#667085' }}>
                    {flow.front} · {flow.analyst}
                  </p>
                  <div style={{ marginTop: 6 }}>
                    <ProgressBar value={flow.progress} max={100} color={flow.riskLevel === 'Crítico' ? '#dc2626' : '#d97706'} height={4} />
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                  <RiskBadge risk={flow.riskLevel} />
                  <span style={{ fontSize: 11, color: '#667085' }}>{flow.slaConsumed}% SLA</span>
                </div>
              </div>
            ))}
            {critRisk.length === 0 && (
              <div style={{ textAlign: 'center', padding: 24, color: '#667085', fontSize: 13 }}>
                <CheckCircle size={28} color="#16a34a" style={{ marginBottom: 8 }} />
                <p>Nenhum fluxo em risco crítico</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Analyst Workload */}
      <div className="animate-fade-in-up stagger-6" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div className="enterprise-card" style={{ padding: 22 }}>
          <div className="section-header">
            <div>
              <p className="section-title">Workload por Analista</p>
              <p className="section-subtitle">Ocupação e disponibilidade operacional</p>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {analysts.slice(0, 6).map(analyst => {
              const pct = Math.min(120, Math.round((analyst.allocated / analyst.capacity) * 100));
              const over = pct > 100;
              return (
                <div key={analyst.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                    background: over ? '#fee2e2' : '#D9EAF4',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, fontWeight: 700, color: over ? '#dc2626' : '#003B5C',
                  }}>
                    {analyst.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 12.5, fontWeight: 500, color: '#102A43' }}>{analyst.name}</span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: over ? '#dc2626' : '#16a34a' }}>{pct}%</span>
                    </div>
                    <ProgressBar value={pct} max={120} color={over ? '#dc2626' : pct > 85 ? '#d97706' : '#005A7A'} height={5} />
                  </div>
                  <Badge variant={analyst.burnoutRisk === 'Alto' ? 'red' : analyst.burnoutRisk === 'Médio' ? 'yellow' : 'green'}>
                    {analyst.burnoutRisk}
                  </Badge>
                </div>
              );
            })}
          </div>
        </div>

        {/* Transformation potential */}
        <div className="enterprise-card" style={{ padding: 22, background: 'linear-gradient(135deg, #F5F7FA, #FFFFFF)' }}>
          <div className="section-header">
            <div>
              <p className="section-title">Potencial de Transformação</p>
              <p className="section-subtitle">Ganhos identificados com automação</p>
            </div>
            <Badge variant="accent" size="md">
              <Zap size={10} />
              {kpiSummary.automatableFlows} automatizáveis
            </Badge>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
            {[
              { label: 'Horas recuperadas', value: fmtHours(kpiSummary.estimatedGainHours), color: '#005A7A' },
              { label: 'FTEs equivalentes', value: `${kpiSummary.estimatedFTE} FTE`, color: '#7A9A01' },
              { label: 'Redução de retrabalho', value: `${kpiSummary.avgRework}%`, color: '#d97706' },
              { label: 'Economia anual', value: fmtCurrency(kpiSummary.estimatedAnnualSavings), color: '#16a34a' },
            ].map(m => (
              <div key={m.label} style={{ padding: '12px 14px', background: '#FFFFFF', borderRadius: 10, border: '1px solid #EDF1F5' }}>
                <p style={{ margin: 0, fontSize: 11, color: '#667085', fontWeight: 500 }}>{m.label}</p>
                <p style={{ margin: '4px 0 0', fontSize: 18, fontWeight: 700, color: m.color, letterSpacing: '-0.02em' }}>{m.value}</p>
              </div>
            ))}
          </div>
          <div style={{
            padding: '12px 14px', background: 'linear-gradient(135deg, #D9EAF4, #EDF1F5)', borderRadius: 10,
            border: '1px solid rgba(0,90,122,0.15)',
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <Info size={14} color="#005A7A" style={{ flexShrink: 0, marginTop: 1 }} />
              <p style={{ margin: 0, fontSize: 12, color: '#003B5C', lineHeight: 1.5, fontStyle: 'italic' }}>
                "A operação apresenta elevada dependência manual em validações críticas,
                impactando diretamente a capacidade operacional, escalabilidade e SLA da frente."
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recently Published */}
      {recentPublished.length > 0 && (
        <div className="animate-fade-in-up stagger-7 enterprise-card" style={{ padding: 22 }}>
          <div className="section-header">
            <div>
              <p className="section-title">Publicados Recentemente</p>
              <p className="section-subtitle">Fluxos concluídos e disponíveis</p>
            </div>
            <button className="btn-ghost" style={{ fontFamily: 'inherit' }}>
              Ver todos <ArrowRight size={13} />
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
            {recentPublished.map(flow => (
              <div key={flow.id} style={{
                padding: '14px 16px', border: '1px solid #EDF1F5', borderRadius: 10,
                background: '#F9FBFD', borderLeft: '3px solid #16a34a',
                transition: 'all 0.2s ease', cursor: 'pointer',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = '#FFFFFF'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.06)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#F9FBFD'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <span style={{ fontSize: 11, fontFamily: 'monospace', color: '#B0BFCC', fontWeight: 600 }}>{flow.id}</span>
                  <StatusBadge status={flow.status} />
                </div>
                <p style={{ margin: '0 0 6px', fontSize: 13.5, fontWeight: 600, color: '#102A43', lineHeight: 1.3 }}>{flow.name}</p>
                <p style={{ margin: 0, fontSize: 12, color: '#667085' }}>{flow.front} · {flow.analyst}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
