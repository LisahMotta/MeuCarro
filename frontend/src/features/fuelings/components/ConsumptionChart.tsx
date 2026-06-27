import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Fueling } from '../types/fueling.types';

const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

interface Props {
  fuelings: Fueling[];
}

export function ConsumptionChart({ fuelings }: Props) {
  const data = fuelings
    .filter((f) => f.consumption)
    .slice(0, 20)
    .reverse()
    .map((f) => ({
      date: new Date(f.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
      consumo: parseFloat(f.consumption!).toFixed(2),
      preco: parseFloat(f.pricePerLiter).toFixed(3),
    }));

  if (data.length < 2) {
    return (
      <div className="bg-card border border-border rounded-2xl p-6">
        <h3 className="font-semibold text-foreground mb-4">Evolução do consumo</h3>
        <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
          Registre ao menos 2 abastecimentos de tanque cheio para ver o gráfico
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <h3 className="font-semibold text-foreground mb-4">Evolução do consumo (km/L)</h3>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
          <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
          <Tooltip
            contentStyle={{
              background: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '12px',
              fontSize: '12px',
            }}
          />
          <Line
            type="monotone"
            dataKey="consumo"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            dot={{ fill: 'hsl(var(--primary))', r: 4 }}
            name="km/L"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
