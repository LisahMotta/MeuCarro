import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Fuel, Loader2, AlertCircle } from 'lucide-react';
import { useVehicleStore } from '../store/vehicleStore';
import { useFuelings, useFuelingStats, useDeleteFueling } from '../features/fuelings/hooks/useFuelings';
import { FuelingCard } from '../features/fuelings/components/FuelingCard';
import { FuelingStatsCards } from '../features/fuelings/components/FuelingStatsCards';
import { ConsumptionChart } from '../features/fuelings/components/ConsumptionChart';

export function FuelingsPage() {
  const navigate = useNavigate();
  const selectedVehicle = useVehicleStore((s) => s.selectedVehicle);
  const vehicleId = selectedVehicle?.id ?? '';

  const { data: fuelings, isLoading } = useFuelings(vehicleId);
  const { data: stats } = useFuelingStats(vehicleId);
  const deleteMutation = useDeleteFueling(vehicleId);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  if (!selectedVehicle) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <AlertCircle className="w-12 h-12 text-muted-foreground mb-4" />
        <h2 className="text-xl font-bold mb-2">Nenhum veículo selecionado</h2>
        <p className="text-muted-foreground text-sm">Selecione um veículo para ver os abastecimentos.</p>
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
          <h1 className="text-2xl font-bold text-foreground">Abastecimentos</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {selectedVehicle.brand} {selectedVehicle.model} · {fuelings?.length ?? 0} registros
          </p>
        </div>
        <button
          onClick={() => navigate('/fuelings/new')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Registrar</span>
        </button>
      </div>

      {stats && <FuelingStatsCards stats={stats} />}

      {fuelings && fuelings.length > 0 && <ConsumptionChart fuelings={fuelings} />}

      {!fuelings?.length ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
            <Fuel className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="font-bold text-lg mb-1">Nenhum abastecimento</h3>
          <p className="text-muted-foreground text-sm mb-6 max-w-xs">
            Registre seu primeiro abastecimento para começar a calcular o consumo.
          </p>
          <button
            onClick={() => navigate('/fuelings/new')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all"
          >
            <Plus className="w-4 h-4" />
            Primeiro abastecimento
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <h2 className="font-semibold text-foreground">Histórico</h2>
          {fuelings.map((fueling) => (
            <div key={fueling.id} className={deletingId === fueling.id ? 'opacity-50 pointer-events-none' : ''}>
              <FuelingCard fueling={fueling} onDelete={handleDelete} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
