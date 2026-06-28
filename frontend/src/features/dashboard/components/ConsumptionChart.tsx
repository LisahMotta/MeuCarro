import { useState } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from 'recharts';
import { MonthlyExpense } from '../types/dashboard.types';

const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

interface Props {
  data: MonthlyExpense[];
  avgConsumption: string;
}

export function ConsumptionChart({ data, avgConsumption }: Props) {
  const [period, setPeriod] = useState(6);
  const avg = parseFloat(avgConsumption || '0');

  const chartData = data.slice(-period).map((d) => ({
    month: monthNames[d.month - 1],
    consumo: d.consumption ?? null,
  }));

  const hasData = chartData.some((d) => d.consumo !== null && d.consumo > 0);

  return (
    <div className="bg-card border border-border rounded-2xl p-5">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-foreground text-sm">Consumo médio</h3>
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

      {avg > 0 && (
        <div className="mb-4">
          <span className="text-3xl font-bold text-foreground">{avg.toFixed(1)}</span>
          <span className="text-muted-foreground text-sm ml-1">km/L</span>
          <p className="text-xs text-muted-foreground mt-0.5">Média geral</p>
        </div>
      )}

      {hasData ? (
        <ResponsiveContainer width="100%" height={140}>
          <LineChart data={chartData}>
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
              unit=" km/L"
              width={52}
            />
            <Tooltip
              formatter={(v: number) => [`${v?.toFixed(1)} km/L`, 'Consumo']}
              contentStyle={{
                background: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '10px',
                fontSize: '12px',
              }}
            />
            {avg > 0 && (
              <ReferenceLine y={avg} stroke="hsl(var(--primary))" strokeDasharray="4 4" />
            )}
            <Line
              type="monotone"
              dataKey="consumo"
              stroke="hsl(var(--primary))"
              strokeWidth={2.5}
              dot={{ fill: 'hsl(var(--primary))', r: 4, strokeWidth: 0 }}
              activeDot={{ r: 6 }}
              connectNulls={false}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-36 flex items-center justify-center text-muted-foreground text-sm">
          {avg > 0 ? 'Dados mensais insuficientes' : 'Registre abastecimentos com tanque cheio para calcular consumo'}
        </div>
      )}
    </div>
  );
}
