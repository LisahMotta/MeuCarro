import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { VehicleForm } from '../features/vehicles/components/VehicleForm';
import { VehiclePhotoUpload } from '../features/vehicles/components/VehiclePhotoUpload';
import { useVehicle, useUpdateVehicle } from '../features/vehicles/hooks/useVehicles';

export function VehicleEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: vehicle, isLoading } = useVehicle(id!);
  const mutation = useUpdateVehicle();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Veículo não encontrado.</p>
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
          <h1 className="text-2xl font-bold text-foreground">Editar Veículo</h1>
          <p className="text-muted-foreground text-sm">{vehicle.brand} {vehicle.model} {vehicle.year}</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 space-y-6">
        <VehiclePhotoUpload vehicleId={vehicle.id} currentPhotoUrl={vehicle.photoUrl} />

        <div className="border-t border-border pt-6">
          <VehicleForm
            vehicle={vehicle}
            isLoading={mutation.isPending}
            onSubmit={async (data) => {
              await mutation.mutateAsync({ id: vehicle.id, payload: data });
              navigate('/vehicles');
            }}
          />
        </div>
      </div>
    </div>
  );
}
