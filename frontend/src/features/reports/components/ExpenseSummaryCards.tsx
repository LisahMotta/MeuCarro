import { Fuel, Wrench, TrendingDown, BarChart3 } from 'lucide-react';
import { ExpenseReport } from '../types/reports.types';
import { formatCurrency } from '../../../lib/utils';

interface Props { report: ExpenseReport; }

export function ExpenseSummaryCards({ report }: Props) {
  const cards = [
    {
      label: 'Total geral',
      value: formatCurrency(report.grandTotal),
      sub: `${report.year}`,
      icon: BarChart3,
      color: 'text-violet-500',
      bg: 'bg-violet-500/10',
    },
    {
      label: 'Combustível',
      value: formatCurrency(report.fuel.total),
      sub: `${report.fuel.count} abastecimentos · ${report.fuel.liters.toFixed(0)}L`,
      icon: Fuel,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
    },
    {
      label: 'Manutenções',
      value: formatCurrency(report.maintenance.total),
      sub: `${report.maintenance.count} serviços`,
      icon: Wrench,
      color: 'text-orange-500',
      bg: 'bg-orange-500/10',
    },
    {
      label: 'Consumo médio',
      value: report.fuel.avgConsumption > 0 ? `${report.fuel.avgConsumption.toFixed(2)} km/L` : '—',
      sub: report.fuel.avgPrice > 0 ? `Preço médio: R$ ${report.fuel.avgPrice.toFixed(3)}/L` : 'Sem dados',
      icon: TrendingDown,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
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
          <p className="text-xs text-muted-foreground/70 mt-0.5">{card.sub}</p>
        </div>
      ))}
    </div>
  );
}
