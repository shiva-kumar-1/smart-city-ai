import React from 'react';
import { Router, Route, Switch, Redirect } from 'wouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Parking from './pages/Parking';
import Traffic from './pages/Traffic';
import FuelStations from './pages/FuelStations';
import Emergency from './pages/Emergency';
import About from './pages/About';
import RoadDamage from './pages/RoadDamage';
import AuthPage from './pages/Auth';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30000 } },
});

function ProtectedRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <Switch>
      <Route path="/auth" component={AuthPage} />
      {!user ? (
        <Route>
          <Redirect to="/auth" />
        </Route>
      ) : (
        <Layout>
          <Switch>
            <Route path="/" component={Dashboard} />
            <Route path="/parking" component={Parking} />
            <Route path="/traffic" component={Traffic} />
            <Route path="/road-damage" component={RoadDamage} />
            <Route path="/fuelstations" component={FuelStations} />
            <Route path="/emergency" component={Emergency} />
            <Route path="/about" component={About} />
            <Route><Redirect to="/" /></Route>
          </Switch>
        </Layout>
      )}
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <ProtectedRoutes />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}
