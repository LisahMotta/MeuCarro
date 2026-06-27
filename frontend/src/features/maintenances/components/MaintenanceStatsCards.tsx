import { Wrench, DollarSign, Hammer, Package } from 'lucide-react';
import { MaintenanceStats } from '../types/maintenance.types';
import { formatCurrency } from '../../../lib/utils';

interface Props {
  stats: MaintenanceStats;
}

export function MaintenanceStatsCards({ stats }: Props) {
  const cards = [
    { label: 'Total gasto', value: formatCurrency(parseFloat(stats.totalCost)), icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Mão de obra', value: formatCurrency(parseFloat(stats.totalLaborCost)), icon: Hammer, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Peças', value: formatCurrency(parseFloat(stats.totalPartsCost)), icon: Package, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { label: 'Manutenções', value: String(stats.count), icon: Wrench, color: 'text-violet-500', bg: 'bg-violet-500/10' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div key={card.label} className="bg-card border border-border rounded-2xl p-4">
          <div className={`w-9 h-9 rounded-xl ${card.bg} flex items-center justify-center mb-3`}>
            <card.icon className={`w-4 h-4 ${card.color}`} />
          </div>
          <p className="text-2xl font-bold text-foreground leading-none mb-1">{card.value}</p>
          <p className="text-xs text-muted-foreground">{card.label}</p>
        </div>
      ))}
    </div>
  );
}
