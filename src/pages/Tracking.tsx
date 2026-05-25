import React, { useMemo, useState } from 'react';
import { Filter, Search, ArrowUpDown, ChevronDown, ChevronUp, Eye, AlertCircle } from 'lucide-react';
import { useStore } from '../store/useStore';
import { StatusBadge, CriticalityBadge, RiskBadge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';
import { fmt, healthColor, statusColor } from '../utils/format';

const COLUMNS = [
  { key: 'id', label: 'ID', width: 70 },
  { key: 'name', label: 'Fluxo / Processo', width: 220 },
  { key: 'front', label: 'Frente', width: 110 },
  { key: 'analyst', label: 'Analista', width: 120 },
  { key: 'status', label: 'Status', width: 180 },
  { key: 'progress', label: 'Progresso', width: 140 },
  { key: 'slaConsumed', label: 'SLA', width: 80 },
  { key: 'healthScore', label: 'Health', width: 80 },
  { key: 'criticality', label: 'Criticidade', width: 90 },
  { key: 'riskLevel', label: 'Risco', width: 80 },
  { key: 'aging', label: 'Aging', width: 70 },
  { key: 'plannedHours', label: 'Prev.', width: 65 },
  { key: 'realizedHours', label: 'Real.', width: 65 },
];

export function Tracking() {
  const flows = useStore(s => s.filteredFlows());
  const [sort, setSort] = useState<{ key: string; dir: 'asc' | 'desc' }>({ key: 'healthScore', dir: 'asc' });
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);

  const sorted = useMemo(() => {
    let list = flows.filter(f =>
      !search || f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.front.toLowerCase().includes(search.toLowerCase()) ||
      f.analyst.toLowerCase().includes(search.toLowerCase())
    );
    list = [...list].sort((a, b) => {
      const av = (a as any)[sort.key];
      const bv = (b as any)[sort.key];
      const cmp = typeof av === 'number' ? av - bv : String(av).localeCompare(String(bv));
      return sort.dir === 'asc' ? cmp : -cmp;
    });
    return list;
  }, [flows, sort, search]);

  const handleSort = (key: string) => {
    setSort(s => s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' });
  };

  const statusGroups = useMemo(() => {
    const groups: Record<string, number> = {};
    sorted.forEach(f => { groups[f.status] = (groups[f.status] || 0) + 1; });
    return groups;
  }, [sorted]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Summary strip */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {Object.entries(statusGroups).map(([status, count]) => (
          <div key={status} style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 14px', background: '#FFFFFF',
            border: '1px solid #D9E1E7', borderRadius: 10,
            borderLeft: `3px solid ${statusColor(status)}`,
          }}>
            <span style={{ fontSize: 18, fontWeight: 700, color: '#102A43' }}>{count}</span>
            <span style={{ fontSize: 12, color: '#667085' }}>{status}</span>
          </div>
        ))}
      </div>

      {/* Table card */}
      <div className="enterprise-card" style={{ overflow: 'hidden' }}>
        {/* Toolbar */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '16px 20px', borderBottom: '1px solid #EDF1F5',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8, flex: 1,
            background: '#F5F7FA', border: '1px solid #EDF1F5',
            borderRadius: 8, padding: '7px 12px',
          }}>
            <Search size={14} color="#667085" />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Buscar fluxo, frente, analista..."
              style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: 13, color: '#102A43', flex: 1, fontFamily: 'inherit' }}
            />
          </div>
          <span style={{ fontSize: 13, color: '#667085', fontWeight: 500 }}>
            {sorted.length} de {flows.length} fluxos
          </span>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table className="enterprise-table">
            <thead>
              <tr>
                {COLUMNS.map(col => (
                  <th key={col.key} style={{ width: col.width, cursor: 'pointer' }} onClick={() => handleSort(col.key)}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      {col.label}
                      {sort.key === col.key
                        ? sort.dir === 'asc' ? <ChevronUp size={11} /> : <ChevronDown size={11} />
                        : <ArrowUpDown size={10} color="#B0BFCC" />
                      }
                    </div>
                  </th>
                ))}
                <th style={{ width: 60 }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map(flow => (
                <React.Fragment key={flow.id}>
                  <tr style={{ cursor: 'pointer' }} onClick={() => setExpanded(expanded === flow.id ? null : flow.id)}>
                    <td><span style={{ fontFamily: 'monospace', fontSize: 12, color: '#B0BFCC', fontWeight: 600 }}>{flow.id}</span></td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <span style={{ fontWeight: 600, fontSize: 13, color: '#102A43', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 210 }}>
                          {flow.name}
                        </span>
                        {flow.impediments.length > 0 && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#dc2626' }}>
                            <AlertCircle size={10} /> {flow.impediments[0]}
                          </span>
                        )}
                      </div>
                    </td>
                    <td><span style={{ fontSize: 12.5 }}>{flow.front}</span></td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{ width: 22, height: 22, borderRadius: 6, background: '#D9EAF4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#003B5C' }}>
                          {flow.analyst.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <span style={{ fontSize: 12, whiteSpace: 'nowrap' }}>{flow.analyst.split(' ')[0]}</span>
                      </div>
                    </td>
                    <td><StatusBadge status={flow.status} /></td>
                    <td style={{ width: 140 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ flex: 1 }}><ProgressBar value={flow.progress} max={100} autoColor height={5} /></div>
                        <span style={{ fontSize: 12, fontWeight: 600, color: healthColor(flow.progress), minWidth: 32, textAlign: 'right' }}>{flow.progress}%</span>
                      </div>
                    </td>
                    <td>
                      <span style={{
                        fontSize: 12, fontWeight: 700,
                        color: flow.slaConsumed > 100 ? '#dc2626' : flow.slaConsumed > 80 ? '#d97706' : '#16a34a',
                      }}>
                        {flow.slaConsumed}%
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <div style={{
                          width: 8, height: 8, borderRadius: '50%',
                          background: healthColor(flow.healthScore),
                        }} />
                        <span style={{ fontSize: 12, fontWeight: 700, color: healthColor(flow.healthScore) }}>
                          {flow.healthScore}
                        </span>
                      </div>
                    </td>
                    <td><CriticalityBadge criticality={flow.criticality} /></td>
                    <td><RiskBadge risk={flow.riskLevel} /></td>
                    <td><span style={{ fontSize: 12, color: flow.aging > 60 ? '#dc2626' : '#667085' }}>{flow.aging}d</span></td>
                    <td><span style={{ fontSize: 12, color: '#667085' }}>{flow.plannedHours}h</span></td>
                    <td><span style={{ fontSize: 12, color: '#102A43', fontWeight: 500 }}>{flow.realizedHours}h</span></td>
                    <td>
                      <button className="btn-ghost" style={{ padding: '4px 8px', fontFamily: 'inherit' }} onClick={e => { e.stopPropagation(); }}>
                        <Eye size={14} />
                      </button>
                    </td>
                  </tr>
                  {expanded === flow.id && (
                    <tr>
                      <td colSpan={15} style={{ background: '#F9FBFD', padding: '16px 20px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
                          <div>
                            <p style={{ margin: '0 0 6px', fontSize: 11, fontWeight: 600, color: '#667085', textTransform: 'uppercase', letterSpacing: '0.06em' }}>DETALHES</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                              <DetailRow label="Área" value={flow.area} />
                              <DetailRow label="Processo" value={flow.process} />
                              <DetailRow label="Gestor" value={flow.manager} />
                              <DetailRow label="Início" value={flow.startDate} />
                              <DetailRow label="Previsto" value={flow.expectedDate} />
                            </div>
                          </div>
                          <div>
                            <p style={{ margin: '0 0 6px', fontSize: 11, fontWeight: 600, color: '#667085', textTransform: 'uppercase', letterSpacing: '0.06em' }}>MÉTRICAS</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                              <DetailRow label="Horas planejadas" value={`${flow.plannedHours}h`} />
                              <DetailRow label="Horas realizadas" value={`${flow.realizedHours}h`} />
                              <DetailRow label="Horas manuais" value={`${flow.manualHours}h`} />
                              <DetailRow label="Retrabalho" value={`${flow.rework}%`} />
                              <DetailRow label="Maturidade" value={`Nível ${flow.maturity}/5`} />
                            </div>
                          </div>
                          <div>
                            <p style={{ margin: '0 0 6px', fontSize: 11, fontWeight: 600, color: '#667085', textTransform: 'uppercase', letterSpacing: '0.06em' }}>GAPs ({flow.gaps.length})</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                              {flow.gaps.slice(0, 4).map(g => (
                                <div key={g.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                                  <div style={{ width: 4, height: 4, borderRadius: '50%', background: g.impact === 'Alto' ? '#dc2626' : g.impact === 'Médio' ? '#d97706' : '#16a34a', marginTop: 5, flexShrink: 0 }} />
                                  <span style={{ fontSize: 11.5, color: '#102A43', lineHeight: 1.4 }}>{g.description.slice(0, 55)}...</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div>
                            <p style={{ margin: '0 0 6px', fontSize: 11, fontWeight: 600, color: '#667085', textTransform: 'uppercase', letterSpacing: '0.06em' }}>IMPEDIMENTOS</p>
                            {flow.impediments.length > 0 ? flow.impediments.map((imp, i) => (
                              <div key={i} style={{
                                display: 'flex', alignItems: 'flex-start', gap: 6,
                                padding: '8px 10px', background: '#FFF8F7',
                                border: '1px solid #FECACA', borderRadius: 8, marginBottom: 6,
                              }}>
                                <AlertCircle size={13} color="#dc2626" style={{ flexShrink: 0, marginTop: 1 }} />
                                <span style={{ fontSize: 12, color: '#dc2626' }}>{imp}</span>
                              </div>
                            )) : (
                              <span style={{ fontSize: 12, color: '#16a34a' }}>Sem impedimentos ativos</span>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <span style={{ fontSize: 12, color: '#667085', minWidth: 120 }}>{label}:</span>
      <span style={{ fontSize: 12, color: '#102A43', fontWeight: 500 }}>{value}</span>
    </div>
  );
}
