import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { FuelType } from '../../vehicles/types/vehicle.types';

const schema = z.object({
  date: z.string().min(1, 'Obrigatório'),
  odometer: z.number().int().min(0, 'Obrigatório'),
  stationName: z.string().optional(),
  city: z.string().optional(),
  fuelType: z.enum(['gasoline', 'ethanol', 'flex', 'diesel', 'electric', 'hybrid']),
  liters: z.number().min(0.001, 'Obrigatório'),
  pricePerLiter: z.number().min(0.001, 'Obrigatório'),
  totalCost: z.number().min(0.01, 'Obrigatório'),
  fullTank: z.boolean(),
  partialTank: z.boolean(),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const fuelLabels: Record<FuelType, string> = {
  gasoline: 'Gasolina', ethanol: 'Etanol', flex: 'Flex',
  diesel: 'Diesel', electric: 'Elétrico', hybrid: 'Híbrido',
};

interface Props {
  vehicleCurrentKm?: number;
  vehicleFuelType?: FuelType;
  onSubmit: (data: FormData) => Promise<void>;
  isLoading?: boolean;
}

export function FuelingForm({ vehicleCurrentKm, vehicleFuelType, onSubmit, isLoading }: Props) {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      odometer: vehicleCurrentKm ?? 0,
      fuelType: vehicleFuelType ?? 'flex',
      fullTank: true,
      partialTank: false,
    },
  });

  const liters = watch('liters');
  const pricePerLiter = watch('pricePerLiter');
  const fullTank = watch('fullTank');

  // Auto-calculate total cost
  useEffect(() => {
    if (liters > 0 && pricePerLiter > 0) {
      setValue('totalCost', parseFloat((liters * pricePerLiter).toFixed(2)));
    }
  }, [liters, pricePerLiter, setValue]);

  const inputCls = 'w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all text-sm';
  const labelCls = 'text-sm font-medium text-foreground block mb-1.5';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Tipo de tanque */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Tipo de abastecimento</h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { key: 'fullTank', label: 'Tanque cheio', desc: 'Calcula consumo' },
            { key: 'partialTank', label: 'Parcial', desc: 'Não calcula consumo' },
          ].map(({ key, label, desc }) => (
            <label key={key}
              className={`flex flex-col gap-1 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                watch(key as 'fullTank' | 'partialTank')
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/40'
              }`}
            >
              <input type="checkbox" {...register(key as 'fullTank' | 'partialTank')} className="sr-only" />
              <span className="font-semibold text-sm text-foreground">{label}</span>
              <span className="text-xs text-muted-foreground">{desc}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Data e KM */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Registro</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Data *</label>
            <input {...register('date')} type="date" className={inputCls} />
            {errors.date && <p className="text-destructive text-xs mt-1">{errors.date.message}</p>}
          </div>
          <div>
            <label className={labelCls}>Quilometragem *</label>
            <input {...register('odometer', { valueAsNumber: true })} type="number" placeholder="Ex: 50000" className={inputCls} />
            {errors.odometer && <p className="text-destructive text-xs mt-1">{errors.odometer.message}</p>}
          </div>
        </div>
      </div>

      {/* Posto */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Posto</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Nome do posto</label>
            <input {...register('stationName')} placeholder="Ex: Ipiranga" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Cidade</label>
            <input {...register('city')} placeholder="Ex: São Paulo" className={inputCls} />
          </div>
        </div>
      </div>

      {/* Combustível */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Combustível</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className={labelCls}>Tipo *</label>
            <select {...register('fuelType')} className={inputCls}>
              {(Object.entries(fuelLabels) as [FuelType, string][]).map(([val, label]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>Litros *</label>
            <input {...register('liters', { valueAsNumber: true })} type="number" step="0.001" placeholder="0.000" className={inputCls} />
            {errors.liters && <p className="text-destructive text-xs mt-1">{errors.liters.message}</p>}
          </div>
          <div>
            <label className={labelCls}>Preço/litro *</label>
            <input {...register('pricePerLiter', { valueAsNumber: true })} type="number" step="0.001" placeholder="0.000" className={inputCls} />
            {errors.pricePerLiter && <p className="text-destructive text-xs mt-1">{errors.pricePerLiter.message}</p>}
          </div>
        </div>
      </div>

      {/* Total */}
      <div className="bg-muted/50 rounded-xl p-4 border border-border">
        <label className={labelCls}>Valor total (R$) *</label>
        <input {...register('totalCost', { valueAsNumber: true })} type="number" step="0.01" placeholder="0.00" className={inputCls} />
        {errors.totalCost && <p className="text-destructive text-xs mt-1">{errors.totalCost.message}</p>}
        <p className="text-xs text-muted-foreground mt-1">Calculado automaticamente a partir dos litros × preço/litro</p>
      </div>

      {/* Observações */}
      <div>
        <label className={labelCls}>Observações</label>
        <textarea {...register('notes')} rows={3} placeholder="Informações adicionais..." className={`${inputCls} resize-none`} />
      </div>

      {fullTank && (
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
          <p className="text-sm text-primary font-medium">Tanque cheio selecionado</p>
          <p className="text-xs text-muted-foreground mt-1">O consumo (km/L), autonomia e custo por km serão calculados automaticamente com base no último abastecimento de tanque cheio.</p>
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
        {isLoading ? 'Registrando...' : 'Registrar abastecimento'}
      </button>
    </form>
  );
}
