import { useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { MonthlyExpense } from '../types/dashboard.types';
import { formatCurrency } from '../../../lib/utils';

const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

interface Props { data: MonthlyExpense[]; }

export function MonthlyChart({ data }: Props) {
  const [period, setPeriod] = useState(6);

  const filtered = data.slice(-period).map((d) => ({
    month: monthNames[d.month - 1],
    total: d.total,
  }));

  const hasData = filtered.some((d) => d.total > 0);

  return (
    <div className="bg-card border border-border rounded-2xl p-5">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-semibold text-foreground text-sm">Gastos nos últimos {period} meses</h3>
        <div className="flex gap-1">
          {[3, 6, 12].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`text-xs px-2.5 py-1 rounded-lg transition-all ${
                period === p
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              {p}m
            </button>
          ))}
        </div>
      </div>

      {hasData ? (
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={filtered} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`}
              width={42}
            />
            <Tooltip
              formatter={(v: number) => [formatCurrency(v), 'Total']}
              contentStyle={{
                background: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '10px',
                fontSize: '12px',
              }}
            />
            <Bar dataKey="total" fill="hsl(var(--primary))" radius={[5, 5, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-44 flex items-center justify-center text-muted-foreground text-sm">
          Nenhum gasto registrado
        </div>
      )}
    </div>
  );
}
