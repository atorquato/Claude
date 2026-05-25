import { create } from 'zustand';
import { flows as initialFlows, gaps as initialGaps, analysts as initialAnalysts, kpiSummary } from '../data/mockData';
import type { Flow, Gap, Analyst, FlowStatus } from '../data/mockData';

export interface GlobalFilters {
  front: string;
  area: string;
  process: string;
  analyst: string;
  status: string;
  criticality: string;
  period: string;
  riskLevel: string;
  maturity: string;
}

interface AppState {
  flows: Flow[];
  gaps: Gap[];
  analysts: Analyst[];
  kpiSummary: typeof kpiSummary;
  filters: GlobalFilters;
  sidebarCollapsed: boolean;
  activeModule: string;
  setFilters: (f: Partial<GlobalFilters>) => void;
  resetFilters: () => void;
  toggleSidebar: () => void;
  setActiveModule: (m: string) => void;
  updateFlowStatus: (id: string, status: FlowStatus) => void;
  filteredFlows: () => Flow[];
}

const DEFAULT_FILTERS: GlobalFilters = {
  front: '',
  area: '',
  process: '',
  analyst: '',
  status: '',
  criticality: '',
  period: '',
  riskLevel: '',
  maturity: '',
};

export const useStore = create<AppState>((set, get) => ({
  flows: initialFlows,
  gaps: initialGaps,
  analysts: initialAnalysts,
  kpiSummary,
  filters: DEFAULT_FILTERS,
  sidebarCollapsed: false,
  activeModule: 'dashboard',

  setFilters: (f) => set(s => ({ filters: { ...s.filters, ...f } })),
  resetFilters: () => set({ filters: DEFAULT_FILTERS }),
  toggleSidebar: () => set(s => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  setActiveModule: (m) => set({ activeModule: m }),

  updateFlowStatus: (id, status) =>
    set(s => ({
      flows: s.flows.map(f => f.id === id ? { ...f, status } : f)
    })),

  filteredFlows: () => {
    const { flows, filters } = get();
    return flows.filter(f => {
      if (filters.front && f.front !== filters.front) return false;
      if (filters.area && f.area !== filters.area) return false;
      if (filters.analyst && f.analyst !== filters.analyst) return false;
      if (filters.status && f.status !== filters.status) return false;
      if (filters.criticality && f.criticality !== filters.criticality) return false;
      if (filters.riskLevel && f.riskLevel !== filters.riskLevel) return false;
      if (filters.maturity && String(f.maturity) !== filters.maturity) return false;
      return true;
    });
  },
}));
