import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Layout } from './components/Layout/Layout';
import { Login } from './pages/Login';
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
    <h1 className="text-2xl font-bold text-stone-800 mb-2">{title}</h1>
    <p className="text-stone-500">This page is coming soon</p>
  </div>
);

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

// Public Route Component (redirects to dashboard if already logged in)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={
        <PublicRoute>
          <Login />
        </PublicRoute>
      } />

      {/* Protected Routes */}
      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
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

      {/* Catch all - redirect to login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
