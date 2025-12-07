import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Layout } from './components/Layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { KPIScorecard } from './pages/KPIScorecard';
import { KPIDetail } from './pages/KPIDetail';
import { ScoreEntry } from './pages/ScoreEntry';
import { ClientScoring } from './pages/ClientScoring';
import { MonthlyView } from './pages/MonthlyView';

const queryClient = new QueryClient();

// Placeholder pages
const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
    <div className="w-20 h-20 rounded-2xl bg-amber-100 flex items-center justify-center mb-4">
      <span className="text-3xl">🚧</span>
    </div>
    <h1 className="text-2xl font-bold text-slate-800 mb-2">{title}</h1>
    <p className="text-slate-500">This page is coming soon</p>
  </div>
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="kpis" element={<KPIScorecard />} />
            <Route path="kpis/:id" element={<KPIDetail />} />
            <Route path="monthly" element={<MonthlyView />} />
            <Route path="trends" element={<PlaceholderPage title="Trends & YTD Analysis" />} />
            <Route path="scoring" element={<ScoreEntry />} />
            <Route path="client" element={<ClientScoring />} />
            <Route path="comments" element={<PlaceholderPage title="Comments Management" />} />
            <Route path="reports" element={<PlaceholderPage title="Reports & Export" />} />
            <Route path="settings" element={<PlaceholderPage title="Settings" />} />
            <Route path="actions" element={<PlaceholderPage title="Action Items" />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
