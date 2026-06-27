import { Wrench, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { NextServices } from '../types/dashboard.types';
import { formatKm, formatDate } from '../../../lib/utils';

interface Props {
  nextServices: NextServices;
  currentKm: number;
}

function ServiceRow({ label, service, currentKm }: {
  label: string;
  service: NextServices['oilChange'];
  currentKm: number;
}) {
  if (!service) {
    return (
      <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
        <span className="text-sm text-foreground">{label}</span>
        <span className="text-xs text-muted-foreground">Não registrado</span>
      </div>
    );
  }

  const kmUntil = service.nextServiceKm ? service.nextServiceKm - currentKm : null;
  const isOverdue = kmUntil !== null && kmUntil <= 0;
  const isUrgent = kmUntil !== null && kmUntil > 0 && kmUntil <= 500;
  const isWarning = kmUntil !== null && kmUntil > 500 && kmUntil <= 2000;

  const Icon = isOverdue ? AlertTriangle : isUrgent ? Clock : CheckCircle;
  const color = isOverdue ? 'text-red-500' : isUrgent ? 'text-amber-500' : isWarning ? 'text-yellow-500' : 'text-emerald-500';

  return (
    <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
      <div className="flex items-center gap-2">
        <Icon className={`w-4 h-4 ${color}`} />
        <span className="text-sm text-foreground">{label}</span>
      </div>
      <div className="text-right">
        {service.nextServiceKm && (
          <p className={`text-xs font-semibold ${color}`}>
            {isOverdue ? `Atrasado ${formatKm(Math.abs(kmUntil!))}` : `${formatKm(kmUntil!)} restantes`}
          </p>
        )}
        {service.nextServiceDate && (
          <p className="text-xs text-muted-foreground">{formatDate(service.nextServiceDate)}</p>
        )}
        {!service.nextServiceKm && !service.nextServiceDate && (
          <span className="text-xs text-muted-foreground">Sem agendamento</span>
        )}
      </div>
    </div>
  );
}

export function NextServicesCard({ nextServices, currentKm }: Props) {
  return (
    <div className="bg-card border border-border rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Wrench className="w-4 h-4 text-muted-foreground" />
        <h3 className="font-semibold text-foreground">Próximos serviços</h3>
      </div>
      <ServiceRow label="Troca de óleo" service={nextServices.oilChange} currentKm={currentKm} />
      <ServiceRow label="Rodízio" service={nextServices.rotation} currentKm={currentKm} />
      <ServiceRow label="Revisão geral" service={nextServices.revision} currentKm={currentKm} />
    </div>
  );
}
