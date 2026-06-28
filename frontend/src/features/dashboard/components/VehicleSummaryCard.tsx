import { Car } from 'lucide-react';
import { Vehicle } from '../../vehicles/types/vehicle.types';
import { formatKm } from '../../../lib/utils';

const fuelLabels: Record<string, string> = {
  flex: 'Flex', gasoline: 'Gasolina', ethanol: 'Etanol',
  diesel: 'Diesel', electric: 'Elétrico', hybrid: 'Híbrido',
};

interface Props {
  vehicle: Vehicle;
  currentKm: number;
}

export function VehicleSummaryCard({ vehicle, currentKm }: Props) {
  return (
    <div className="bg-card border border-border rounded-2xl p-5">
      <h3 className="font-semibold text-foreground text-sm mb-4">Resumo do veículo</h3>

      {/* Car image or placeholder */}
      <div className="flex items-center justify-center h-28 mb-4">
        {vehicle.photoUrl ? (
          <img src={vehicle.photoUrl} alt={vehicle.model} className="h-full object-contain drop-shadow-lg" />
        ) : (
          <div className="flex items-center justify-center w-full h-full">
            <Car className="w-20 h-20 text-muted-foreground/30" />
          </div>
        )}
      </div>

      {/* Vehicle name + fuel badge */}
      <div className="flex items-center gap-2 mb-4">
        <h4 className="font-bold text-foreground text-sm">
          {vehicle.brand} {vehicle.model} {vehicle.year}
        </h4>
        {vehicle.fuelType && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-primary/15 text-primary font-medium">
            {fuelLabels[vehicle.fuelType] ?? vehicle.fuelType}
          </span>
        )}
      </div>

      {/* Stats */}
      <div className="space-y-2.5">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Quilometragem atual</span>
          <span className="font-semibold text-foreground">{formatKm(currentKm)}</span>
        </div>
        {vehicle.tankCapacity && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Capacidade do tanque</span>
            <span className="font-semibold text-foreground">{vehicle.tankCapacity} L</span>
          </div>
        )}
        {vehicle.plate && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Placa</span>
            <span className="font-semibold text-foreground">{vehicle.plate}</span>
          </div>
        )}
      </div>
    </div>
  );
}
