import { Car, Fuel, Wrench, TrendingUp, AlertTriangle, Plus } from 'lucide-react';
import { useVehicleStore } from '../store/vehicleStore';
import { Link } from 'react-router-dom';

export function DashboardPage() {
  const selectedVehicle = useVehicleStore((s) => s.selectedVehicle);

  if (!selectedVehicle) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mb-6">
          <Car className="w-10 h-10 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Nenhum veículo cadastrado</h2>
        <p className="text-muted-foreground mb-8 max-w-sm">
          Adicione seu primeiro veículo para começar a controlar seus gastos e manutenções.
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

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">
          {selectedVehicle.brand} {selectedVehicle.model} {selectedVehicle.year}
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Gasto do Mês', value: 'R$ 0,00', icon: TrendingUp, color: 'text-blue-500' },
          { label: 'Abastecimentos', value: '0', icon: Fuel, color: 'text-green-500' },
          { label: 'Manutenções', value: '0', icon: Wrench, color: 'text-orange-500' },
          { label: 'Alertas', value: '0', icon: AlertTriangle, color: 'text-red-500' },
        ].map((stat) => (
          <div key={stat.label} className="bg-card border border-border rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
              <span className="text-xs text-muted-foreground">{stat.label}</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-2xl p-6">
        <p className="text-muted-foreground text-center py-8">
          Adicione abastecimentos e manutenções para ver seus gráficos aqui.
        </p>
      </div>
    </div>
  );
}
