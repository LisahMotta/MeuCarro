import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';

const schema = z.object({
  date: z.string().min(1),
  odometer: z.number().int().min(0).optional(),
  type: z.enum(['rotation', 'calibration', 'repair', 'replacement']),
  pressureFL: z.number().min(0).max(99).optional(),
  pressureFR: z.number().min(0).max(99).optional(),
  pressureRL: z.number().min(0).max(99).optional(),
  pressureRR: z.number().min(0).max(99).optional(),
  cost: z.number().min(0).optional(),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface Props {
  vehicleCurrentKm?: number;
  onSubmit: (data: FormData) => Promise<void>;
  isLoading?: boolean;
  onCancel: () => void;
}

export function TireEventForm({ vehicleCurrentKm, onSubmit, isLoading, onCancel }: Props) {
  const { register, handleSubmit, watch } = useForm<FormData>({
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      odometer: vehicleCurrentKm,
      type: 'calibration',
    },
  });

  const type = watch('type');
  const showPressure = type === 'calibration';

  const inputCls = 'w-full px-3 py-2.5 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all text-sm';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-medium block mb-1.5">Tipo *</label>
          <select {...register('type')} className={inputCls}>
            <option value="calibration">Calibragem</option>
            <option value="rotation">Rodízio</option>
            <option value="repair">Reparo</option>
            <option value="replacement">Substituição</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-medium block mb-1.5">Data *</label>
          <input {...register('date')} type="date" className={inputCls} />
        </div>
        <div>
          <label className="text-sm font-medium block mb-1.5">Quilometragem</label>
          <input {...register('odometer', { valueAsNumber: true })} type="number" className={inputCls} />
        </div>
        <div>
          <label className="text-sm font-medium block mb-1.5">Custo (R$)</label>
          <input {...register('cost', { valueAsNumber: true })} type="number" step="0.01" className={inputCls} />
        </div>
      </div>

      {showPressure && (
        <div>
          <p className="text-sm font-medium mb-2">Pressão dos pneus (PSI)</p>
          <div className="grid grid-cols-4 gap-2">
            {(['FL', 'FR', 'RL', 'RR'] as const).map((pos) => (
              <div key={pos} className="text-center">
                <label className="text-xs text-muted-foreground block mb-1">{pos}</label>
                <input
                  {...register(`pressure${pos}` as any, { valueAsNumber: true })}
                  type="number"
                  step="0.1"
                  placeholder="32"
                  className={`${inputCls} text-center`}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <label className="text-sm font-medium block mb-1.5">Observações</label>
        <textarea {...register('notes')} rows={2} className={`${inputCls} resize-none`} />
      </div>

      <div className="flex gap-3">
        <button type="button" onClick={onCancel} className="flex-1 py-2.5 rounded-xl border border-border text-foreground hover:bg-muted transition-all text-sm font-medium">
          Cancelar
        </button>
        <button type="submit" disabled={isLoading} className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm">
          {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
          Registrar
        </button>
      </div>
    </form>
  );
}
