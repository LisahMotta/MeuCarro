import { Wrench, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { NextServices } from '../types/dashboard.types';
import { formatKm, formatDate } from '../../../lib/utils';

const serviceConfig = [
  { key: 'oilChange' as const, label: 'Troca de óleo', color: 'bg-orange-500/20 text-orange-400' },
  { key: 'rotation' as const, label: 'Rodízio dos pneus', color: 'bg-blue-500/20 text-blue-400' },
  { key: 'revision' as const, label: 'Revisão preventiva', color: 'bg-emerald-500/20 text-emerald-400' },
];

interface Props {
  nextServices: NextServices;
  currentKm: number;
}

export function NextMaintenancesPanel({ nextServices, currentKm }: Props) {
  const navigate = useNavigate();
  const items = serviceConfig
    .map(({ key, label, color }) => ({ service: nextServices[key], label, color }))
    .filter(({ service }) => service !== null);

  return (
    <div className="bg-card border border-border rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground text-sm">Próximas manutenções</h3>
        <button
          onClick={() => navigate('/maintenances')}
          className="flex items-center gap-1 text-xs text-primary hover:underline"
        >
          Ver todas <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      {items.length === 0 ? (
        <p className="text-xs text-muted-foreground text-center py-4">Nenhuma manutenção registrada</p>
      ) : (
        <div className="space-y-3">
          {items.map(({ service, label, color }) => {
            if (!service) return null;
            const kmUntil = service.nextServiceKm ? service.nextServiceKm - currentKm : null;
            const isOverdue = kmUntil !== null && kmUntil <= 0;
            const badgeColor = isOverdue
              ? 'bg-red-500/20 text-red-400'
              : kmUntil !== null && kmUntil <= 1000
              ? 'bg-amber-500/20 text-amber-400'
              : 'bg-emerald-500/20 text-emerald-400';

            return (
              <div key={label} className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
                  <Wrench className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground">{label}</p>
                  <p className="text-xs text-muted-foreground">
                    {service.nextServiceKm && `${formatKm(service.nextServiceKm)}`}
                    {service.nextServiceDate && ` ou ${formatDate(service.nextServiceDate)}`}
                  </p>
                </div>
                {kmUntil !== null && (
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${badgeColor}`}>
                    {isOverdue ? 'Vencido' : `${formatKm(kmUntil)}`}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
