import React, { useState, useMemo } from 'react';
import { AlertCircle, Clock, User, Layers, MoreHorizontal } from 'lucide-react';
import { useStore, useFilteredFlows } from '../store/useStore';
import { StatusBadge, CriticalityBadge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';
import { healthColor, statusColor } from '../utils/format';
import type { Flow, FlowStatus } from '../data/mockData';

const COLUMNS: { id: FlowStatus; label: string; color: string }[] = [
  { id: 'Não iniciado', label: 'Backlog', color: '#6b7280' },
  { id: 'Em levantamento', label: 'Levantamento', color: '#f59e0b' },
  { id: 'Em mapeamento', label: 'Mapeamento', color: '#d97706' },
  { id: 'Em validação operacional', label: 'Val. Operacional', color: '#0099CC' },
  { id: 'Em validação gestão', label: 'Val. Gestão', color: '#7c3aed' },
  { id: 'Ajustes solicitados', label: 'Ajustes', color: '#dc2626' },
  { id: 'Aprovado', label: 'Aprovado', color: '#2563eb' },
  { id: 'Publicado', label: 'Publicado', color: '#16a34a' },
];

export function KanbanBoard() {
  const flows = useFilteredFlows();
  const updateFlowStatus = useStore(s => s.updateFlowStatus);
  const [dragging, setDragging] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<FlowStatus | null>(null);

  const columns = useMemo(() =>
    COLUMNS.map(col => ({
      ...col,
      flows: flows.filter(f => f.status === col.id),
    })),
    [flows]
  );

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDragging(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDrop = (e: React.DragEvent, status: FlowStatus) => {
    e.preventDefault();
    if (dragging) { updateFlowStatus(dragging, status); }
    setDragging(null);
    setDragOver(null);
  };

  return (
    <div style={{ display: 'flex', gap: 14, overflowX: 'auto', height: 'calc(100vh - 220px)', paddingBottom: 8 }}>
      {columns.map(col => (
        <div
          key={col.id}
          style={{ minWidth: 230, display: 'flex', flexDirection: 'column', gap: 10 }}
          onDragOver={e => { e.preventDefault(); setDragOver(col.id); }}
          onDragLeave={() => setDragOver(null)}
          onDrop={e => handleDrop(e, col.id)}
        >
          {/* Column header */}
          <div style={{
            padding: '10px 14px', background: '#FFFFFF',
            border: '1px solid #D9E1E7', borderRadius: 10,
            borderTop: `3px solid ${col.color}`,
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: col.color }} />
                <span style={{ fontSize: 12.5, fontWeight: 700, color: '#102A43' }}>{col.label}</span>
              </div>
              <span style={{
                background: col.color + '20', color: col.color,
                borderRadius: 99, padding: '1px 8px', fontSize: 12, fontWeight: 700,
              }}>
                {col.flows.length}
              </span>
            </div>
          </div>

          {/* Drop zone */}
          <div style={{
            flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8,
            padding: '2px 0',
            background: dragOver === col.id ? `${col.color}08` : 'transparent',
            borderRadius: 10,
            transition: 'background 0.2s ease',
            border: dragOver === col.id ? `2px dashed ${col.color}40` : '2px dashed transparent',
          }}>
            {col.flows.map(flow => (
              <KanbanCard
                key={flow.id}
                flow={flow}
                onDragStart={e => handleDragStart(e, flow.id)}
                isDragging={dragging === flow.id}
              />
            ))}
            {col.flows.length === 0 && (
              <div style={{
                padding: 20, textAlign: 'center', color: '#D9E1E7',
                fontSize: 12, fontStyle: 'italic',
              }}>
                Sem fluxos
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function KanbanCard({ flow, onDragStart, isDragging }: {
  flow: Flow; onDragStart: (e: React.DragEvent) => void; isDragging: boolean;
}) {
  const overSla = flow.slaConsumed > 100;
  const hasImpediment = flow.impediments.length > 0;

  return (
    <div
      draggable
      onDragStart={onDragStart}
      style={{
        background: '#FFFFFF', border: '1px solid #D9E1E7',
        borderRadius: 10, padding: '12px 14px',
        cursor: 'grab', opacity: isDragging ? 0.5 : 1,
        boxShadow: isDragging ? '0 8px 24px rgba(0,0,0,0.15)' : '0 1px 3px rgba(0,0,0,0.05)',
        transition: 'all 0.2s ease',
        transform: isDragging ? 'rotate(2deg)' : 'none',
        borderLeft: hasImpediment ? '3px solid #dc2626' : overSla ? '3px solid #d97706' : '1px solid #D9E1E7',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <span style={{ fontSize: 10.5, fontFamily: 'monospace', color: '#B0BFCC', fontWeight: 600 }}>{flow.id}</span>
        <CriticalityBadge criticality={flow.criticality} />
      </div>

      <p style={{ margin: '0 0 8px', fontSize: 13, fontWeight: 600, color: '#102A43', lineHeight: 1.35 }}>
        {flow.name.length > 45 ? flow.name.slice(0, 45) + '…' : flow.name}
      </p>

      {hasImpediment && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 8px', background: '#FFF8F7', borderRadius: 6, marginBottom: 8 }}>
          <AlertCircle size={11} color="#dc2626" />
          <span style={{ fontSize: 11, color: '#dc2626' }}>{flow.impediments[0].slice(0, 40)}</span>
        </div>
      )}

      <div style={{ marginBottom: 8 }}>
        <ProgressBar value={flow.progress} max={100} autoColor height={4} />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#667085' }}>
          <User size={11} />
          {flow.analyst.split(' ')[0]}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: overSla ? '#dc2626' : '#667085' }}>
          <Clock size={11} />
          SLA {flow.slaConsumed}%
        </div>
        <div style={{
          width: 22, height: 22, borderRadius: 6, flexShrink: 0,
          background: healthColor(flow.healthScore) + '20',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 10, fontWeight: 700, color: healthColor(flow.healthScore),
        }}>
          {flow.healthScore}
        </div>
      </div>

      {flow.front && (
        <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
          <Layers size={10} color="#B0BFCC" />
          <span style={{ fontSize: 11, color: '#B0BFCC' }}>{flow.front}</span>
        </div>
      )}
    </div>
  );
}
