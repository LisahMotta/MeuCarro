import { Bell, BellOff, CheckCheck, RefreshCw, Loader2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useAlerts, useMarkAlertRead, useMarkAllAlertsRead, useDismissAlert, useGenerateAlerts } from '../features/alerts/hooks/useAlerts';
import { Alert } from '../features/alerts/services/alerts.service';
import { formatDate } from '../lib/utils';

const severityConfig = {
  critical: { icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20', label: 'Crítico' },
  urgent: { icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20', label: 'Urgente' },
  warning: { icon: AlertTriangle, color: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', label: 'Atenção' },
  info: { icon: Info, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20', label: 'Info' },
};

function AlertCard({ alert, onRead, onDismiss }: { alert: Alert; onRead: () => void; onDismiss: () => void }) {
  const config = severityConfig[alert.severity] ?? severityConfig.info;
  const Icon = config.icon;

  return (
    <div className={`bg-card border rounded-2xl p-4 transition-all ${!alert.isRead ? 'border-primary/30' : 'border-border'} hover:border-primary/20`}>
      <div className="flex items-start gap-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${config.bg}`}>
          <Icon className={`w-4 h-4 ${config.color}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <p className={`text-sm font-semibold ${!alert.isRead ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {alert.title}
                </p>
                {!alert.isRead && (
                  <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                )}
              </div>
              {alert.description && (
                <p className="text-xs text-muted-foreground mt-0.5">{alert.description}</p>
              )}
              <p className="text-xs text-muted-foreground mt-1">{formatDate(alert.createdAt)}</p>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${config.bg} ${config.color}`}>
              {config.label}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          {!alert.isRead && (
            <button
              onClick={onRead}
              title="Marcar como lido"
              className="w-7 h-7 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all flex items-center justify-center"
            >
              <CheckCheck className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={onDismiss}
            title="Dispensar"
            className="w-7 h-7 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all flex items-center justify-center"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function AlertsPage() {
  const { data: alerts, isLoading } = useAlerts();
  const markRead = useMarkAlertRead();
  const markAllRead = useMarkAllAlertsRead();
  const dismiss = useDismissAlert();
  const generate = useGenerateAlerts();

  const unreadCount = alerts?.filter((a) => !a.isRead).length ?? 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const critical = alerts?.filter((a) => a.severity === 'critical') ?? [];
  const urgent = alerts?.filter((a) => a.severity === 'urgent') ?? [];
  const rest = alerts?.filter((a) => a.severity !== 'critical' && a.severity !== 'urgent') ?? [];
  const sorted = [...critical, ...urgent, ...rest];

  return (
    <div className="space-y-6 animate-fade-in pb-20 lg:pb-0">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Alertas</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {unreadCount > 0 ? `${unreadCount} não lido${unreadCount > 1 ? 's' : ''}` : 'Tudo em dia'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => generate.mutate()}
            disabled={generate.isPending}
            title="Gerar alertas"
            className="w-9 h-9 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-all flex items-center justify-center"
          >
            {generate.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          </button>
          {unreadCount > 0 && (
            <button
              onClick={() => markAllRead.mutate()}
              disabled={markAllRead.isPending}
              className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
            >
              <CheckCheck className="w-4 h-4" />
              <span className="hidden sm:inline">Marcar todos como lido</span>
            </button>
          )}
        </div>
      </div>

      {!sorted.length ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
            <BellOff className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="font-bold text-lg mb-1">Nenhum alerta</h3>
          <p className="text-muted-foreground text-sm mb-6 max-w-xs">
            Tudo em ordem! Clique em atualizar para verificar novos alertas.
          </p>
          <button
            onClick={() => generate.mutate()}
            disabled={generate.isPending}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all"
          >
            {generate.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            Verificar alertas
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map((alert) => (
            <AlertCard
              key={alert.id}
              alert={alert}
              onRead={() => markRead.mutate(alert.id)}
              onDismiss={() => dismiss.mutate(alert.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
