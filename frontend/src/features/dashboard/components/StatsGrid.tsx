import { DollarSign, TrendingUp, Gauge, Activity } from 'lucide-react';
import { DashboardStats } from '../types/dashboard.types';
import { formatCurrency, formatKm } from '../../../lib/utils';

interface Props { stats: DashboardStats; }

export function StatsGrid({ stats }: Props) {
  const cards = [
    {
      label: 'Gasto do mês',
      value: formatCurrency(parseFloat(stats.monthTotal)),
      sub: `Combustível: ${formatCurrency(parseFloat(stats.monthFueling))}`,
      icon: DollarSign,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
    },
    {
      label: 'Total no veículo',
      value: formatCurrency(parseFloat(stats.allTimeTotal)),
      sub: `Ano atual: ${formatCurrency(parseFloat(stats.yearTotal))}`,
      icon: Activity,
      color: 'text-violet-500',
      bg: 'bg-violet-500/10',
    },
    {
      label: 'Consumo médio',
      value: parseFloat(stats.avgConsumption) > 0
        ? `${parseFloat(stats.avgConsumption).toFixed(2)} km/L`
        : '—',
      sub: 'Tanques cheios',
      icon: TrendingUp,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
    },
    {
      label: 'Custo por km',
      value: parseFloat(stats.costPerKm) > 0
        ? `R$ ${parseFloat(stats.costPerKm).toFixed(3)}`
        : '—',
      sub: `${formatKm(stats.currentKm)} rodados`,
      icon: Gauge,
      color: 'text-orange-500',
      bg: 'bg-orange-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div key={card.label} className="bg-card border border-border rounded-2xl p-5">
          <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center mb-4`}>
            <card.icon className={`w-5 h-5 ${card.color}`} />
          </div>
          <p className="text-2xl font-bold text-foreground leading-none mb-1">{card.value}</p>
          <p className="text-xs text-muted-foreground mt-1">{card.label}</p>
          {card.sub && <p className="text-xs text-muted-foreground/70 mt-0.5">{card.sub}</p>}
        </div>
      ))}
    </div>
  );
}
