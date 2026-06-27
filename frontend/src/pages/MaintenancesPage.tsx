import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Wrench, Loader2, AlertCircle } from 'lucide-react';
import { useVehicleStore } from '../store/vehicleStore';
import { useMaintenances, useMaintenanceStats, useDeleteMaintenance } from '../features/maintenances/hooks/useMaintenances';
import { MaintenanceCard } from '../features/maintenances/components/MaintenanceCard';
import { MaintenanceStatsCards } from '../features/maintenances/components/MaintenanceStatsCards';
import { MaintenanceByCategoryChart } from '../features/maintenances/components/MaintenanceByCategoryChart';

export function MaintenancesPage() {
  const navigate = useNavigate();
  const selectedVehicle = useVehicleStore((s) => s.selectedVehicle);
  const vehicleId = selectedVehicle?.id ?? '';

  const { data: maintenances, isLoading } = useMaintenances(vehicleId);
  const { data: stats } = useMaintenanceStats(vehicleId);
  const deleteMutation = useDeleteMaintenance(vehicleId);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  if (!selectedVehicle) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <AlertCircle className="w-12 h-12 text-muted-foreground mb-4" />
        <h2 className="text-xl font-bold mb-2">Nenhum veículo selecionado</h2>
        <p className="text-muted-foreground text-sm">Selecione um veículo para ver as manutenções.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  function handleDelete(id: string) {
    setDeletingId(id);
    deleteMutation.mutate(id, { onSettled: () => setDeletingId(null) });
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Manutenções</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {selectedVehicle.brand} {selectedVehicle.model} · {maintenances?.length ?? 0} registros
          </p>
        </div>
        <button
          onClick={() => navigate('/maintenances/new')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Registrar</span>
        </button>
      </div>

      {stats && <MaintenanceStatsCards stats={stats} />}

      {stats && stats.byCategory.length > 0 && (
        <MaintenanceByCategoryChart stats={stats} />
      )}

      {!maintenances?.length ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
            <Wrench className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="font-bold text-lg mb-1">Nenhuma manutenção registrada</h3>
          <p className="text-muted-foreground text-sm mb-6 max-w-xs">
            Registre manutenções para acompanhar o histórico e receber alertas.
          </p>
          <button
            onClick={() => navigate('/maintenances/new')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all"
          >
            <Plus className="w-4 h-4" />
            Primeira manutenção
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <h2 className="font-semibold text-foreground">Histórico</h2>
          {maintenances.map((m) => (
            <div key={m.id} className={deletingId === m.id ? 'opacity-50 pointer-events-none' : ''}>
              <MaintenanceCard maintenance={m} onDelete={handleDelete} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
