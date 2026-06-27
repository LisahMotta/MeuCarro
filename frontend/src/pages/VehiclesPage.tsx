import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Car, Loader2 } from 'lucide-react';
import { useVehicles, useDeleteVehicle } from '../features/vehicles/hooks/useVehicles';
import { VehicleCard } from '../features/vehicles/components/VehicleCard';
import { DeleteVehicleDialog } from '../features/vehicles/components/DeleteVehicleDialog';
import { useVehicleStore } from '../store/vehicleStore';
import { Vehicle } from '../features/vehicles/types/vehicle.types';

export function VehiclesPage() {
  const navigate = useNavigate();
  const { data: vehicles, isLoading } = useVehicles();
  const selectedVehicle = useVehicleStore((s) => s.selectedVehicle);
  const setSelectedVehicle = useVehicleStore((s) => s.setSelectedVehicle);
  const deleteMutation = useDeleteVehicle();
  const [toDelete, setToDelete] = useState<Vehicle | null>(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Meus Veículos</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {vehicles?.length ?? 0} veículo{vehicles?.length !== 1 ? 's' : ''} cadastrado{vehicles?.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => navigate('/vehicles/new')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Adicionar</span>
        </button>
      </div>

      {!vehicles?.length ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mb-6">
            <Car className="w-10 h-10 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-bold mb-2">Nenhum veículo cadastrado</h2>
          <p className="text-muted-foreground mb-8 max-w-sm text-sm">
            Adicione seu primeiro veículo para começar a controlar gastos e manutenções.
          </p>
          <button
            onClick={() => navigate('/vehicles/new')}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all"
          >
            <Plus className="w-5 h-5" />
            Adicionar primeiro veículo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {vehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              isSelected={selectedVehicle?.id === vehicle.id}
              onSelect={() => setSelectedVehicle(vehicle)}
              onEdit={() => navigate(`/vehicles/${vehicle.id}/edit`)}
              onDelete={() => setToDelete(vehicle)}
            />
          ))}
        </div>
      )}

      {toDelete && (
        <DeleteVehicleDialog
          vehicle={toDelete}
          isLoading={deleteMutation.isPending}
          onConfirm={() => {
            deleteMutation.mutate(toDelete.id, {
              onSuccess: () => setToDelete(null),
            });
          }}
          onCancel={() => setToDelete(null)}
        />
      )}
    </div>
  );
}
