import { Fuel, Wrench, Circle, FileText, Loader2 } from 'lucide-react';
import { HistoryEvent } from '../types/reports.types';
import { formatCurrency, formatDate, formatKm } from '../../../lib/utils';
import { categoryLabels } from '../../maintenances/utils/category.utils';

const eventConfig = {
  fueling: {
    icon: Fuel,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    label: 'Abastecimento',
  },
  maintenance: {
    icon: Wrench,
    color: 'text-orange-500',
    bg: 'bg-orange-500/10',
    label: 'Manutenção',
  },
  tire_event: {
    icon: Circle,
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
    label: 'Pneus',
  },
  document: {
    icon: FileText,
    color: 'text-violet-500',
    bg: 'bg-violet-500/10',
    label: 'Documento',
  },
};

const tireEventLabels: Record<string, string> = {
  calibration: 'Calibragem',
  rotation: 'Rodízio',
  replacement: 'Substituição',
  alignment: 'Alinhamento',
  balancing: 'Balanceamento',
};

const docTypeLabels: Record<string, string> = {
  insurance: 'Seguro', ipva: 'IPVA', licensing: 'Licenciamento',
  fine: 'Multa', inspection: 'Vistoria', crlv: 'CRLV', other: 'Outro',
};

function getSubtitle(event: HistoryEvent): string {
  if (event.type === 'maintenance' && event.meta.category) {
    return (categoryLabels as Record<string, string>)[event.meta.category as string] ?? String(event.meta.category);
  }
  if (event.type === 'tire_event' && event.meta.eventType) {
    return tireEventLabels[event.meta.eventType as string] ?? String(event.meta.eventType);
  }
  if (event.type === 'document' && event.meta.docType) {
    return docTypeLabels[event.meta.docType as string] ?? String(event.meta.docType);
  }
  if (event.type === 'fueling' && event.meta.consumption) {
    return `${(event.meta.consumption as number).toFixed(2)} km/L`;
  }
  return event.subtitle ?? '';
}

interface Props {
  events: HistoryEvent[];
  isLoading: boolean;
}

export function HistoryTimeline({ events, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!events.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-muted-foreground text-sm">Nenhum evento registrado</p>
      </div>
    );
  }

  let lastMonth = '';

  return (
    <div className="space-y-1">
      {events.map((event) => {
        const config = eventConfig[event.type];
        const Icon = config.icon;
        const date = new Date(event.date + 'T00:00:00');
        const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
        const showMonth = monthKey !== lastMonth;
        lastMonth = monthKey;
        const monthLabel = date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
        const subtitle = getSubtitle(event);

        return (
          <div key={`${event.type}-${event.id}`}>
            {showMonth && (
              <div className="pt-4 pb-2 first:pt-0">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider capitalize">
                  {monthLabel}
                </p>
              </div>
            )}
            <div className="flex items-start gap-3 py-3 border-b border-border last:border-0">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${config.bg}`}>
                <Icon className={`w-4 h-4 ${config.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium text-foreground leading-tight">{event.title}</p>
                    {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
                    <div className="flex items-center gap-3 mt-1">
                      <p className="text-xs text-muted-foreground">{formatDate(event.date)}</p>
                      {event.odometer !== undefined && (
                        <p className="text-xs text-muted-foreground">{formatKm(event.odometer)}</p>
                      )}
                    </div>
                  </div>
                  {event.amount > 0 && (
                    <p className="text-sm font-semibold text-foreground flex-shrink-0">
                      {formatCurrency(event.amount)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
