import { Fuel, TrendingUp, DollarSign, Droplets } from 'lucide-react';
import { FuelingStats } from '../types/fueling.types';
import { formatCurrency } from '../../../lib/utils';

interface Props {
  stats: FuelingStats;
}

export function FuelingStatsCards({ stats }: Props) {
  const cards = [
    {
      label: 'Total gasto',
      value: formatCurrency(parseFloat(stats.totalCost)),
      icon: DollarSign,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
    },
    {
      label: 'Total abastecido',
      value: `${parseFloat(stats.totalLiters).toFixed(1)}L`,
      icon: Droplets,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
    },
    {
      label: 'Consumo médio',
      value: parseFloat(stats.avgConsumption) > 0
        ? `${parseFloat(stats.avgConsumption).toFixed(2)} km/L`
        : '—',
      icon: TrendingUp,
      color: 'text-violet-500',
      bg: 'bg-violet-500/10',
    },
    {
      label: 'Preço médio/L',
      value: parseFloat(stats.avgPricePerLiter) > 0
        ? `R$ ${parseFloat(stats.avgPricePerLiter).toFixed(3)}`
        : '—',
      icon: Fuel,
      color: 'text-orange-500',
      bg: 'bg-orange-500/10',
    },
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
