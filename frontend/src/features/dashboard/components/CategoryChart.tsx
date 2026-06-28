import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { DashboardStats } from '../types/dashboard.types';
import { formatCurrency } from '../../../lib/utils';

interface Props { stats: DashboardStats; }

export function CategoryChart({ stats }: Props) {
  const fuel = parseFloat(stats.monthFueling || '0');
  const maintenance = parseFloat(stats.monthMaintenance || '0');
  const total = fuel + maintenance;

  const data = total > 0
    ? [
        { name: 'Combustível', value: fuel, color: '#22c55e' },
        { name: 'Manutenção', value: maintenance, color: '#6366f1' },
      ].filter((d) => d.value > 0)
    : [{ name: 'Sem gastos', value: 1, color: 'hsl(var(--muted))' }];

  const hasData = total > 0;

  return (
    <div className="bg-card border border-border rounded-2xl p-5">
      <h3 className="font-semibold text-foreground text-sm mb-4">Gastos por categoria</h3>
      <div className="flex items-center gap-4">
        <div className="relative w-28 h-28 flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={32}
                outerRadius={52}
                paddingAngle={hasData ? 3 : 0}
                dataKey="value"
                strokeWidth={0}
              >
                {data.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(v: number) => formatCurrency(v)}
                contentStyle={{
                  background: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          {hasData && (
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <p className="text-[9px] text-muted-foreground">Total</p>
              <p className="text-xs font-bold text-foreground leading-none">{formatCurrency(total)}</p>
              <p className="text-[9px] text-muted-foreground">este mês</p>
            </div>
          )}
        </div>

        <div className="flex-1 space-y-2">
          {hasData ? data.map((entry) => (
            <div key={entry.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: entry.color }} />
                <span className="text-xs text-muted-foreground">{entry.name}</span>
              </div>
              <span className="text-xs font-semibold text-foreground">{formatCurrency(entry.value)}</span>
            </div>
          )) : (
            <p className="text-xs text-muted-foreground">Nenhum gasto este mês</p>
          )}
        </div>
      </div>
    </div>
  );
}
