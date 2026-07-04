import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { FuelingForm } from '../features/fuelings/components/FuelingForm';
import { useFueling, useUpdateFueling } from '../features/fuelings/hooks/useFuelings';
import { useVehicleStore } from '../store/vehicleStore';

export function FuelingEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const selectedVehicle = useVehicleStore((s) => s.selectedVehicle);
  const vehicleId = selectedVehicle?.id ?? '';

  const { data: fueling, isLoading } = useFueling(vehicleId, id!);
  const mutation = useUpdateFueling(vehicleId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!fueling) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Abastecimento não encontrado.</p>
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
          <h1 className="text-2xl font-bold text-foreground">Editar Abastecimento</h1>
          <p className="text-muted-foreground text-sm">
            {selectedVehicle?.brand} {selectedVehicle?.model}
          </p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6">
        <FuelingForm
          fueling={fueling}
          vehicleCurrentKm={selectedVehicle?.currentKm}
          vehicleFuelType={selectedVehicle?.fuelType}
          isLoading={mutation.isPending}
          onSubmit={async (data) => {
            await mutation.mutateAsync({ id: fueling.id, payload: data });
            navigate('/fuelings');
          }}
        />
      </div>
    </div>
  );
}
