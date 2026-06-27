import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { VehicleForm } from '../features/vehicles/components/VehicleForm';
import { useCreateVehicle } from '../features/vehicles/hooks/useVehicles';

export function VehicleNewPage() {
  const navigate = useNavigate();
  const mutation = useCreateVehicle();

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
          <h1 className="text-2xl font-bold text-foreground">Novo Veículo</h1>
          <p className="text-muted-foreground text-sm">Preencha os dados do seu veículo</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6">
        <VehicleForm
          isLoading={mutation.isPending}
          onSubmit={async (data) => {
            await mutation.mutateAsync(data);
            navigate('/vehicles');
          }}
        />
      </div>
    </div>
  );
}
