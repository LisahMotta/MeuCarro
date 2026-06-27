import { FileText, AlertTriangle } from 'lucide-react';
import { DashboardData } from '../types/dashboard.types';
import { formatDate } from '../../../lib/utils';
import { useNavigate } from 'react-router-dom';

const docLabels: Record<string, string> = {
  insurance: 'Seguro', ipva: 'IPVA', licensing: 'Licenciamento',
  fine: 'Multa', inspection: 'Vistoria', crlv: 'CRLV', other: 'Outro',
};

interface Props {
  documents: DashboardData['upcomingDocuments'];
}

export function UpcomingDocumentsCard({ documents }: Props) {
  const navigate = useNavigate();

  if (!documents.length) return null;

  return (
    <div className="bg-card border border-border rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-muted-foreground" />
          <h3 className="font-semibold text-foreground">Documentos expirando</h3>
        </div>
        <button
          onClick={() => navigate('/documents')}
          className="text-xs text-primary hover:underline"
        >
          Ver todos
        </button>
      </div>
      <div className="space-y-2">
        {documents.map((doc) => {
          const days = doc.daysUntilExpiry;
          const isOverdue = days !== null && days !== undefined && days < 0;
          const isUrgent = days !== null && days !== undefined && days >= 0 && days <= 7;
          const color = isOverdue ? 'text-red-500' : isUrgent ? 'text-amber-500' : 'text-yellow-500';

          return (
            <div key={doc.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <div className="flex items-center gap-2">
                <AlertTriangle className={`w-4 h-4 ${color}`} />
                <div>
                  <p className="text-sm font-medium text-foreground">{doc.title}</p>
                  <p className="text-xs text-muted-foreground">{docLabels[doc.type] ?? doc.type}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-xs font-semibold ${color}`}>
                  {isOverdue ? `Vencido` : `${days} dias`}
                </p>
                {doc.expiryDate && (
                  <p className="text-xs text-muted-foreground">{formatDate(doc.expiryDate)}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
