import { useState } from 'react';
import { CircleDot, Plus, AlertCircle, Loader2, X } from 'lucide-react';
import { useVehicleStore } from '../store/vehicleStore';
import { useTires, useTireEvents, useCreateTire, useDeleteTire, useCreateTireEvent } from '../features/tires/hooks/useTires';
import { TireCard } from '../features/tires/components/TireCard';
import { TireEventCard } from '../features/tires/components/TireEventCard';
import { TireEventForm } from '../features/tires/components/TireEventForm';

export function TiresPage() {
  const selectedVehicle = useVehicleStore((s) => s.selectedVehicle);
  const vehicleId = selectedVehicle?.id ?? '';
  const { data: tires, isLoading: loadingTires } = useTires(vehicleId);
  const { data: events, isLoading: loadingEvents } = useTireEvents(vehicleId);
  const deleteMutation = useDeleteTire(vehicleId);
  const createEventMutation = useCreateTireEvent(vehicleId);
  const [showEventForm, setShowEventForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'tires' | 'events'>('events');

  if (!selectedVehicle) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <AlertCircle className="w-12 h-12 text-muted-foreground mb-4" />
        <h2 className="text-xl font-bold mb-2">Nenhum veículo selecionado</h2>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Pneus</h1>
          <p className="text-muted-foreground text-sm mt-0.5">{selectedVehicle.brand} {selectedVehicle.model}</p>
        </div>
        <button
          onClick={() => setShowEventForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Registrar evento</span>
        </button>
      </div>

      {showEventForm && (
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Novo evento de pneu</h3>
            <button onClick={() => setShowEventForm(false)} className="text-muted-foreground hover:text-foreground">
              <X className="w-5 h-5" />
            </button>
          </div>
          <TireEventForm
            vehicleCurrentKm={selectedVehicle.currentKm}
            isLoading={createEventMutation.isPending}
            onCancel={() => setShowEventForm(false)}
            onSubmit={async (data) => {
              await createEventMutation.mutateAsync(data as any);
              setShowEventForm(false);
            }}
          />
        </div>
      )}

      <div className="flex gap-2 bg-muted p-1 rounded-xl w-fit">
        {(['events', 'tires'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab === 'events' ? 'Histórico' : 'Pneus cadastrados'}
          </button>
        ))}
      </div>

      {activeTab === 'events' && (
        <div className="space-y-3">
          {loadingEvents ? (
            <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
          ) : !events?.length ? (
            <div className="text-center py-12">
              <CircleDot className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">Nenhum evento registrado.</p>
            </div>
          ) : (
            events.map((event) => <TireEventCard key={event.id} event={event} />)
          )}
        </div>
      )}

      {activeTab === 'tires' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {loadingTires ? (
            <div className="flex justify-center py-8 col-span-2"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
          ) : !tires?.length ? (
            <div className="col-span-2 text-center py-12">
              <CircleDot className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">Nenhum pneu cadastrado.</p>
            </div>
          ) : (
            tires.map((tire) => (
              <TireCard key={tire.id} tire={tire} onDelete={(id) => deleteMutation.mutate(id)} />
            ))
          )}
        </div>
      )}
    </div>
  );
}
