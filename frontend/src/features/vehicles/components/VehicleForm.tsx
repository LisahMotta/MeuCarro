import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import { Vehicle, FuelType } from '../types/vehicle.types';

const schema = z.object({
  brand: z.string().min(1, 'Obrigatório'),
  model: z.string().min(1, 'Obrigatório'),
  year: z.number().int().min(1900).max(new Date().getFullYear() + 1),
  version: z.string().optional(),
  plate: z.string().optional(),
  chassis: z.string().optional(),
  renavam: z.string().optional(),
  color: z.string().optional(),
  currentKm: z.number().int().min(0),
  fuelType: z.enum(['gasoline', 'ethanol', 'flex', 'diesel', 'electric', 'hybrid']),
  tankCapacity: z.number().min(0).optional(),
  oilType: z.string().optional(),
  oilQuantity: z.number().min(0).optional(),
  tireSize: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const fuelLabels: Record<FuelType, string> = {
  gasoline: 'Gasolina',
  ethanol: 'Etanol',
  flex: 'Flex',
  diesel: 'Diesel',
  electric: 'Elétrico',
  hybrid: 'Híbrido',
};

interface Props {
  vehicle?: Vehicle;
  onSubmit: (data: FormData) => Promise<void>;
  isLoading?: boolean;
}

export function VehicleForm({ vehicle, onSubmit, isLoading }: Props) {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: vehicle ? {
      brand: vehicle.brand,
      model: vehicle.model,
      year: vehicle.year,
      version: vehicle.version ?? '',
      plate: vehicle.plate ?? '',
      chassis: vehicle.chassis ?? '',
      renavam: vehicle.renavam ?? '',
      color: vehicle.color ?? '',
      currentKm: vehicle.currentKm,
      fuelType: vehicle.fuelType,
      tankCapacity: vehicle.tankCapacity ? parseFloat(vehicle.tankCapacity) : undefined,
      oilType: vehicle.oilType ?? '',
      oilQuantity: vehicle.oilQuantity ? parseFloat(vehicle.oilQuantity) : undefined,
      tireSize: vehicle.tireSize ?? '',
    } : {
      currentKm: 0,
      fuelType: 'flex',
    },
  });

  const inputCls = 'w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all text-sm';
  const labelCls = 'text-sm font-medium text-foreground block mb-1.5';
  const errorCls = 'text-destructive text-xs mt-1';

  const Field = ({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) => (
    <div>
      <label className={labelCls}>{label}</label>
      {children}
      {error && <p className={errorCls}>{error}</p>}
    </div>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Identificação */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">Identificação</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Marca *" error={errors.brand?.message}>
            <input {...register('brand')} placeholder="Ex: Toyota" className={inputCls} />
          </Field>
          <Field label="Modelo *" error={errors.model?.message}>
            <input {...register('model')} placeholder="Ex: Corolla" className={inputCls} />
          </Field>
          <Field label="Ano *" error={errors.year?.message}>
            <input {...register('year', { valueAsNumber: true })} type="number" placeholder="2022" className={inputCls} />
          </Field>
          <Field label="Versão" error={errors.version?.message}>
            <input {...register('version')} placeholder="Ex: XEi 2.0" className={inputCls} />
          </Field>
          <Field label="Cor" error={errors.color?.message}>
            <input {...register('color')} placeholder="Ex: Prata" className={inputCls} />
          </Field>
          <Field label="Placa" error={errors.plate?.message}>
            <input {...register('plate')} placeholder="ABC1D23" className={`${inputCls} uppercase`} />
          </Field>
        </div>
      </div>

      {/* Documentação */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">Documentação</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Chassi" error={errors.chassis?.message}>
            <input {...register('chassis')} placeholder="17 caracteres" className={inputCls} maxLength={17} />
          </Field>
          <Field label="Renavam" error={errors.renavam?.message}>
            <input {...register('renavam')} placeholder="11 dígitos" className={inputCls} maxLength={11} />
          </Field>
        </div>
      </div>

      {/* Mecânica */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">Mecânica</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Quilometragem atual *" error={errors.currentKm?.message}>
            <input {...register('currentKm', { valueAsNumber: true })} type="number" placeholder="0" className={inputCls} />
          </Field>
          <Field label="Combustível" error={errors.fuelType?.message}>
            <select {...register('fuelType')} className={inputCls}>
              {(Object.entries(fuelLabels) as [FuelType, string][]).map(([val, label]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </select>
          </Field>
          <Field label="Capacidade do tanque (L)" error={errors.tankCapacity?.message}>
            <input {...register('tankCapacity', { valueAsNumber: true })} type="number" step="0.1" placeholder="50" className={inputCls} />
          </Field>
          <Field label="Tipo do óleo" error={errors.oilType?.message}>
            <input {...register('oilType')} placeholder="Ex: 5W30" className={inputCls} />
          </Field>
          <Field label="Quantidade de óleo (L)" error={errors.oilQuantity?.message}>
            <input {...register('oilQuantity', { valueAsNumber: true })} type="number" step="0.1" placeholder="4.5" className={inputCls} />
          </Field>
          <Field label="Medida dos pneus" error={errors.tireSize?.message}>
            <input {...register('tireSize')} placeholder="Ex: 205/55R16" className={inputCls} />
          </Field>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
        {isLoading ? 'Salvando...' : vehicle ? 'Salvar alterações' : 'Cadastrar veículo'}
      </button>
    </form>
  );
}
