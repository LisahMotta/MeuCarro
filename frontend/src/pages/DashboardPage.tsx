import { useVehicleStore } from '../store/vehicleStore';
import { useVehicles } from '../features/vehicles/hooks/useVehicles';
import { useDashboard, useMonthlyExpenses } from '../features/dashboard/hooks/useDashboard';
import { StatsGrid } from '../features/dashboard/components/StatsGrid';
import { MonthlyChart } from '../features/dashboard/components/MonthlyChart';
import { NextServicesCard } from '../features/dashboard/components/NextServicesCard';
import { UpcomingDocumentsCard } from '../features/dashboard/components/UpcomingDocumentsCard';
import { RecentAlertsCard } from '../features/dashboard/components/RecentAlertsCard';
import { Car, Plus, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export function DashboardPage() {
  const selectedVehicle = useVehicleStore((s) => s.selectedVehicle);
  const { data: vehicles, isLoading: loadingVehicles } = useVehicles();
  const vehicleId = selectedVehicle?.id ?? '';

  const { data: dashboard, isLoading: loadingDashboard } = useDashboard(vehicleId);
  const { data: monthlyExpenses } = useMonthlyExpenses(vehicleId);

  if (loadingVehicles) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!vehicles?.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mb-6">
          <Car className="w-10 h-10 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Bem-vindo ao MeuCarro!</h2>
        <p className="text-muted-foreground mb-8 max-w-sm text-sm">
          Adicione seu primeiro veículo para começar a controlar gastos, manutenções e documentos.
        </p>
        <Link
          to="/vehicles/new"
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all"
        >
          <Plus className="w-5 h-5" />
          Adicionar veículo
        </Link>
      </div>
    );
  }

  if (!selectedVehicle || loadingDashboard || !dashboard) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-20 lg:pb-0">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          {selectedVehicle.brand} {selectedVehicle.model} {selectedVehicle.year}
          {selectedVehicle.plate && ` · ${selectedVehicle.plate}`}
        </p>
      </div>

      <StatsGrid stats={dashboard.stats} />

      {monthlyExpenses && <MonthlyChart data={monthlyExpenses} />}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <NextServicesCard
          nextServices={dashboard.nextServices}
          currentKm={dashboard.stats.currentKm}
        />
        {dashboard.upcomingDocuments.length > 0 && (
          <UpcomingDocumentsCard documents={dashboard.upcomingDocuments} />
        )}
        {dashboard.recentAlerts.length > 0 && (
          <RecentAlertsCard alerts={dashboard.recentAlerts} />
        )}
      </div>
    </div>
  );
}
