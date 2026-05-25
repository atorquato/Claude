import React, { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Calendar } from 'lucide-react';
import { useStore } from '../store/useStore';
import { healthColor, statusColor } from '../utils/format';
import { StatusBadge } from '../components/ui/Badge';

const DAY_WIDTH_OPTIONS = [14, 20, 28, 40];
const TODAY = new Date('2025-05-25');
const MS_PER_DAY = 86400000;

function toDate(s: string) { return new Date(s); }
function dayDiff(a: Date, b: Date) { return Math.round((b.getTime() - a.getTime()) / MS_PER_DAY); }

export function GanttView() {
  const flows = useStore(s => s.filteredFlows()).slice(0, 30);
  const [zoom, setZoom] = useState(1);
  const [offsetDays, setOffsetDays] = useState(0);

  const dayWidth = DAY_WIDTH_OPTIONS[zoom];
  const visibleDays = Math.ceil(1200 / dayWidth);
  const chartStart = new Date(TODAY.getTime() - 30 * MS_PER_DAY + offsetDays * MS_PER_DAY);

  const days = useMemo(() =>
    Array.from({ length: visibleDays }, (_, i) => {
      const d = new Date(chartStart.getTime() + i * MS_PER_DAY);
      return { date: d, label: d.getDate(), month: d.toLocaleString('pt-BR', { month: 'short' }), isToday: dayDiff(TODAY, d) === 0 };
    }),
    [chartStart, visibleDays]
  );

  const todayX = dayDiff(chartStart, TODAY) * dayWidth;

  const months = useMemo(() => {
    const m: { label: string; x: number; width: number }[] = [];
    let cur = '';
    let startX = 0;
    days.forEach((d, i) => {
      const key = `${d.date.getFullYear()}-${d.date.getMonth()}`;
      if (key !== cur) {
        if (cur) m[m.length - 1].width = i * dayWidth - m[m.length - 1].x;
        m.push({ label: `${d.month} ${d.date.getFullYear()}`, x: i * dayWidth, width: 0 });
        cur = key;
      }
    });
    if (m.length > 0) m[m.length - 1].width = days.length * dayWidth - m[m.length - 1].x;
    return m;
  }, [days, dayWidth]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }} className="enterprise-card">
      {/* Toolbar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '14px 20px', borderBottom: '1px solid #EDF1F5',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <button className="btn-secondary" style={{ fontFamily: 'inherit', padding: '6px 10px' }} onClick={() => setZoom(z => Math.max(0, z - 1))}>
            <ZoomOut size={14} />
          </button>
          <span style={{ fontSize: 12, color: '#667085', padding: '0 8px', minWidth: 70, textAlign: 'center' }}>
            {dayWidth}px/dia
          </span>
          <button className="btn-secondary" style={{ fontFamily: 'inherit', padding: '6px 10px' }} onClick={() => setZoom(z => Math.min(3, z + 1))}>
            <ZoomIn size={14} />
          </button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <button className="btn-secondary" style={{ fontFamily: 'inherit', padding: '6px 10px' }} onClick={() => setOffsetDays(d => d - 14)}>
            <ChevronLeft size={14} />
          </button>
          <button className="btn-ghost" style={{ fontFamily: 'inherit', fontSize: 12 }} onClick={() => setOffsetDays(0)}>
            <Calendar size={13} /> Hoje
          </button>
          <button className="btn-secondary" style={{ fontFamily: 'inherit', padding: '6px 10px' }} onClick={() => setOffsetDays(d => d + 14)}>
            <ChevronRight size={14} />
          </button>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 12, fontSize: 12 }}>
          {[
            { color: '#16a34a', label: 'Publicado' },
            { color: '#2563eb', label: 'Aprovado' },
            { color: '#d97706', label: 'Em andamento' },
            { color: '#dc2626', label: 'Atrasado' },
          ].map(l => (
            <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#667085' }}>
              <div style={{ width: 10, height: 10, borderRadius: 3, background: l.color }} />
              {l.label}
            </div>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div style={{ display: 'flex', overflowX: 'hidden' }}>
        {/* Left pane: flow names */}
        <div style={{ width: 280, flexShrink: 0, borderRight: '1px solid #EDF1F5', zIndex: 2 }}>
          <div style={{ height: 56, borderBottom: '1px solid #EDF1F5', background: '#F5F7FA', display: 'flex', alignItems: 'center', padding: '0 16px' }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#667085', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Fluxo / Processo</span>
          </div>
          {flows.map(flow => (
            <div key={flow.id} style={{
              height: 44, borderBottom: '1px solid #EDF1F5', display: 'flex', alignItems: 'center',
              padding: '0 16px', gap: 8, background: '#FFFFFF',
            }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: statusColor(flow.status), flexShrink: 0 }} />
              <span style={{ fontSize: 12.5, color: '#102A43', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {flow.name}
              </span>
            </div>
          ))}
        </div>

        {/* Right pane: bars */}
        <div style={{ flex: 1, overflowX: 'auto', position: 'relative' }}>
          <div style={{ minWidth: days.length * dayWidth, position: 'relative' }}>
            {/* Month header */}
            <div style={{ height: 24, background: '#F5F7FA', borderBottom: '1px solid #EDF1F5', display: 'flex', position: 'relative', overflow: 'hidden' }}>
              {months.map((m, i) => (
                <div key={i} style={{
                  position: 'absolute', left: m.x, width: m.width,
                  height: '100%', display: 'flex', alignItems: 'center', paddingLeft: 8,
                  borderRight: '1px solid #EDF1F5',
                }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: '#667085', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{m.label}</span>
                </div>
              ))}
            </div>

            {/* Day header */}
            <div style={{ height: 32, borderBottom: '1px solid #EDF1F5', display: 'flex', position: 'relative', background: '#F9FBFD' }}>
              {days.map((d, i) => (
                <div key={i} style={{
                  position: 'absolute', left: i * dayWidth, width: dayWidth, height: '100%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  borderRight: '1px solid #EDF1F5',
                  background: d.isToday ? '#D9EAF4' : [0, 6].includes(d.date.getDay()) ? '#F5F7FA' : 'transparent',
                }}>
                  {(dayWidth >= 20 || d.date.getDate() % 5 === 0) && (
                    <span style={{ fontSize: 10, color: d.isToday ? '#003B5C' : '#B0BFCC', fontWeight: d.isToday ? 800 : 400 }}>
                      {d.label}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Today line */}
            {todayX >= 0 && todayX <= days.length * dayWidth && (
              <div style={{
                position: 'absolute', left: todayX, top: 56, bottom: 0, width: 2,
                background: '#003B5C', zIndex: 10, pointerEvents: 'none',
              }}>
                <div style={{ position: 'sticky', top: 0, fontSize: 10, fontWeight: 800, color: '#FFFFFF', background: '#003B5C', padding: '2px 5px', borderRadius: '0 4px 4px 0', whiteSpace: 'nowrap' }}>
                  HOJE
                </div>
              </div>
            )}

            {/* Bars */}
            {flows.map((flow, ri) => {
              const start = dayDiff(chartStart, toDate(flow.startDate));
              const end = dayDiff(chartStart, toDate(flow.expectedDate));
              const x = start * dayWidth;
              const w = Math.max(dayWidth, (end - start) * dayWidth);
              const late = toDate(flow.expectedDate) < TODAY && flow.status !== 'Publicado';
              const barColor = flow.status === 'Publicado' ? '#16a34a'
                : flow.status === 'Aprovado' ? '#2563eb'
                : late ? '#dc2626'
                : statusColor(flow.status);

              return (
                <div key={flow.id} style={{ height: 44, borderBottom: '1px solid #EDF1F5', position: 'relative', background: ri % 2 === 0 ? '#FFFFFF' : '#FAFBFC' }}>
                  {/* Weekend shading */}
                  {days.map((d, i) => [0, 6].includes(d.date.getDay()) && (
                    <div key={i} style={{ position: 'absolute', left: i * dayWidth, width: dayWidth, top: 0, bottom: 0, background: 'rgba(0,0,0,0.015)' }} />
                  ))}

                  {/* Bar */}
                  {x < days.length * dayWidth && x + w > 0 && (
                    <div style={{
                      position: 'absolute', left: Math.max(0, x), top: 10,
                      width: Math.min(w, days.length * dayWidth - Math.max(0, x)),
                      height: 22, borderRadius: 6, background: barColor,
                      overflow: 'hidden', cursor: 'pointer',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
                      transition: 'opacity 0.2s ease',
                    }}
                      title={flow.name}
                    >
                      {/* Progress fill */}
                      <div style={{
                        position: 'absolute', left: 0, top: 0, bottom: 0,
                        width: `${flow.progress}%`,
                        background: 'rgba(0,0,0,0.15)',
                      }} />
                      <span style={{
                        position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)',
                        fontSize: 10.5, fontWeight: 600, color: '#FFFFFF', whiteSpace: 'nowrap',
                        overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: w - 16,
                      }}>
                        {flow.name}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
