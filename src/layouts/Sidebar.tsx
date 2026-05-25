import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, GitBranch, Users, BarChart3, Kanban,
  GanttChartSquare, AlertTriangle, Zap, FileText, TrendingUp,
  ChevronLeft, ChevronRight, Activity, Settings, HelpCircle,
  Map, Layers, Target
} from 'lucide-react';
import { useStore } from '../store/useStore';

const NAV_GROUPS = [
  {
    label: 'CENTRAL EXECUTIVA',
    items: [
      { id: '/', label: 'Dashboard Executivo', icon: LayoutDashboard },
      { id: '/tracking', label: 'Acompanhamento', icon: Activity },
      { id: '/kanban', label: 'Pipeline Operacional', icon: Kanban },
      { id: '/gantt', label: 'Gantt Executivo', icon: GanttChartSquare },
    ]
  },
  {
    label: 'DIAGNÓSTICO & ANÁLISE',
    items: [
      { id: '/gaps', label: 'GAPs & Ishikawa', icon: AlertTriangle },
      { id: '/capacity', label: 'Capacidade', icon: BarChart3 },
      { id: '/allocation', label: 'Alocação', icon: Users },
      { id: '/transformation', label: 'Impacto Transformação', icon: Zap },
    ]
  },
  {
    label: 'INTELLIGENCE & REPORTS',
    items: [
      { id: '/reports', label: 'Executive Report Center', icon: FileText },
      { id: '/storytelling', label: 'Storytelling Engine', icon: TrendingUp },
      { id: '/roadmap', label: 'Roadmap Estratégico', icon: Map },
    ]
  },
];

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { sidebarCollapsed, toggleSidebar } = useStore();

  return (
    <aside style={{
      width: sidebarCollapsed ? 64 : 240,
      minHeight: '100vh',
      background: 'linear-gradient(175deg, #001f35 0%, #003B5C 50%, #005A7A 100%)',
      display: 'flex',
      flexDirection: 'column',
      transition: 'width 0.3s cubic-bezier(0.16,1,0.3,1)',
      position: 'relative',
      flexShrink: 0,
      zIndex: 50,
    }}>
      {/* Logo */}
      <div style={{
        padding: sidebarCollapsed ? '24px 0' : '24px 20px',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        display: 'flex', alignItems: 'center',
        justifyContent: sidebarCollapsed ? 'center' : 'space-between',
        minHeight: 72,
      }}>
        {!sidebarCollapsed ? (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: 'linear-gradient(135deg, #7A9A01, #96B80A)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Layers size={16} color="#FFFFFF" strokeWidth={2.5} />
              </div>
              <div>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                  ProcessFlow
                </p>
                <p style={{ margin: 0, fontSize: 9.5, fontWeight: 600, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Enterprise
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'linear-gradient(135deg, #7A9A01, #96B80A)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Layers size={16} color="#FFFFFF" strokeWidth={2.5} />
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '12px 0' }}>
        {NAV_GROUPS.map(group => (
          <div key={group.label} style={{ marginBottom: 8 }}>
            {!sidebarCollapsed && (
              <p className="sidebar-section-label">{group.label}</p>
            )}
            {group.items.map(item => {
              const Icon = item.icon;
              const active = location.pathname === item.id;
              return (
                <button
                  key={item.id}
                  className={`nav-item ${active ? 'active' : ''}`}
                  style={{
                    border: 'none', background: 'none',
                    textAlign: 'left', cursor: 'pointer',
                    margin: sidebarCollapsed ? '1px 0' : '1px 8px',
                    width: sidebarCollapsed ? '100%' : 'calc(100% - 16px)',
                    justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                    padding: sidebarCollapsed ? '10px' : '8px 12px',
                    position: 'relative',
                  }}
                  onClick={() => navigate(item.id)}
                  title={sidebarCollapsed ? item.label : undefined}
                >
                  <Icon size={17} strokeWidth={active ? 2.2 : 1.8} style={{ flexShrink: 0 }} />
                  {!sidebarCollapsed && item.label}
                  {active && !sidebarCollapsed && (
                    <div style={{
                      position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
                      width: 6, height: 6, borderRadius: '50%',
                      background: '#7A9A01',
                    }} />
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.08)',
        padding: '12px 8px',
        display: 'flex', flexDirection: 'column', gap: 2,
      }}>
        {!sidebarCollapsed && (
          <div style={{
            padding: '10px 12px',
            background: 'rgba(255,255,255,0.06)',
            borderRadius: 10,
            marginBottom: 8,
            border: '1px solid rgba(255,255,255,0.08)',
          }}>
            <p style={{ margin: 0, fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.9)' }}>
              Diretoria Operacional
            </p>
            <p style={{ margin: '2px 0 0', fontSize: 10.5, color: 'rgba(255,255,255,0.45)' }}>
              andre.torquato4@gmail.com
            </p>
          </div>
        )}
        <button className="nav-item" style={{ border: 'none', background: 'none', cursor: 'pointer', justifyContent: sidebarCollapsed ? 'center' : 'flex-start' }}>
          <HelpCircle size={16} />
          {!sidebarCollapsed && 'Suporte'}
        </button>
        <button className="nav-item" style={{ border: 'none', background: 'none', cursor: 'pointer', justifyContent: sidebarCollapsed ? 'center' : 'flex-start' }}>
          <Settings size={16} />
          {!sidebarCollapsed && 'Configurações'}
        </button>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={toggleSidebar}
        style={{
          position: 'absolute', top: '50%', right: -12, transform: 'translateY(-50%)',
          width: 24, height: 24, borderRadius: '50%',
          background: '#FFFFFF', border: '1.5px solid #D9E1E7',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', zIndex: 10,
          boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          color: '#003B5C',
        }}
        onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)')}
        onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.12)')}
      >
        {sidebarCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </aside>
  );
}
