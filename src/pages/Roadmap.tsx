import React, { useState } from 'react';
import { Map, Target, CheckCircle, Clock, Zap, TrendingUp, Calendar, ChevronRight } from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';
import { useStore } from '../store/useStore';
import { fmt, fmtCurrency, fmtHours } from '../utils/format';

const INITIATIVES = [
  {
    id: 'i1', quarter: 'Q1 2025', label: 'Diagnóstico AS-IS Completo', category: 'Mapeamento',
    status: 'completed', progress: 100, impact: 'Alta', description: 'Levantamento e documentação de todos os processos operacionais das frentes prioritárias.',
    deliverables: ['48 fluxos mapeados', '12 frentes cobertas', 'Diagnóstico de GAPs'],
    hoursGain: 0, fteGain: 0,
  },
  {
    id: 'i2', quarter: 'Q2 2025', label: 'Automação de Processos Elegíveis', category: 'Automação',
    status: 'in_progress', progress: 45, impact: 'Alta', description: 'Implementação de RPA e integrações para processos com maior ROI identificados no diagnóstico.',
    deliverables: ['8 processos automatizados', 'Integração ERP-CRM', 'Redução 60% tempo manual'],
    hoursGain: 480, fteGain: 3.0,
  },
  {
    id: 'i3', quarter: 'Q2 2025', label: 'Governança e Controles Internos', category: 'Governança',
    status: 'in_progress', progress: 30, impact: 'Média', description: 'Estruturação de política de governança, alçadas e responsabilidades operacionais.',
    deliverables: ['Manual de governança', 'Matriz RACI', 'SLAs formalizados'],
    hoursGain: 120, fteGain: 0.75,
  },
  {
    id: 'i4', quarter: 'Q3 2025', label: 'Centro de Excelência Operacional', category: 'Transformação',
    status: 'planned', progress: 0, impact: 'Alta', description: 'Criação do COE para sustentar a transformação operacional contínua.',
    deliverables: ['Time de COE estruturado', 'Metodologia padrão', 'KPIs de excelência'],
    hoursGain: 200, fteGain: 1.25,
  },
  {
    id: 'i5', quarter: 'Q3 2025', label: 'Integração de Sistemas Legados', category: 'Tecnologia',
    status: 'planned', progress: 0, impact: 'Alta', description: 'Integração dos sistemas críticos para eliminar dupla entrada e retrabalho.',
    deliverables: ['API Gateway implementado', '5 sistemas integrados', 'Eliminação retrabalho'],
    hoursGain: 640, fteGain: 4.0,
  },
  {
    id: 'i6', quarter: 'Q4 2025', label: 'Expansão para Novas Frentes', category: 'Expansão',
    status: 'planned', progress: 0, impact: 'Média', description: 'Replicação da metodologia para frentes ainda não cobertas.',
    deliverables: ['4 novas frentes mapeadas', 'Capacitação equipes', 'Playbooks operacionais'],
    hoursGain: 320, fteGain: 2.0,
  },
  {
    id: 'i7', quarter: 'Q1 2026', label: 'Transformação Digital Completa', category: 'Transformação',
    status: 'planned', progress: 0, impact: 'Muito Alta', description: 'Digitalização end-to-end da operação com IA e analytics avançado.',
    deliverables: ['IA operacional ativa', 'Predição de gargalos', 'Autonomia operacional'],
    hoursGain: 1200, fteGain: 7.5,
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  Mapeamento: '#003B5C', Automação: '#005A7A', Governança: '#d97706',
  Transformação: '#7A9A01', Tecnologia: '#7c3aed', Expansão: '#2563eb',
};

const STATUS_CONFIG = {
  completed: { label: 'Concluído', variant: 'green' as const, bg: '#dcfce7', border: '#86efac' },
  in_progress: { label: 'Em andamento', variant: 'brand' as const, bg: '#D9EAF4', border: '#93c5fd' },
  planned: { label: 'Planejado', variant: 'gray' as const, bg: '#f3f4f6', border: '#d1d5db' },
};

export function Roadmap() {
  const { kpiSummary } = useStore(s => ({ kpiSummary: s.kpiSummary }));
  const [selectedQuarter, setSelectedQuarter] = useState<string | null>(null);

  const quarters = ['Q1 2025', 'Q2 2025', 'Q3 2025', 'Q4 2025', 'Q1 2026'];
  const filtered = selectedQuarter ? INITIATIVES.filter(i => i.quarter === selectedQuarter) : INITIATIVES;

  const totalHoursGain = INITIATIVES.reduce((s, i) => s + i.hoursGain, 0);
  const totalFTE = INITIATIVES.reduce((s, i) => s + i.fteGain, 0);
  const annualSavings = totalHoursGain * 85 * 12;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #001f35, #003B5C)',
        borderRadius: 14, padding: '24px 32px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <Map size={22} color="#7A9A01" />
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
            Roadmap de Transformação Operacional
          </h2>
        </div>
        <p style={{ margin: '0 0 20px', fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>
          Visão estratégica das iniciativas de transformação — 2025/2026
        </p>
        <div style={{ display: 'flex', gap: 32 }}>
          {[
            { label: 'Horas recuperadas (total)', value: fmtHours(totalHoursGain) },
            { label: 'FTEs equivalentes', value: `${totalFTE.toFixed(1)} FTE` },
            { label: 'Economia projetada', value: fmtCurrency(annualSavings) },
            { label: 'Iniciativas', value: `${INITIATIVES.length}` },
          ].map(m => (
            <div key={m.label}>
              <p style={{ margin: 0, fontSize: 24, fontWeight: 800, color: '#7A9A01', letterSpacing: '-0.03em' }}>{m.value}</p>
              <p style={{ margin: '2px 0 0', fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>{m.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quarter filter */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Calendar size={15} color="#667085" />
        <div className="tab-group">
          <button className={`tab-item ${!selectedQuarter ? 'active' : ''}`} onClick={() => setSelectedQuarter(null)}>Todos</button>
          {quarters.map(q => (
            <button key={q} className={`tab-item ${selectedQuarter === q ? 'active' : ''}`} onClick={() => setSelectedQuarter(q)}>{q}</button>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0, position: 'relative' }}>
        {/* Vertical line */}
        <div style={{ position: 'absolute', left: 148, top: 0, bottom: 0, width: 2, background: '#EDF1F5' }} />

        {quarters.map(quarter => {
          const qInitiatives = filtered.filter(i => i.quarter === quarter);
          if (qInitiatives.length === 0) return null;
          return (
            <div key={quarter} style={{ display: 'flex', gap: 20, marginBottom: 24 }}>
              {/* Quarter label */}
              <div style={{ width: 140, flexShrink: 0, paddingTop: 16, textAlign: 'right' }}>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 800, color: '#003B5C' }}>{quarter}</p>
                <p style={{ margin: '2px 0 0', fontSize: 11, color: '#B0BFCC' }}>
                  {qInitiatives.length} iniciativa{qInitiatives.length > 1 ? 's' : ''}
                </p>
              </div>

              {/* Timeline dot */}
              <div style={{ width: 20, flexShrink: 0, display: 'flex', justifyContent: 'center', paddingTop: 20 }}>
                <div style={{
                  width: 16, height: 16, borderRadius: '50%', zIndex: 1,
                  background: qInitiatives.some(i => i.status === 'in_progress') ? '#005A7A'
                    : qInitiatives.every(i => i.status === 'completed') ? '#16a34a' : '#D9E1E7',
                  border: '3px solid #FFFFFF', boxShadow: '0 0 0 2px currentColor',
                  color: qInitiatives.some(i => i.status === 'in_progress') ? '#005A7A'
                    : qInitiatives.every(i => i.status === 'completed') ? '#16a34a' : '#D9E1E7',
                }} />
              </div>

              {/* Initiative cards */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {qInitiatives.map(init => {
                  const catColor = CATEGORY_COLORS[init.category] || '#667085';
                  const statusConf = STATUS_CONFIG[init.status as keyof typeof STATUS_CONFIG];
                  return (
                    <div key={init.id} style={{
                      background: '#FFFFFF', border: '1px solid #D9E1E7', borderRadius: 12,
                      padding: '18px 20px', borderLeft: `4px solid ${catColor}`,
                      boxShadow: '0 1px 4px rgba(0,0,0,0.04)', transition: 'all 0.2s ease',
                    }}
                      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.08)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                      onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)'; e.currentTarget.style.transform = 'none'; }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
                        <div style={{ flex: 1, marginRight: 12 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                            <Badge variant={init.category === 'Automação' ? 'brand' : init.category === 'Governança' ? 'yellow' : init.category === 'Transformação' ? 'accent' : 'gray'}>
                              {init.category}
                            </Badge>
                            <Badge variant={statusConf.variant}>{statusConf.label}</Badge>
                            <Badge variant={init.impact === 'Muito Alta' ? 'red' : init.impact === 'Alta' ? 'yellow' : 'gray'}>
                              Impacto {init.impact}
                            </Badge>
                          </div>
                          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#102A43' }}>{init.label}</h3>
                          <p style={{ margin: '5px 0 0', fontSize: 13, color: '#667085', lineHeight: 1.5 }}>{init.description}</p>
                        </div>
                        {init.hoursGain > 0 && (
                          <div style={{ textAlign: 'right', flexShrink: 0 }}>
                            <p style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#7A9A01', letterSpacing: '-0.02em' }}>{fmtHours(init.hoursGain)}</p>
                            <p style={{ margin: '2px 0 0', fontSize: 11, color: '#B0BFCC' }}>{init.fteGain} FTE equiv.</p>
                          </div>
                        )}
                      </div>

                      {init.status !== 'planned' && (
                        <div style={{ marginBottom: 10 }}>
                          <ProgressBar value={init.progress} max={100} autoColor height={5} showLabel />
                        </div>
                      )}

                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {init.deliverables.map((d, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px', background: '#F5F7FA', border: '1px solid #EDF1F5', borderRadius: 99 }}>
                            {init.status === 'completed' ? <CheckCircle size={10} color="#16a34a" /> : <ChevronRight size={10} color="#B0BFCC" />}
                            <span style={{ fontSize: 11.5, color: '#667085' }}>{d}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
