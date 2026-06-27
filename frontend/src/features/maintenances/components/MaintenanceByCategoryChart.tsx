import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { MaintenanceStats } from '../types/maintenance.types';
import { categoryLabels } from '../utils/category.utils';
import { formatCurrency } from '../../../lib/utils';

const COLORS = ['#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#10b981', '#06b6d4', '#f97316', '#ec4899'];

interface Props {
  stats: MaintenanceStats;
}

export function MaintenanceByCategoryChart({ stats }: Props) {
  const data = stats.byCategory
    .filter((c) => parseFloat(c.totalCost) > 0)
    .slice(0, 8)
    .map((c) => ({
      name: categoryLabels[c.category],
      value: parseFloat(c.totalCost),
    }));

  if (!data.length) return null;

  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <h3 className="font-semibold text-foreground mb-4">Gastos por categoria</h3>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" outerRadius={80} dataKey="value" nameKey="name">
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(v: number) => formatCurrency(v)}
            contentStyle={{
              background: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '12px',
              fontSize: '12px',
            }}
          />
          <Legend wrapperStyle={{ fontSize: '11px' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
