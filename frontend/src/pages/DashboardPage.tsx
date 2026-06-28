import { useVehicleStore } from '../store/vehicleStore';
import { useVehicles } from '../features/vehicles/hooks/useVehicles';
import { useDashboard, useMonthlyExpenses } from '../features/dashboard/hooks/useDashboard';
import { StatsGrid } from '../features/dashboard/components/StatsGrid';
import { MonthlyChart } from '../features/dashboard/components/MonthlyChart';
import { ConsumptionChart } from '../features/dashboard/components/ConsumptionChart';
import { VehicleSummaryCard } from '../features/dashboard/components/VehicleSummaryCard';
import { CategoryChart } from '../features/dashboard/components/CategoryChart';
import { AlertsPanel } from '../features/dashboard/components/AlertsPanel';
import { NextMaintenancesPanel } from '../features/dashboard/components/NextMaintenancesPanel';
import { RecentTransactions } from '../features/dashboard/components/RecentTransactions';
import { Car, Plus, Loader2, Gauge } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../lib/utils';

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
    <div className="pb-20 lg:pb-0 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Visão geral do seu veículo</p>
        </div>
        <Link
          to="/fuelings/new"
          className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-all"
        >
          <Plus className="w-4 h-4" />
          Adicionar
        </Link>
      </div>

      {/* Main layout: content + right panel */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-5">

        {/* ── Left / main content ── */}
        <div className="space-y-5 min-w-0">
          <StatsGrid stats={dashboard.stats} />

          {/* Middle row: vehicle summary + bar chart */}
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-5">
            <VehicleSummaryCard vehicle={dashboard.vehicle} currentKm={dashboard.stats.currentKm} />
            <div className="space-y-5">
              {monthlyExpenses && <MonthlyChart data={monthlyExpenses} />}
            </div>
          </div>

          {/* Bottom row: category donut + consumption line */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <CategoryChart stats={dashboard.stats} />
            {monthlyExpenses && (
              <ConsumptionChart data={monthlyExpenses} avgConsumption={dashboard.stats.avgConsumption} />
            )}
          </div>

          {/* Recent transactions */}
          <RecentTransactions dashboard={dashboard} />
        </div>

        {/* ── Right panel ── */}
        <div className="space-y-4">
          {/* Vehicle card */}
          <div className="bg-card border border-border rounded-2xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Car className="w-5 h-5 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">
                  {selectedVehicle.brand} {selectedVehicle.model}
                </p>
                <p className="text-xs text-muted-foreground">{selectedVehicle.year}</p>
              </div>
            </div>

            {/* Cost per km */}
            <div className="bg-muted/40 rounded-xl p-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                <Gauge className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Custo por km</p>
                <p className="text-lg font-bold text-foreground leading-none">
                  {parseFloat(dashboard.stats.costPerKm) > 0
                    ? formatCurrency(parseFloat(dashboard.stats.costPerKm))
                    : '—'}
                </p>
                <p className="text-xs text-muted-foreground">Média geral</p>
              </div>
            </div>
          </div>

          <AlertsPanel alerts={dashboard.recentAlerts} />
          <NextMaintenancesPanel
            nextServices={dashboard.nextServices}
            currentKm={dashboard.stats.currentKm}
          />
        </div>
      </div>
    </div>
  );
}
