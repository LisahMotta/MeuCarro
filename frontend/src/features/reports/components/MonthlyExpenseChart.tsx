import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import { MonthExpense } from '../types/reports.types';
import { formatCurrency } from '../../../lib/utils';

const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

interface Props { months: MonthExpense[]; }

export function MonthlyExpenseChart({ months }: Props) {
  const chartData = months.map((d) => ({
    month: monthNames[d.month - 1],
    Combustível: d.fuelTotal,
    Manutenção: d.maintTotal,
  }));

  const hasData = months.some((m) => m.total > 0);

  if (!hasData) {
    return (
      <div className="bg-card border border-border rounded-2xl p-6">
        <h3 className="font-semibold text-foreground mb-4">Gastos mensais</h3>
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">
          Nenhum gasto registrado neste período
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <h3 className="font-semibold text-foreground mb-6">Gastos mensais</h3>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={chartData} barGap={4}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
          <YAxis
            tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
            axisLine={false} tickLine={false}
            tickFormatter={(v) => `R$${v}`}
          />
          <Tooltip
            formatter={(v: number) => formatCurrency(v)}
            contentStyle={{
              background: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '12px',
              fontSize: '12px',
            }}
          />
          <Legend wrapperStyle={{ fontSize: '12px' }} />
          <Bar dataKey="Combustível" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Manutenção" fill="hsl(217.2 32.6% 50%)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
