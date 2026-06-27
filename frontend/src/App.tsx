import { Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { AppLayout } from './components/layout/AppLayout';
import { ProtectedRoute } from './router/ProtectedRoute';
import { LoginForm } from './features/auth/components/LoginForm';
import { RegisterForm } from './features/auth/components/RegisterForm';
import { OnboardingPage } from './pages/OnboardingPage';
import { DashboardPage } from './pages/DashboardPage';
import { VehiclesPage } from './pages/VehiclesPage';
import { VehicleNewPage } from './pages/VehicleNewPage';
import { VehicleEditPage } from './pages/VehicleEditPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { FuelingsPage } from './pages/FuelingsPage';
import { FuelingNewPage } from './pages/FuelingNewPage';

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route element={<AppLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/vehicles" element={<VehiclesPage />} />
            <Route path="/vehicles/new" element={<VehicleNewPage />} />
            <Route path="/vehicles/:id/edit" element={<VehicleEditPage />} />
            <Route path="/fuelings" element={<FuelingsPage />} />
            <Route path="/fuelings/new" element={<FuelingNewPage />} />
            <Route path="/maintenances" element={<div className="p-4"><h1 className="text-2xl font-bold">Manutenções</h1><p className="text-muted-foreground mt-2">Em desenvolvimento — Etapa 4</p></div>} />
            <Route path="/tires" element={<div className="p-4"><h1 className="text-2xl font-bold">Pneus</h1><p className="text-muted-foreground mt-2">Em desenvolvimento — Etapa 5</p></div>} />
            <Route path="/documents" element={<div className="p-4"><h1 className="text-2xl font-bold">Documentos</h1><p className="text-muted-foreground mt-2">Em desenvolvimento — Etapa 5</p></div>} />
            <Route path="/reports" element={<div className="p-4"><h1 className="text-2xl font-bold">Relatórios</h1><p className="text-muted-foreground mt-2">Em desenvolvimento — Etapa 7</p></div>} />
            <Route path="/alerts" element={<div className="p-4"><h1 className="text-2xl font-bold">Alertas</h1><p className="text-muted-foreground mt-2">Em desenvolvimento — Etapa 6</p></div>} />
            <Route path="/settings" element={<div className="p-4"><h1 className="text-2xl font-bold">Configurações</h1><p className="text-muted-foreground mt-2">Em desenvolvimento</p></div>} />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
