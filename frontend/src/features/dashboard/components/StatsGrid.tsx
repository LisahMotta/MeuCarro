import { Calendar, DollarSign, TrendingUp } from 'lucide-react';
import { DashboardStats } from '../types/dashboard.types';
import { formatCurrency } from '../../../lib/utils';

interface Props { stats: DashboardStats; }

export function StatsGrid({ stats }: Props) {
  const cards = [
    {
      label: 'Gasto do mês',
      value: formatCurrency(parseFloat(stats.monthTotal || '0')),
      sub: '↑ vs mês anterior',
      icon: Calendar,
      iconBg: 'bg-orange-500/20',
      iconColor: 'text-orange-400',
    },
    {
      label: 'Gasto do ano',
      value: formatCurrency(parseFloat(stats.yearTotal || '0')),
      sub: '↑ vs ano anterior',
      icon: Calendar,
      iconBg: 'bg-violet-500/20',
      iconColor: 'text-violet-400',
    },
    {
      label: 'Total gasto',
      value: formatCurrency(parseFloat(stats.allTimeTotal || '0')),
      sub: 'Desde o primeiro registro',
      icon: DollarSign,
      iconBg: 'bg-emerald-500/20',
      iconColor: 'text-emerald-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((card) => (
        <div key={card.label} className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl ${card.iconBg} flex items-center justify-center flex-shrink-0`}>
            <card.icon className={`w-6 h-6 ${card.iconColor}`} />
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-0.5">{card.label}</p>
            <p className="text-xl font-bold text-foreground leading-none">{card.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{card.sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
