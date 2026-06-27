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
import { SettingsPage } from './pages/SettingsPage';
import { InstallBanner } from './components/pwa/InstallBanner';
import { FuelingsPage } from './pages/FuelingsPage';
import { FuelingNewPage } from './pages/FuelingNewPage';
import { MaintenancesPage } from './pages/MaintenancesPage';
import { MaintenanceNewPage } from './pages/MaintenanceNewPage';
import { TiresPage } from './pages/TiresPage';
import { DocumentsPage } from './pages/DocumentsPage';
import { AlertsPage } from './pages/AlertsPage';
import { ReportsPage } from './pages/ReportsPage';

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
            <Route path="/maintenances" element={<MaintenancesPage />} />
            <Route path="/maintenances/new" element={<MaintenanceNewPage />} />
            <Route path="/tires" element={<TiresPage />} />
            <Route path="/documents" element={<DocumentsPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/alerts" element={<AlertsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <InstallBanner />
    </Suspense>
  );
}
