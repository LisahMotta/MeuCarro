import { Fuel, MapPin, Gauge, TrendingUp, Trash2, Pencil } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Fueling } from '../types/fueling.types';
import { formatCurrency, formatDate, formatKm } from '../../../lib/utils';

const fuelLabels: Record<string, string> = {
  gasoline: 'Gasolina', ethanol: 'Etanol', flex: 'Flex',
  diesel: 'Diesel', electric: 'Elétrico', hybrid: 'Híbrido',
};

interface Props {
  fueling: Fueling;
  onDelete: (id: string) => void;
}

export function FuelingCard({ fueling, onDelete }: Props) {
  const navigate = useNavigate();
  return (
    <div className="bg-card border border-border rounded-2xl p-4 hover:border-primary/30 transition-all group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
            <Fuel className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <p className="font-semibold text-foreground text-sm">
              {fueling.stationName ?? 'Posto não informado'}
            </p>
            <p className="text-xs text-muted-foreground">{formatDate(fueling.date)}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-bold text-foreground">{formatCurrency(parseFloat(fueling.totalCost))}</p>
          <p className="text-xs text-muted-foreground">{fuelLabels[fueling.fuelType]}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-3">
        <div className="bg-muted/50 rounded-lg p-2.5 text-center">
          <p className="text-xs text-muted-foreground mb-0.5">Litros</p>
          <p className="font-semibold text-sm text-foreground">{parseFloat(fueling.liters).toFixed(2)}L</p>
        </div>
        <div className="bg-muted/50 rounded-lg p-2.5 text-center">
          <p className="text-xs text-muted-foreground mb-0.5">Preço/L</p>
          <p className="font-semibold text-sm text-foreground">R$ {parseFloat(fueling.pricePerLiter).toFixed(3)}</p>
        </div>
        <div className="bg-muted/50 rounded-lg p-2.5 text-center">
          <p className="text-xs text-muted-foreground mb-0.5">Hodômetro</p>
          <p className="font-semibold text-sm text-foreground">{formatKm(fueling.odometer)}</p>
        </div>
      </div>

      {fueling.consumption && (
        <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-lg p-2.5 mb-3">
          <TrendingUp className="w-4 h-4 text-green-500 flex-shrink-0" />
          <div className="flex gap-4 text-xs">
            <span className="text-foreground font-medium">{parseFloat(fueling.consumption).toFixed(2)} km/L</span>
            {fueling.autonomy && <span className="text-muted-foreground">Autonomia: ~{parseFloat(fueling.autonomy).toFixed(0)}km</span>}
            {fueling.costPerKm && <span className="text-muted-foreground">R$ {parseFloat(fueling.costPerKm).toFixed(3)}/km</span>}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {fueling.city && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="w-3 h-3" />
              {fueling.city}
            </div>
          )}
          {fueling.fullTank && (
            <span className="text-xs bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded-full font-medium">Cheio</span>
          )}
          {fueling.partialTank && (
            <span className="text-xs bg-orange-500/10 text-orange-500 px-2 py-0.5 rounded-full font-medium">Parcial</span>
          )}
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
          <button
            onClick={() => navigate(`/fuelings/${fueling.id}/edit`)}
            className="text-muted-foreground hover:text-primary p-1 rounded-lg hover:bg-primary/10 transition-all"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(fueling.id)}
            className="text-muted-foreground hover:text-destructive p-1 rounded-lg hover:bg-destructive/10 transition-all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
