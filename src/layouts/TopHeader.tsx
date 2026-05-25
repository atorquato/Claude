import React from 'react';
import { Bell, Download, RefreshCw, Calendar, ChevronDown } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  '/': { title: 'Dashboard Executivo', subtitle: 'Central de Transformação Operacional' },
  '/tracking': { title: 'Acompanhamento Operacional', subtitle: 'Evolução e status dos fluxos mapeados' },
  '/kanban': { title: 'Pipeline Operacional', subtitle: 'Gestão visual de fluxos por etapa' },
  '/gantt': { title: 'Gantt Executivo', subtitle: 'Cronograma e dependências operacionais' },
  '/gaps': { title: 'GAPs & Ishikawa', subtitle: 'Diagnóstico operacional e análise de causa raiz' },
  '/capacity': { title: 'Capacidade Operacional', subtitle: 'Gestão de carga e disponibilidade analítica' },
  '/allocation': { title: 'Alocação de Recursos', subtitle: 'Distribuição e balanceamento operacional' },
  '/transformation': { title: 'Impacto de Transformação', subtitle: 'Simulação de ganhos operacionais e eficiência' },
  '/reports': { title: 'Executive Report Center', subtitle: 'Geração de reports e storytelling executivo' },
  '/storytelling': { title: 'Storytelling Engine', subtitle: 'Narrativas executivas automáticas' },
  '/roadmap': { title: 'Roadmap Estratégico', subtitle: 'Visão de transformação e evolução operacional' },
};

export function TopHeader() {
  const location = useLocation();
  const page = PAGE_TITLES[location.pathname] || { title: 'ProcessFlow', subtitle: 'Enterprise Operational Platform' };
  const now = new Date();
  const dateStr = now.toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <header style={{
      background: '#FFFFFF',
      borderBottom: '1px solid #D9E1E7',
      padding: '0 28px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      minHeight: 64, gap: 20,
      position: 'sticky', top: 0, zIndex: 40,
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <h1 style={{
          margin: 0, fontSize: 17, fontWeight: 700, color: '#102A43',
          letterSpacing: '-0.02em', lineHeight: 1.2,
        }}>
          {page.title}
        </h1>
        <p style={{ margin: 0, fontSize: 12, color: '#667085' }}>{page.subtitle}</p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginLeft: 'auto' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '6px 12px', borderRadius: 8,
          background: '#F5F7FA', border: '1px solid #EDF1F5',
          fontSize: 12, color: '#667085', fontWeight: 500,
        }}>
          <Calendar size={13} />
          {dateStr}
        </div>

        <button
          className="btn-secondary"
          style={{ fontFamily: 'inherit', padding: '7px 14px' }}
        >
          <RefreshCw size={13} />
          Atualizar
        </button>

        <button
          className="btn-primary"
          style={{ fontFamily: 'inherit', padding: '7px 16px' }}
        >
          <Download size={13} />
          Exportar
        </button>

        <div style={{ position: 'relative' }}>
          <button style={{
            width: 38, height: 38, borderRadius: 10,
            border: '1.5px solid #D9E1E7', background: '#FFFFFF',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', position: 'relative',
          }}>
            <Bell size={16} color="#667085" />
            <span style={{
              position: 'absolute', top: 6, right: 6,
              width: 8, height: 8, borderRadius: '50%',
              background: '#dc2626', border: '2px solid white',
            }} />
          </button>
        </div>

        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '6px 12px', borderRadius: 10,
          background: '#F5F7FA', border: '1px solid #EDF1F5',
          cursor: 'pointer',
        }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            background: 'linear-gradient(135deg, #003B5C, #005A7A)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, fontWeight: 700, color: '#FFFFFF',
          }}>AT</div>
          <div>
            <p style={{ margin: 0, fontSize: 12.5, fontWeight: 600, color: '#102A43' }}>Andre T.</p>
            <p style={{ margin: 0, fontSize: 10.5, color: '#667085' }}>Diretoria Operacional</p>
          </div>
          <ChevronDown size={13} color="#667085" />
        </div>
      </div>
    </header>
  );
}
