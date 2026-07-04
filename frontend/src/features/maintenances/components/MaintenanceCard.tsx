import { Wrench, Calendar, Gauge, Shield, Trash2, AlertTriangle, Pencil } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Maintenance } from '../types/maintenance.types';
import { categoryLabels, categoryColors } from '../utils/category.utils';
import { formatCurrency, formatDate, formatKm } from '../../../lib/utils';

const statusConfig = {
  completed: { label: 'Realizado', color: 'text-emerald-500 bg-emerald-500/10' },
  scheduled: { label: 'Agendado', color: 'text-blue-500 bg-blue-500/10' },
  overdue: { label: 'Atrasado', color: 'text-red-500 bg-red-500/10' },
};

interface Props {
  maintenance: Maintenance;
  onDelete: (id: string) => void;
}

export function MaintenanceCard({ maintenance, onDelete }: Props) {
  const navigate = useNavigate();
  const catColor = categoryColors[maintenance.category];
  const status = statusConfig[maintenance.status];

  const hasNextService = maintenance.nextServiceDate || maintenance.nextServiceKm;
  const isWarrantyActive = maintenance.warrantyUntil && new Date(maintenance.warrantyUntil) > new Date();

  return (
    <div className="bg-card border border-border rounded-2xl p-4 hover:border-primary/30 transition-all group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${catColor}`}>
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <p className="font-semibold text-foreground text-sm">{categoryLabels[maintenance.category]}</p>
            <p className="text-xs text-muted-foreground">
              {maintenance.shopName ?? 'Oficina não informada'}
            </p>
          </div>
        </div>
        <div className="text-right flex flex-col items-end gap-1">
          <p className="font-bold text-foreground">{formatCurrency(parseFloat(maintenance.totalCost))}</p>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${status.color}`}>
            {status.label}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Calendar className="w-3.5 h-3.5" />
          {formatDate(maintenance.date)}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Gauge className="w-3.5 h-3.5" />
          {formatKm(maintenance.odometer)}
        </div>
        {parseFloat(maintenance.laborCost) > 0 && (
          <div className="text-xs text-muted-foreground">
            MO: {formatCurrency(parseFloat(maintenance.laborCost))}
          </div>
        )}
        {parseFloat(maintenance.partsCost) > 0 && (
          <div className="text-xs text-muted-foreground">
            Peças: {formatCurrency(parseFloat(maintenance.partsCost))}
          </div>
        )}
      </div>

      {hasNextService && (
        <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-lg p-2.5 mb-3">
          <AlertTriangle className="w-4 h-4 text-blue-500 flex-shrink-0" />
          <div className="text-xs text-foreground">
            Próximo:{' '}
            {maintenance.nextServiceDate && <span>{formatDate(maintenance.nextServiceDate)}</span>}
            {maintenance.nextServiceDate && maintenance.nextServiceKm && <span> · </span>}
            {maintenance.nextServiceKm && <span>{formatKm(maintenance.nextServiceKm)}</span>}
          </div>
        </div>
      )}

      {isWarrantyActive && (
        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-2.5 mb-3">
          <Shield className="w-4 h-4 text-emerald-500 flex-shrink-0" />
          <span className="text-xs text-foreground">
            Garantia até {formatDate(maintenance.warrantyUntil!)}
          </span>
        </div>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-border">
        {maintenance.mechanicName ? (
          <span className="text-xs text-muted-foreground">Mecânico: {maintenance.mechanicName}</span>
        ) : <span />}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
          <button
            onClick={() => navigate(`/maintenances/${maintenance.id}/edit`)}
            className="text-muted-foreground hover:text-primary p-1 rounded-lg hover:bg-primary/10 transition-all"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(maintenance.id)}
            className="text-muted-foreground hover:text-destructive p-1 rounded-lg hover:bg-destructive/10 transition-all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
