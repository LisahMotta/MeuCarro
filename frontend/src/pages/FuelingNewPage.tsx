import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { FuelingForm } from '../features/fuelings/components/FuelingForm';
import { useCreateFueling } from '../features/fuelings/hooks/useFuelings';
import { useVehicleStore } from '../store/vehicleStore';
import { AlertCircle } from 'lucide-react';

export function FuelingNewPage() {
  const navigate = useNavigate();
  const selectedVehicle = useVehicleStore((s) => s.selectedVehicle);
  const mutation = useCreateFueling(selectedVehicle?.id ?? '');

  if (!selectedVehicle) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <AlertCircle className="w-12 h-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Selecione um veículo primeiro.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Novo Abastecimento</h1>
          <p className="text-muted-foreground text-sm">
            {selectedVehicle.brand} {selectedVehicle.model}
          </p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6">
        <FuelingForm
          vehicleCurrentKm={selectedVehicle.currentKm}
          vehicleFuelType={selectedVehicle.fuelType}
          isLoading={mutation.isPending}
          onSubmit={async (data) => {
            await mutation.mutateAsync(data);
            navigate('/fuelings');
          }}
        />
      </div>
    </div>
  );
}
