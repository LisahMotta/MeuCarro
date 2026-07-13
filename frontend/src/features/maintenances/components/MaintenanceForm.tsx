import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { MaintenanceCategory, Maintenance } from '../types/maintenance.types';
import { categoryLabels, categoryGroups } from '../utils/category.utils';

const schema = z.object({
  date: z.string().min(1, 'Obrigatório'),
  odometer: z.number().int().min(0),
  category: z.string().min(1, 'Obrigatório'),
  shopName: z.string().optional(),
  mechanicName: z.string().optional(),
  laborCost: z.number().min(0).default(0),
  partsCost: z.number().min(0).default(0),
  totalCost: z.number().min(0),
  warrantyUntil: z.string().optional(),
  nextServiceDate: z.string().optional(),
  nextServiceKm: z.number().int().min(0).optional(),
  notes: z.string().optional(),
  status: z.enum(['completed', 'scheduled', 'overdue']).default('completed'),
});

type FormData = z.infer<typeof schema>;

interface Props {
  maintenance?: Maintenance;
  vehicleCurrentKm?: number;
  onSubmit: (data: FormData) => Promise<void>;
  isLoading?: boolean;
}

const KM_INTERVAL_CATEGORIES = new Set(['oil_change', 'air_filter', 'fuel_filter', 'timing_belt']);

export function MaintenanceForm({ maintenance, vehicleCurrentKm, onSubmit, isLoading }: Props) {
  const isEditing = !!maintenance;
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: maintenance
      ? {
          date: maintenance.date,
          odometer: maintenance.odometer,
          category: maintenance.category,
          shopName: maintenance.shopName ?? '',
          mechanicName: maintenance.mechanicName ?? '',
          laborCost: parseFloat(maintenance.laborCost),
          partsCost: parseFloat(maintenance.partsCost),
          totalCost: parseFloat(maintenance.totalCost),
          warrantyUntil: maintenance.warrantyUntil ?? '',
          nextServiceDate: maintenance.nextServiceDate ?? '',
          nextServiceKm: maintenance.nextServiceKm ?? undefined,
          notes: maintenance.notes ?? '',
          status: maintenance.status as 'completed' | 'scheduled' | 'overdue',
        }
      : {
          date: new Date().toISOString().split('T')[0],
          odometer: vehicleCurrentKm ?? 0,
          laborCost: 0,
          partsCost: 0,
          totalCost: 0,
          status: 'completed',
        },
  });

  const laborCost = watch('laborCost');
  const partsCost = watch('partsCost');
  const category = watch('category');
  const showKmInterval = KM_INTERVAL_CATEGORIES.has(category);

  useEffect(() => {
    const total = (laborCost || 0) + (partsCost || 0);
    setValue('totalCost', parseFloat(total.toFixed(2)));
  }, [laborCost, partsCost, setValue]);

  const inputCls = 'w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all text-sm';
  const labelCls = 'text-sm font-medium text-foreground block mb-1.5';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Categoria */}
      <div>
        <label className={labelCls}>Categoria *</label>
        <select {...register('category')} className={inputCls}>
          <option value="">Selecione uma categoria</option>
          {categoryGroups.map((group) => (
            <optgroup key={group.label} label={group.label}>
              {group.items.map((cat) => (
                <option key={cat} value={cat}>{categoryLabels[cat]}</option>
              ))}
            </optgroup>
          ))}
        </select>
        {errors.category && <p className="text-destructive text-xs mt-1">{errors.category.message}</p>}
      </div>

      {/* Data e KM */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Registro</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Data *</label>
            <input {...register('date')} type="date" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Quilometragem *</label>
            <input {...register('odometer', { valueAsNumber: true })} type="number" placeholder="0" className={inputCls} />
          </div>
        </div>
      </div>

      {/* Oficina */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Oficina</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Nome da oficina</label>
            <input {...register('shopName')} placeholder="Ex: Auto Center Silva" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Mecânico</label>
            <input {...register('mechanicName')} placeholder="Nome do mecânico" className={inputCls} />
          </div>
        </div>
      </div>

      {/* Custos */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Custos</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className={labelCls}>Mão de obra (R$)</label>
            <input {...register('laborCost', { valueAsNumber: true })} type="number" step="0.01" placeholder="0,00" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Peças (R$)</label>
            <input {...register('partsCost', { valueAsNumber: true })} type="number" step="0.01" placeholder="0,00" className={inputCls} />
          </div>
          <div className="bg-muted/50 rounded-xl p-3 border border-border">
            <label className={labelCls}>Total (R$)</label>
            <input {...register('totalCost', { valueAsNumber: true })} type="number" step="0.01" className={inputCls} />
          </div>
        </div>
      </div>

      {/* Próximo serviço */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Próximo serviço</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Data prevista</label>
            <input {...register('nextServiceDate')} type="date" className={inputCls} />
          </div>
          {showKmInterval ? (
            <div>
              <label className={labelCls}>Quilometragem prevista *</label>
              <input {...register('nextServiceKm', { valueAsNumber: true })} type="number" placeholder="Ex: 60000" className={inputCls} />
              {errors.nextServiceKm && <p className="text-destructive text-xs mt-1">{errors.nextServiceKm.message}</p>}
            </div>
          ) : (
            <div>
              <label className={labelCls}>Quilometragem prevista <span className="text-muted-foreground font-normal">(opcional)</span></label>
              <input {...register('nextServiceKm', { valueAsNumber: true })} type="number" placeholder="Ex: 60000" className={inputCls} />
            </div>
          )}
          <div>
            <label className={labelCls}>Garantia até</label>
            <input {...register('warrantyUntil')} type="date" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Status</label>
            <select {...register('status')} className={inputCls}>
              <option value="completed">Realizado</option>
              <option value="scheduled">Agendado</option>
              <option value="overdue">Atrasado</option>
            </select>
          </div>
        </div>
      </div>

      {/* Observações */}
      <div>
        <label className={labelCls}>Observações</label>
        <textarea {...register('notes')} rows={3} placeholder="Detalhes da manutenção..." className={`${inputCls} resize-none`} />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
        {isLoading ? 'Salvando...' : isEditing ? 'Salvar alterações' : 'Registrar manutenção'}
      </button>
    </form>
  );
}
