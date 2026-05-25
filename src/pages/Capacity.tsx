import React, { useMemo, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Cell, ReferenceLine, ComposedChart, Line, AreaChart, Area,
} from 'recharts';
import { AlertTriangle, TrendingUp, Users, Clock } from 'lucide-react';
import { useStore, useFilteredFlows } from '../store/useStore';
import { Badge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';
import { fmt, fmtHours } from '../utils/format';

const MONTHS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set'];

export function Capacity() {
  const analysts = useStore(s => s.analysts);
  const flows = useFilteredFlows();
  const [view, setView] = useState<'individual' | 'monthly' | 'heatmap'>('individual');

  const monthlyCapacity = MONTHS.map((m, i) => ({
    month: m,
    planned: Math.round(flows.reduce((s, f) => s + f.plannedHours, 0) / 9 * (0.8 + Math.random() * 0.4)),
    realized: Math.round(flows.reduce((s, f) => s + f.realizedHours, 0) / 9 * (0.8 + Math.random() * 0.4)),
    capacity: analysts.reduce((s, a) => s + a.capacity, 0),
  }));

  const overloaded = analysts.filter(a => a.allocated > a.capacity);
  const idle = analysts.filter(a => a.allocated < a.capacity * 0.6);
  const atRisk = analysts.filter(a => a.burnoutRisk === 'Alto');

  const heatData = analysts.map(a => ({
    name: a.name.split(' ')[0],
    ...Object.fromEntries(MONTHS.map((m, i) => [m, Math.round(a.capacity * (0.5 + Math.random() * 0.8))])),
  }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {[
          { label: 'Capacidade Total', value: fmtHours(analysts.reduce((s, a) => s + a.capacity, 0)), sub: 'mensal disponível', icon: Clock, accent: 'brand' as const },
          { label: 'Capacidade Alocada', value: fmtHours(analysts.reduce((s, a) => s + a.allocated, 0)), sub: 'mês corrente', icon: TrendingUp, accent: 'yellow' as const },
          { label: 'Analistas em Sobrecarga', value: fmt(overloaded.length), sub: `de ${analysts.length} analistas`, icon: AlertTriangle, accent: 'red' as const },
          { label: 'Em Risco Burnout', value: fmt(atRisk.length), sub: 'alta ocupação crítica', icon: Users, accent: 'red' as const },
        ].map(k => (
          <div key={k.label} className="kpi-card" style={{ padding: 20 }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: k.accent === 'brand' ? 'linear-gradient(90deg,#003B5C,#005A7A)' : k.accent === 'yellow' ? 'linear-gradient(90deg,#92400e,#d97706)' : 'linear-gradient(90deg,#991b1b,#dc2626)', borderRadius: '12px 12px 0 0' }} />
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div>
                <p style={{ margin: 0, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#667085' }}>{k.label}</p>
                <p style={{ margin: '8px 0 0', fontSize: 26, fontWeight: 700, color: '#102A43', letterSpacing: '-0.03em', lineHeight: 1 }}>{k.value}</p>
                <p style={{ margin: '4px 0 0', fontSize: 12, color: '#667085' }}>{k.sub}</p>
              </div>
              <div style={{ width: 38, height: 38, borderRadius: 9, background: '#F5F7FA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <k.icon size={18} color="#667085" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="tab-group" style={{ width: 'fit-content' }}>
        {[
          { id: 'individual', label: 'Por Analista' },
          { id: 'monthly', label: 'Evolução Mensal' },
          { id: 'heatmap', label: 'Heatmap de Ocupação' },
        ].map(t => (
          <button key={t.id} className={`tab-item ${view === t.id ? 'active' : ''}`} onClick={() => setView(t.id as any)}>
            {t.label}
          </button>
        ))}
      </div>

      {view === 'individual' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 20 }}>
          <div className="enterprise-card" style={{ padding: 22 }}>
            <div className="section-header">
              <div>
                <p className="section-title">Ocupação por Analista</p>
                <p className="section-subtitle">Capacidade vs. alocação atual</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analysts} barSize={18} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#EDF1F5" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#B0BFCC', fontFamily: 'Inter' }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11.5, fill: '#667085', fontFamily: 'Inter' }} axisLine={false} tickLine={false} width={90}
                  tickFormatter={v => v.split(' ')[0]} />
                <Tooltip contentStyle={{ background: '#102A43', border: 'none', borderRadius: 10, color: '#FFFFFF', fontSize: 12, fontFamily: 'Inter' }} formatter={(v, n) => [`${v}h`, n === 'capacity' ? 'Capacidade' : 'Alocado']} />
                <ReferenceLine x={160} stroke="#D9E1E7" strokeDasharray="4 4" label={{ value: '100%', fontSize: 10, fill: '#B0BFCC' }} />
                <Bar dataKey="capacity" fill="#EDF1F5" radius={[0, 4, 4, 0]} name="Capacidade" />
                <Bar dataKey="allocated" radius={[0, 4, 4, 0]} name="Alocado">
                  {analysts.map((a, i) => (
                    <Cell key={i} fill={a.allocated > a.capacity ? '#dc2626' : a.allocated > a.capacity * 0.85 ? '#d97706' : '#005A7A'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="enterprise-card" style={{ padding: 22 }}>
            <div className="section-header">
              <p className="section-title">Detalhamento Individual</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {analysts.map(a => {
                const pct = Math.round((a.allocated / a.capacity) * 100);
                const over = pct > 100;
                return (
                  <div key={a.id} style={{ padding: '12px 14px', border: '1px solid #EDF1F5', borderRadius: 10, background: over ? '#FFF8F7' : '#F9FBFD' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 28, height: 28, borderRadius: 8, background: over ? '#fee2e2' : '#D9EAF4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: over ? '#dc2626' : '#003B5C' }}>
                          {a.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#102A43' }}>{a.name}</p>
                          <p style={{ margin: 0, fontSize: 11, color: '#667085' }}>{a.role} · {a.flows} fluxos</p>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: 16, fontWeight: 800, color: over ? '#dc2626' : '#16a34a' }}>{pct}%</span>
                        <Badge variant={a.burnoutRisk === 'Alto' ? 'red' : a.burnoutRisk === 'Médio' ? 'yellow' : 'green'} size="sm">
                          {a.burnoutRisk}
                        </Badge>
                      </div>
                    </div>
                    <ProgressBar value={pct} max={120} color={over ? '#dc2626' : pct > 85 ? '#d97706' : '#005A7A'} height={5} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5 }}>
                      <span style={{ fontSize: 11, color: '#667085' }}>{a.allocated}h alocadas</span>
                      <span style={{ fontSize: 11, color: '#667085' }}>{a.capacity}h capacidade</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {view === 'monthly' && (
        <div className="enterprise-card" style={{ padding: 22 }}>
          <div className="section-header">
            <div>
              <p className="section-title">Evolução de Capacidade Mensal</p>
              <p className="section-subtitle">Planejado vs. realizado vs. capacidade disponível</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <ComposedChart data={monthlyCapacity}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EDF1F5" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#B0BFCC', fontFamily: 'Inter' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#B0BFCC', fontFamily: 'Inter' }} axisLine={false} tickLine={false} width={50} />
              <Tooltip contentStyle={{ background: '#102A43', border: 'none', borderRadius: 10, color: '#FFFFFF', fontSize: 12, fontFamily: 'Inter' }} />
              <Bar dataKey="planned" fill="#003B5C" opacity={0.8} radius={[4, 4, 0, 0]} name="Planejado (h)" barSize={18} />
              <Bar dataKey="realized" fill="#7A9A01" opacity={0.8} radius={[4, 4, 0, 0]} name="Realizado (h)" barSize={18} />
              <Line type="monotone" dataKey="capacity" stroke="#dc2626" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Capacidade máx." />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}

      {view === 'heatmap' && (
        <div className="enterprise-card" style={{ padding: 22 }}>
          <div className="section-header">
            <div>
              <p className="section-title">Heatmap de Ocupação Mensal</p>
              <p className="section-subtitle">Intensidade de uso por analista e período</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: '#667085' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 12, height: 12, background: '#D9EAF4', borderRadius: 3 }} /> &lt;60%
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 12, height: 12, background: '#005A7A', borderRadius: 3 }} /> 60–90%
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 12, height: 12, background: '#d97706', borderRadius: 3 }} /> 90–100%
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 12, height: 12, background: '#dc2626', borderRadius: 3 }} /> &gt;100%
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ display: 'flex', gap: 6, paddingLeft: 110 }}>
              {MONTHS.map(m => (
                <div key={m} style={{ flex: 1, textAlign: 'center', fontSize: 11, fontWeight: 600, color: '#667085', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{m}</div>
              ))}
            </div>
            {analysts.map(a => (
              <div key={a.id} style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <div style={{ width: 110, fontSize: 12, fontWeight: 500, color: '#102A43', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {a.name.split(' ')[0]}
                </div>
                {MONTHS.map(m => {
                  const hrs = Math.round(a.capacity * (0.4 + Math.random() * 0.8));
                  const pct = hrs / a.capacity;
                  const bg = pct > 1 ? '#dc2626' : pct > 0.9 ? '#d97706' : pct > 0.6 ? '#005A7A' : '#D9EAF4';
                  const textColor = pct > 0.6 ? '#FFFFFF' : '#003B5C';
                  return (
                    <div key={m} style={{ flex: 1, height: 36, background: bg, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: textColor, transition: 'transform 0.15s ease', cursor: 'default' }}
                      title={`${a.name} — ${m}: ${hrs}h (${Math.round(pct * 100)}%)`}
                    >
                      {Math.round(pct * 100)}%
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
