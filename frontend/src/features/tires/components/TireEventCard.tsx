import { RotateCcw, Gauge, Wrench, RefreshCw, Calendar } from 'lucide-react';
import { TireEvent, TireEventType } from '../types/tire.types';
import { formatCurrency, formatDate, formatKm } from '../../../lib/utils';

const eventConfig: Record<TireEventType, { label: string; icon: typeof RotateCcw; color: string }> = {
  rotation: { label: 'Rodízio', icon: RotateCcw, color: 'text-blue-500 bg-blue-500/10' },
  calibration: { label: 'Calibragem', icon: Gauge, color: 'text-cyan-500 bg-cyan-500/10' },
  repair: { label: 'Reparo', icon: Wrench, color: 'text-orange-500 bg-orange-500/10' },
  replacement: { label: 'Substituição', icon: RefreshCw, color: 'text-violet-500 bg-violet-500/10' },
};

interface Props { event: TireEvent; }

export function TireEventCard({ event }: Props) {
  const config = eventConfig[event.type];

  const hasPressure = event.pressureFL || event.pressureFR || event.pressureRL || event.pressureRR;

  return (
    <div className="bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-all">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${config.color}`}>
            <config.icon className="w-4 h-4" />
          </div>
          <div>
            <p className="font-semibold text-sm text-foreground">{config.label}</p>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="w-3 h-3" />
              {formatDate(event.date)}
              {event.odometer != null && <span>· {formatKm(event.odometer)}</span>}
            </div>
          </div>
        </div>
        {event.cost && (
          <p className="font-bold text-foreground text-sm">{formatCurrency(parseFloat(event.cost))}</p>
        )}
      </div>

      {hasPressure && (
        <div className="grid grid-cols-4 gap-2 mt-3 bg-muted/50 rounded-lg p-2">
          {(['FL', 'FR', 'RL', 'RR'] as const).map((pos) => {
            const val = event[`pressure${pos}` as keyof TireEvent];
            return (
              <div key={pos} className="text-center">
                <p className="text-xs text-muted-foreground">{pos}</p>
                <p className="text-sm font-semibold text-foreground">{val ? `${val} PSI` : '—'}</p>
              </div>
            );
          })}
        </div>
      )}

      {event.notes && <p className="text-xs text-muted-foreground mt-2">{event.notes}</p>}
    </div>
  );
}
