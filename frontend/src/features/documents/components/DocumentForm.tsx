import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import { DocumentType } from '../types/document.types';
import { documentTypeLabels } from '../utils/document.utils';

const schema = z.object({
  type: z.string().min(1),
  title: z.string().min(1, 'Obrigatório'),
  issuer: z.string().optional(),
  issueDate: z.string().optional(),
  expiryDate: z.string().optional(),
  value: z.number().min(0).optional(),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface Props {
  onSubmit: (data: FormData) => Promise<void>;
  isLoading?: boolean;
  onCancel: () => void;
}

export function DocumentForm({ onSubmit, isLoading, onCancel }: Props) {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
    defaultValues: { type: 'insurance' },
  });

  const type = watch('type') as DocumentType;

  const typeTitles: Partial<Record<DocumentType, string>> = {
    insurance: 'Seguro do veículo',
    ipva: 'IPVA',
    licensing: 'Licenciamento',
    crlv: 'CRLV',
  };

  const handleTypeChange = (t: string) => {
    setValue('type', t);
    if (typeTitles[t as DocumentType]) {
      setValue('title', typeTitles[t as DocumentType]!);
    }
  };

  const inputCls = 'w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all text-sm';
  const labelCls = 'text-sm font-medium text-foreground block mb-1.5';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Tipo *</label>
          <select value={type} onChange={(e) => handleTypeChange(e.target.value)} className={inputCls}>
            {(Object.entries(documentTypeLabels) as [DocumentType, string][]).map(([val, label]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelCls}>Título *</label>
          <input {...register('title')} placeholder="Nome do documento" className={inputCls} />
          {errors.title && <p className="text-destructive text-xs mt-1">{errors.title.message}</p>}
        </div>
        <div>
          <label className={labelCls}>Emissor</label>
          <input {...register('issuer')} placeholder="Ex: Porto Seguro" className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Valor (R$)</label>
          <input {...register('value', { valueAsNumber: true })} type="number" step="0.01" placeholder="0,00" className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Data de emissão</label>
          <input {...register('issueDate')} type="date" className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Data de vencimento</label>
          <input {...register('expiryDate')} type="date" className={inputCls} />
        </div>
      </div>
      <div>
        <label className={labelCls}>Observações</label>
        <textarea {...register('notes')} rows={2} className={`${inputCls} resize-none`} />
      </div>
      <div className="flex gap-3">
        <button type="button" onClick={onCancel} className="flex-1 py-2.5 rounded-xl border border-border text-foreground hover:bg-muted transition-all text-sm font-medium">
          Cancelar
        </button>
        <button type="submit" disabled={isLoading} className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm">
          {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
          Salvar
        </button>
      </div>
    </form>
  );
}
