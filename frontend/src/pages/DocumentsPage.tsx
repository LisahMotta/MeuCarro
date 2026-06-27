import { useState } from 'react';
import { FileText, Plus, AlertCircle, Loader2, X } from 'lucide-react';
import { useVehicleStore } from '../store/vehicleStore';
import { useDocuments, useCreateDocument, useDeleteDocument } from '../features/documents/hooks/useDocuments';
import { DocumentCard } from '../features/documents/components/DocumentCard';
import { DocumentForm } from '../features/documents/components/DocumentForm';

export function DocumentsPage() {
  const selectedVehicle = useVehicleStore((s) => s.selectedVehicle);
  const vehicleId = selectedVehicle?.id ?? '';
  const { data: documents, isLoading } = useDocuments(vehicleId);
  const createMutation = useCreateDocument(vehicleId);
  const deleteMutation = useDeleteDocument(vehicleId);
  const [showForm, setShowForm] = useState(false);

  if (!selectedVehicle) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <AlertCircle className="w-12 h-12 text-muted-foreground mb-4" />
        <h2 className="text-xl font-bold mb-2">Nenhum veículo selecionado</h2>
      </div>
    );
  }

  const expiring = documents?.filter((d) => d.expiryStatus === 'expired' || d.expiryStatus === 'critical' || d.expiryStatus === 'warning') ?? [];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Documentos</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {selectedVehicle.brand} {selectedVehicle.model} · {documents?.length ?? 0} documentos
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Adicionar</span>
        </button>
      </div>

      {expiring.length > 0 && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4">
          <p className="text-amber-600 dark:text-amber-400 font-semibold text-sm mb-1">
            ⚠️ {expiring.length} documento{expiring.length > 1 ? 's' : ''} requer{expiring.length === 1 ? '' : 'em'} atenção
          </p>
          <p className="text-xs text-muted-foreground">
            {expiring.map((d) => d.title).join(', ')}
          </p>
        </div>
      )}

      {showForm && (
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Novo documento</h3>
            <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground">
              <X className="w-5 h-5" />
            </button>
          </div>
          <DocumentForm
            isLoading={createMutation.isPending}
            onCancel={() => setShowForm(false)}
            onSubmit={async (data) => {
              await createMutation.mutateAsync({ ...data, type: data.type as any });
              setShowForm(false);
            }}
          />
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
      ) : !documents?.length ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
            <FileText className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="font-bold text-lg mb-1">Nenhum documento</h3>
          <p className="text-muted-foreground text-sm mb-6 max-w-xs">
            Cadastre seguro, IPVA, licenciamento e outros documentos para receber alertas de vencimento.
          </p>
          <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all">
            <Plus className="w-4 h-4" />
            Adicionar primeiro documento
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {documents.map((doc) => (
            <DocumentCard key={doc.id} doc={doc} onDelete={(id) => deleteMutation.mutate(id)} />
          ))}
        </div>
      )}
    </div>
  );
}
