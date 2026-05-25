import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppLayout } from './layouts/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { Tracking } from './pages/Tracking';
import { KanbanBoard } from './pages/KanbanBoard';
import { GanttView } from './pages/GanttView';
import { GapsAnalysis } from './pages/GapsAnalysis';
import { Capacity } from './pages/Capacity';
import { Allocation } from './pages/Allocation';
import { Transformation } from './pages/Transformation';
import { Reports } from './pages/Reports';
import { Storytelling } from './pages/Storytelling';
import { Roadmap } from './pages/Roadmap';
import { ErrorBoundary } from './components/ui/ErrorBoundary';

function wrap(Component: React.ComponentType, name: string) {
  return (
    <ErrorBoundary name={name}>
      <Component />
    </ErrorBoundary>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={wrap(Dashboard, 'Dashboard Executivo')} />
          <Route path="/tracking" element={wrap(Tracking, 'Acompanhamento')} />
          <Route path="/kanban" element={wrap(KanbanBoard, 'Pipeline Kanban')} />
          <Route path="/gantt" element={wrap(GanttView, 'Gantt Executivo')} />
          <Route path="/gaps" element={wrap(GapsAnalysis, 'GAPs & Ishikawa')} />
          <Route path="/capacity" element={wrap(Capacity, 'Capacidade')} />
          <Route path="/allocation" element={wrap(Allocation, 'Alocação')} />
          <Route path="/transformation" element={wrap(Transformation, 'Transformação')} />
          <Route path="/reports" element={wrap(Reports, 'Report Center')} />
          <Route path="/storytelling" element={wrap(Storytelling, 'Storytelling')} />
          <Route path="/roadmap" element={wrap(Roadmap, 'Roadmap')} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}

export default App;
