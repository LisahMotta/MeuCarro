import { Fuel, Wrench, CircleDot, FileText } from 'lucide-react';
import { DashboardData } from '../types/dashboard.types';
import { formatCurrency, formatDate } from '../../../lib/utils';

const docLabels: Record<string, string> = {
  insurance: 'Seguro', ipva: 'IPVA', licensing: 'Licenciamento',
  fine: 'Multa', inspection: 'Vistoria', crlv: 'CRLV', other: 'Outro',
};

interface Props {
  dashboard: DashboardData;
}

export function RecentTransactions({ dashboard }: Props) {
  type Item = { id: string; label: string; subtitle: string; date: string; cost: string; icon: typeof Fuel; iconBg: string; iconColor: string };
  const items: Item[] = [];

  if (dashboard.lastFueling) {
    items.push({
      id: 'fueling',
      label: 'Abastecimento',
      subtitle: 'Combustível',
      date: formatDate(dashboard.lastFueling.date),
      cost: '',
      icon: Fuel,
      iconBg: 'bg-emerald-500/20',
      iconColor: 'text-emerald-400',
    });
  }

  dashboard.recentAlerts.slice(0, 3).forEach((alert) => {
    const isDoc = ['insurance', 'ipva', 'licensing'].includes(alert.type);
    items.push({
      id: alert.id,
      label: alert.title,
      subtitle: isDoc ? 'Documento' : 'Manutenção',
      date: formatDate(alert.createdAt),
      cost: '',
      icon: isDoc ? FileText : alert.type === 'rotation' ? CircleDot : Wrench,
      iconBg: isDoc ? 'bg-violet-500/20' : 'bg-blue-500/20',
      iconColor: isDoc ? 'text-violet-400' : 'text-blue-400',
    });
  });

  if (items.length === 0) return null;

  return (
    <div className="bg-card border border-border rounded-2xl p-5">
      <h3 className="font-semibold text-foreground text-sm mb-4">Últimos lançamentos</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {items.slice(0, 4).map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.id} className="bg-muted/40 rounded-xl p-3 flex flex-col gap-2">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${item.iconBg}`}>
                <Icon className={`w-4 h-4 ${item.iconColor}`} />
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground leading-tight">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.date}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
