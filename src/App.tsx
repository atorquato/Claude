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

function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/tracking" element={<Tracking />} />
          <Route path="/kanban" element={<KanbanBoard />} />
          <Route path="/gantt" element={<GanttView />} />
          <Route path="/gaps" element={<GapsAnalysis />} />
          <Route path="/capacity" element={<Capacity />} />
          <Route path="/allocation" element={<Allocation />} />
          <Route path="/transformation" element={<Transformation />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/storytelling" element={<Storytelling />} />
          <Route path="/roadmap" element={<Roadmap />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}

export default App;
