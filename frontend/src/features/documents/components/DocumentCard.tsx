import { FileText, Calendar, AlertTriangle, CheckCircle, Trash2 } from 'lucide-react';
import { Document } from '../types/document.types';
import { documentTypeLabels, documentTypeColors } from '../utils/document.utils';
import { formatCurrency, formatDate } from '../../../lib/utils';

const expiryStatusConfig = {
  expired: { label: 'Vencido', color: 'text-red-500 bg-red-500/10 border-red-500/20', icon: AlertTriangle },
  critical: { label: 'Vence em breve', color: 'text-red-400 bg-red-400/10 border-red-400/20', icon: AlertTriangle },
  warning: { label: 'Atenção', color: 'text-amber-500 bg-amber-500/10 border-amber-500/20', icon: AlertTriangle },
  ok: { label: 'Regular', color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20', icon: CheckCircle },
};

interface Props { doc: Document; onDelete: (id: string) => void; }

export function DocumentCard({ doc, onDelete }: Props) {
  const typeColor = documentTypeColors[doc.type];
  const expiry = doc.expiryStatus ? expiryStatusConfig[doc.expiryStatus] : null;

  return (
    <div className={`bg-card border rounded-2xl p-4 hover:border-primary/30 transition-all group ${
      doc.expiryStatus === 'expired' ? 'border-red-500/30' :
      doc.expiryStatus === 'critical' ? 'border-red-400/30' :
      doc.expiryStatus === 'warning' ? 'border-amber-500/30' : 'border-border'
    }`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${typeColor}`}>
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <p className="font-semibold text-foreground text-sm">{doc.title}</p>
            <p className="text-xs text-muted-foreground">{documentTypeLabels[doc.type]}</p>
          </div>
        </div>
        <div className="text-right">
          {doc.value && <p className="font-bold text-foreground text-sm">{formatCurrency(parseFloat(doc.value))}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground mb-3">
        {doc.issueDate && (
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            Emissão: {formatDate(doc.issueDate)}
          </div>
        )}
        {doc.expiryDate && (
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            Vencimento: {formatDate(doc.expiryDate)}
          </div>
        )}
        {doc.issuer && <div className="col-span-2">Emissor: {doc.issuer}</div>}
      </div>

      {expiry && doc.expiryDate && (
        <div className={`flex items-center gap-2 rounded-lg p-2.5 border mb-3 ${expiry.color}`}>
          <expiry.icon className="w-4 h-4 flex-shrink-0" />
          <span className="text-xs font-medium">
            {doc.daysUntilExpiry != null && doc.daysUntilExpiry < 0
              ? `Vencido há ${Math.abs(doc.daysUntilExpiry)} dias`
              : doc.daysUntilExpiry != null && doc.daysUntilExpiry <= 30
              ? `Vence em ${doc.daysUntilExpiry} dias`
              : expiry.label}
          </span>
        </div>
      )}

      <div className="flex justify-end pt-2 border-t border-border">
        <button
          onClick={() => onDelete(doc.id)}
          className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all p-1 rounded-lg hover:bg-destructive/10"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
