import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { CategoryExpense } from '../types/reports.types';
import { formatCurrency } from '../../../lib/utils';
import { categoryLabels } from '../../maintenances/utils/category.utils';

const COLORS = [
  '#6366f1', '#f59e0b', '#10b981', '#ef4444', '#3b82f6',
  '#8b5cf6', '#ec4899', '#14b8a6', '#f97316', '#84cc16',
];

interface Props { byCategory: CategoryExpense[]; total: number; }

export function CategoryBreakdown({ byCategory, total }: Props) {
  if (!byCategory.length) {
    return (
      <div className="bg-card border border-border rounded-2xl p-6">
        <h3 className="font-semibold text-foreground mb-4">Manutenções por categoria</h3>
        <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
          Nenhuma manutenção registrada
        </div>
      </div>
    );
  }

  const chartData = byCategory.map((c) => ({
    name: (categoryLabels as Record<string, string>)[c.category] ?? c.category,
    value: c.total,
  }));

  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <h3 className="font-semibold text-foreground mb-6">Manutenções por categoria</h3>
      <div className="flex flex-col lg:flex-row gap-6 items-center">
        <ResponsiveContainer width={200} height={200}>
          <PieChart>
            <Pie data={chartData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
              {chartData.map((_, idx) => (
                <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(v: number) => formatCurrency(v)} contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px', fontSize: '12px' }} />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex-1 space-y-2 w-full">
          {byCategory.map((c, idx) => (
            <div key={c.category} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: COLORS[idx % COLORS.length] }} />
                <span className="text-sm text-foreground">{(categoryLabels as Record<string, string>)[c.category] ?? c.category}</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-medium text-foreground">{formatCurrency(c.total)}</span>
                <span className="text-xs text-muted-foreground ml-2">
                  {total > 0 ? `${((c.total / total) * 100).toFixed(0)}%` : '0%'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
