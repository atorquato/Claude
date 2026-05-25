import React, { useState } from 'react';
import { Filter, X, ChevronDown, RotateCcw, Search } from 'lucide-react';
import { useStore } from '../store/useStore';
import { FRONTS, AREAS, ANALYSTS } from '../data/mockData';

const STATUSES = [
  'Não iniciado', 'Em levantamento', 'Em mapeamento',
  'Em validação operacional', 'Em validação gestão',
  'Ajustes solicitados', 'Aprovado', 'Publicado'
];

export function GlobalFilterBar() {
  const { filters, setFilters, resetFilters } = useStore();
  const [expanded, setExpanded] = useState(false);

  const activeCount = Object.values(filters).filter(Boolean).length;

  return (
    <div style={{
      background: '#FFFFFF',
      borderBottom: '1px solid #D9E1E7',
      padding: '0 24px',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12, minHeight: 52,
      }}>
        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '7px 14px', borderRadius: 8, border: '1.5px solid',
            borderColor: activeCount > 0 ? '#005A7A' : '#D9E1E7',
            background: activeCount > 0 ? '#D9EAF4' : '#FFFFFF',
            color: activeCount > 0 ? '#003B5C' : '#667085',
            fontWeight: 600, fontSize: 13, cursor: 'pointer',
            transition: 'all 0.2s ease', fontFamily: 'inherit',
          }}
        >
          <Filter size={14} />
          Filtros Globais
          {activeCount > 0 && (
            <span style={{
              background: '#003B5C', color: '#FFFFFF',
              borderRadius: 99, padding: '1px 7px', fontSize: 11, fontWeight: 700,
            }}>
              {activeCount}
            </span>
          )}
          <ChevronDown size={13} style={{ transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
        </button>

        {/* Quick filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, flexWrap: 'nowrap', overflow: 'hidden' }}>
          <FilterSelect
            value={filters.front} onChange={v => setFilters({ front: v })}
            placeholder="Frente" options={FRONTS}
          />
          <FilterSelect
            value={filters.status} onChange={v => setFilters({ status: v })}
            placeholder="Status" options={STATUSES}
          />
          <FilterSelect
            value={filters.criticality} onChange={v => setFilters({ criticality: v })}
            placeholder="Criticidade" options={['Alta', 'Média', 'Baixa']}
          />
          <FilterSelect
            value={filters.analyst} onChange={v => setFilters({ analyst: v })}
            placeholder="Analista" options={ANALYSTS}
          />
        </div>

        {activeCount > 0 && (
          <button onClick={resetFilters} className="btn-ghost" style={{ fontFamily: 'inherit' }}>
            <RotateCcw size={13} />
            Limpar
          </button>
        )}

        <div style={{
          marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6,
          padding: '6px 12px', background: '#F5F7FA', borderRadius: 8, border: '1px solid #EDF1F5',
        }}>
          <Search size={13} color="#667085" />
          <input
            placeholder="Buscar fluxo, área, processo..."
            style={{
              border: 'none', outline: 'none', background: 'transparent',
              fontSize: 13, color: '#102A43', width: 220, fontFamily: 'inherit',
            }}
          />
        </div>
      </div>

      {/* Expanded filters */}
      {expanded && (
        <div style={{
          paddingBottom: 14,
          display: 'flex', flexWrap: 'wrap', gap: 8,
          borderTop: '1px solid #EDF1F5', paddingTop: 14,
          animation: 'fadeInUp 0.25s ease',
        }}>
          <FilterSelect value={filters.area} onChange={v => setFilters({ area: v })} placeholder="Área" options={AREAS} />
          <FilterSelect value={filters.riskLevel} onChange={v => setFilters({ riskLevel: v })} placeholder="Risco" options={['Baixo', 'Médio', 'Alto', 'Crítico']} />
          <FilterSelect value={filters.maturity} onChange={v => setFilters({ maturity: v })} placeholder="Maturidade" options={['1', '2', '3', '4', '5']} />
          <FilterSelect value={filters.period} onChange={v => setFilters({ period: v })} placeholder="Período" options={['Jan 2025', 'Fev 2025', 'Mar 2025', 'Abr 2025', 'Mai 2025', 'Jun 2025', 'Q1 2025', 'Q2 2025', '2025']} />
        </div>
      )}
    </div>
  );
}

function FilterSelect({ value, onChange, placeholder, options }: {
  value: string; onChange: (v: string) => void;
  placeholder: string; options: string[];
}) {
  return (
    <div style={{ position: 'relative' }}>
      <select
        className="select-enterprise"
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          background: value ? '#D9EAF4' : '#F5F7FA',
          borderColor: value ? '#005A7A' : '#D9E1E7',
          color: value ? '#003B5C' : '#667085',
          fontWeight: value ? 600 : 400,
          maxWidth: 180,
        }}
      >
        <option value="">{placeholder}</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}
