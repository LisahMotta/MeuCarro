import { CircleDot, Trash2, Calendar, Gauge } from 'lucide-react';
import { Tire, TirePosition } from '../types/tire.types';
import { formatCurrency, formatDate, formatKm } from '../../../lib/utils';

const positionLabels: Record<TirePosition, string> = {
  FL: 'Dianteiro Esq.', FR: 'Dianteiro Dir.',
  RL: 'Traseiro Esq.', RR: 'Traseiro Dir.', spare: 'Estepe',
};

const statusColors = {
  active: 'text-emerald-500 bg-emerald-500/10',
  replaced: 'text-gray-500 bg-gray-500/10',
  spare: 'text-blue-500 bg-blue-500/10',
};

const statusLabels = { active: 'Ativo', replaced: 'Substituído', spare: 'Estepe' };

interface Props { tire: Tire; onDelete: (id: string) => void; }

export function TireCard({ tire, onDelete }: Props) {
  return (
    <div className="bg-card border border-border rounded-2xl p-4 hover:border-primary/30 transition-all group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-500/10 flex items-center justify-center">
            <CircleDot className="w-5 h-5 text-slate-500" />
          </div>
          <div>
            <p className="font-semibold text-foreground text-sm">
              {tire.brand && tire.model ? `${tire.brand} ${tire.model}` : tire.brand ?? tire.model ?? 'Pneu'}
            </p>
            <p className="text-xs text-muted-foreground">{tire.size ?? 'Medida não informada'}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          {tire.position && (
            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
              {positionLabels[tire.position]}
            </span>
          )}
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[tire.status]}`}>
            {statusLabels[tire.status]}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground mb-3">
        {tire.purchaseDate && (
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3 h-3" />
            {formatDate(tire.purchaseDate)}
          </div>
        )}
        {tire.installKm != null && (
          <div className="flex items-center gap-1.5">
            <Gauge className="w-3 h-3" />
            {formatKm(tire.installKm)}
          </div>
        )}
        {tire.purchasePrice && (
          <div>Valor: {formatCurrency(parseFloat(tire.purchasePrice))}</div>
        )}
        {tire.dot && <div>DOT: {tire.dot}</div>}
        {tire.estimatedLifeKm && (
          <div>Vida útil: {formatKm(tire.estimatedLifeKm)}</div>
        )}
      </div>

      <div className="flex justify-end pt-2 border-t border-border">
        <button
          onClick={() => onDelete(tire.id)}
          className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all p-1 rounded-lg hover:bg-destructive/10"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
