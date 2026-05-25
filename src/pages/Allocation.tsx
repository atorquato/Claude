import React, { useMemo } from 'react';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { useStore, useFilteredFlows } from '../store/useStore';
import { Badge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';
import { fmt, fmtHours } from '../utils/format';
import { FRONTS } from '../data/mockData';

const COLORS = ['#003B5C','#005A7A','#0077A3','#7A9A01','#96B80A','#B4D418','#d97706','#dc2626','#7c3aed','#2563eb'];

export function Allocation() {
  const flows = useFilteredFlows();
  const analysts = useStore(s => s.analysts);

  const byFront = useMemo(() => {
    return FRONTS.slice(0, 8).map((front, i) => {
      const frontFlows = flows.filter(f => f.front === front);
      const hrs = frontFlows.reduce((s, f) => s + f.plannedHours, 0);
      return { name: front.length > 14 ? front.slice(0, 14) + '…' : front, hours: hrs, flows: frontFlows.length, color: COLORS[i % COLORS.length] };
    }).filter(f => f.hours > 0);
  }, [flows]);

  const byAnalyst = useMemo(() => analysts.map(a => ({
    name: a.name.split(' ')[0],
    allocated: a.allocated,
    capacity: a.capacity,
    efficiency: a.efficiency,
    flows: a.flows,
    pct: Math.round((a.allocated / a.capacity) * 100),
  })), [analysts]);

  const totalAllocated = analysts.reduce((s, a) => s + a.allocated, 0);
  const totalCapacity = analysts.reduce((s, a) => s + a.capacity, 0);
  const overallPct = Math.round((totalAllocated / totalCapacity) * 100);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Overview cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {[
          { label: 'Total Alocado', value: fmtHours(totalAllocated), sub: `${overallPct}% da capacidade`, color: '#003B5C' },
          { label: 'Capacidade Disponível', value: fmtHours(totalCapacity - totalAllocated), sub: 'horas livres', color: '#16a34a' },
          { label: 'Utilização Geral', value: `${overallPct}%`, sub: `de ${fmtHours(totalCapacity)} totais`, color: overallPct > 90 ? '#dc2626' : overallPct > 75 ? '#d97706' : '#005A7A' },
          { label: 'Eficiência Média', value: `${Math.round(analysts.reduce((s, a) => s + a.efficiency, 0) / analysts.length)}%`, sub: 'produtividade operacional', color: '#7A9A01' },
        ].map(k => (
          <div key={k.label} className="enterprise-card" style={{ padding: 18 }}>
            <p style={{ margin: 0, fontSize: 11, fontWeight: 600, color: '#667085', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{k.label}</p>
            <p style={{ margin: '6px 0 0', fontSize: 26, fontWeight: 800, color: k.color, letterSpacing: '-0.03em', lineHeight: 1 }}>{k.value}</p>
            <p style={{ margin: '4px 0 0', fontSize: 12, color: '#667085' }}>{k.sub}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* By front */}
        <div className="enterprise-card" style={{ padding: 22 }}>
          <div className="section-header">
            <div>
              <p className="section-title">Distribuição por Frente</p>
              <p className="section-subtitle">Horas alocadas por área operacional</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            <div style={{ flex: 1 }}>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={byFront} cx="50%" cy="50%" innerRadius={60} outerRadius={95} paddingAngle={2} dataKey="hours">
                    {byFront.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#102A43', border: 'none', borderRadius: 10, color: '#FFFFFF', fontSize: 12, fontFamily: 'Inter' }} formatter={(v) => [`${v}h`, 'Horas']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, justifyContent: 'center', minWidth: 160 }}>
              {byFront.map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, background: f.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: '#102A43', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#667085' }}>{f.hours}h</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* By analyst bar */}
        <div className="enterprise-card" style={{ padding: 22 }}>
          <div className="section-header">
            <div>
              <p className="section-title">Eficiência por Analista</p>
              <p className="section-subtitle">Comparativo de produtividade</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={byAnalyst} barSize={14}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EDF1F5" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#667085', fontFamily: 'Inter' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#B0BFCC', fontFamily: 'Inter' }} axisLine={false} tickLine={false} domain={[0, 100]} width={30} />
              <Tooltip contentStyle={{ background: '#102A43', border: 'none', borderRadius: 10, color: '#FFFFFF', fontSize: 12, fontFamily: 'Inter' }} />
              <Bar dataKey="efficiency" radius={[5, 5, 0, 0]} name="Eficiência (%)">
                {byAnalyst.map((a, i) => (
                  <Cell key={i} fill={a.efficiency >= 85 ? '#7A9A01' : a.efficiency >= 70 ? '#005A7A' : a.efficiency >= 55 ? '#d97706' : '#dc2626'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Allocation detail table */}
      <div className="enterprise-card" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #EDF1F5' }}>
          <p className="section-title">Detalhe de Alocação Individual</p>
          <p className="section-subtitle">Visão completa por analista</p>
        </div>
        <table className="enterprise-table">
          <thead>
            <tr>
              <th>Analista</th><th>Frente</th><th>Fluxos</th>
              <th>Alocado</th><th>Capacidade</th><th>Utilização</th>
              <th>Eficiência</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            {analysts.map(a => {
              const pct = Math.round((a.allocated / a.capacity) * 100);
              const status = pct > 100 ? 'Sobrecarregado' : pct > 85 ? 'Em risco' : pct < 50 ? 'Ocioso' : 'Balanceado';
              const variant = pct > 100 ? 'red' as const : pct > 85 ? 'yellow' as const : pct < 50 ? 'gray' as const : 'green' as const;
              return (
                <tr key={a.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 28, height: 28, borderRadius: 8, background: '#D9EAF4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#003B5C' }}>
                        {a.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#102A43' }}>{a.name}</p>
                        <p style={{ margin: 0, fontSize: 11, color: '#667085' }}>{a.role}</p>
                      </div>
                    </div>
                  </td>
                  <td><span style={{ fontSize: 12 }}>{a.front}</span></td>
                  <td><span style={{ fontSize: 13, fontWeight: 600, color: '#102A43' }}>{a.flows}</span></td>
                  <td><span style={{ fontSize: 12.5, fontWeight: 500 }}>{a.allocated}h</span></td>
                  <td><span style={{ fontSize: 12.5, color: '#667085' }}>{a.capacity}h</span></td>
                  <td style={{ width: 140 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <ProgressBar value={pct} max={120} color={pct > 100 ? '#dc2626' : pct > 85 ? '#d97706' : '#005A7A'} height={5} />
                      <span style={{ fontSize: 12, fontWeight: 700, color: pct > 100 ? '#dc2626' : '#102A43', minWidth: 36 }}>{pct}%</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <ProgressBar value={a.efficiency} max={100} color="#7A9A01" height={4} />
                      <span style={{ fontSize: 12, fontWeight: 600, color: '#7A9A01', minWidth: 36 }}>{a.efficiency}%</span>
                    </div>
                  </td>
                  <td><Badge variant={variant}>{status}</Badge></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
