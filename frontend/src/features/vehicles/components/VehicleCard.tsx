import { Car, Edit, Trash2, CheckCircle, Fuel, Gauge } from 'lucide-react';
import { Vehicle, FuelType } from '../types/vehicle.types';
import { formatKm } from '../../../lib/utils';

const fuelLabels: Record<FuelType, string> = {
  gasoline: 'Gasolina',
  ethanol: 'Etanol',
  flex: 'Flex',
  diesel: 'Diesel',
  electric: 'Elétrico',
  hybrid: 'Híbrido',
};

const fuelColors: Record<FuelType, string> = {
  gasoline: 'text-orange-500',
  ethanol: 'text-green-500',
  flex: 'text-blue-500',
  diesel: 'text-yellow-600',
  electric: 'text-cyan-500',
  hybrid: 'text-purple-500',
};

interface Props {
  vehicle: Vehicle;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function VehicleCard({ vehicle, isSelected, onSelect, onEdit, onDelete }: Props) {
  return (
    <div
      className={`bg-card border rounded-2xl overflow-hidden transition-all cursor-pointer group ${
        isSelected ? 'border-primary shadow-lg shadow-primary/10' : 'border-border hover:border-primary/50'
      }`}
      onClick={onSelect}
    >
      {/* Photo */}
      <div className="relative h-40 bg-muted">
        {vehicle.photoUrl ? (
          <img
            src={vehicle.photoUrl}
            alt={`${vehicle.brand} ${vehicle.model}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Car className="w-16 h-16 text-muted-foreground/30" />
          </div>
        )}
        {isSelected && (
          <div className="absolute top-3 right-3 bg-primary rounded-full p-0.5">
            <CheckCircle className="w-5 h-5 text-primary-foreground" />
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-bold text-foreground text-lg leading-tight">
              {vehicle.brand} {vehicle.model}
            </h3>
            <p className="text-muted-foreground text-sm">
              {vehicle.year}{vehicle.version ? ` · ${vehicle.version}` : ''}
            </p>
          </div>
          {vehicle.plate && (
            <span className="text-xs font-mono bg-muted px-2 py-1 rounded-lg text-muted-foreground border border-border">
              {vehicle.plate}
            </span>
          )}
        </div>

        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1.5">
            <Gauge className="w-4 h-4 text-muted-foreground" />
            <span className="text-foreground font-medium">{formatKm(vehicle.currentKm)}</span>
          </div>
          <div className={`flex items-center gap-1.5 ${fuelColors[vehicle.fuelType]}`}>
            <Fuel className="w-4 h-4" />
            <span className="font-medium">{fuelLabels[vehicle.fuelType]}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border">
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(); }}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
          >
            <Edit className="w-4 h-4" />
            Editar
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
          >
            <Trash2 className="w-4 h-4" />
            Remover
          </button>
        </div>
      </div>
    </div>
  );
}
