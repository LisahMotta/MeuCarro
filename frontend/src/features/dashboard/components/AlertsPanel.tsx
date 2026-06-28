import { Bell, Wrench, RotateCcw, FileText, Zap, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DashboardData } from '../types/dashboard.types';

const typeConfig: Record<string, { icon: typeof Bell; bg: string; color: string }> = {
  oil_change: { icon: Wrench, bg: 'bg-orange-500/20', color: 'text-orange-400' },
  rotation: { icon: RotateCcw, bg: 'bg-blue-500/20', color: 'text-blue-400' },
  revision: { icon: Wrench, bg: 'bg-emerald-500/20', color: 'text-emerald-400' },
  insurance: { icon: FileText, bg: 'bg-violet-500/20', color: 'text-violet-400' },
  ipva: { icon: FileText, bg: 'bg-red-500/20', color: 'text-red-400' },
  timing_belt: { icon: Zap, bg: 'bg-amber-500/20', color: 'text-amber-400' },
  licensing: { icon: FileText, bg: 'bg-blue-500/20', color: 'text-blue-400' },
  default: { icon: Bell, bg: 'bg-muted', color: 'text-muted-foreground' },
};

const severityBadge: Record<string, string> = {
  critical: 'bg-red-500/20 text-red-400',
  urgent: 'bg-amber-500/20 text-amber-400',
  warning: 'bg-yellow-500/20 text-yellow-400',
  info: 'bg-blue-500/20 text-blue-400',
};

interface Props {
  alerts: DashboardData['recentAlerts'];
}

export function AlertsPanel({ alerts }: Props) {
  const navigate = useNavigate();

  return (
    <div className="bg-card border border-border rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground text-sm">Alertas importantes</h3>
        <button
          onClick={() => navigate('/alerts')}
          className="flex items-center gap-1 text-xs text-primary hover:underline"
        >
          Ver todos <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      {alerts.length === 0 ? (
        <p className="text-xs text-muted-foreground text-center py-4">Nenhum alerta ativo</p>
      ) : (
        <div className="space-y-3">
          {alerts.slice(0, 5).map((alert) => {
            const cfg = typeConfig[alert.type] ?? typeConfig.default;
            const Icon = cfg.icon;
            const badge = severityBadge[alert.severity] ?? severityBadge.info;

            return (
              <div key={alert.id} className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.bg}`}>
                  <Icon className={`w-4 h-4 ${cfg.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground truncate">{alert.title}</p>
                  <p className="text-xs text-muted-foreground capitalize">{alert.type.replace(/_/g, ' ')}</p>
                </div>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${badge}`}>
                  {alert.severity === 'critical' ? 'Urgente' : alert.severity === 'urgent' ? 'Atenção' : alert.severity === 'warning' ? 'Aviso' : 'Info'}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
