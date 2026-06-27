import { Bell, AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { DashboardData } from '../types/dashboard.types';
import { useNavigate } from 'react-router-dom';

const severityConfig = {
  critical: { icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-500/10' },
  urgent: { icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  warning: { icon: AlertTriangle, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
  info: { icon: Info, color: 'text-blue-500', bg: 'bg-blue-500/10' },
};

interface Props {
  alerts: DashboardData['recentAlerts'];
}

export function RecentAlertsCard({ alerts }: Props) {
  const navigate = useNavigate();

  if (!alerts.length) return null;

  return (
    <div className="bg-card border border-border rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-muted-foreground" />
          <h3 className="font-semibold text-foreground">Alertas recentes</h3>
        </div>
        <button onClick={() => navigate('/alerts')} className="text-xs text-primary hover:underline">
          Ver todos
        </button>
      </div>
      <div className="space-y-2">
        {alerts.map((alert) => {
          const config = severityConfig[alert.severity as keyof typeof severityConfig] ?? severityConfig.info;
          const Icon = config.icon;
          return (
            <div key={alert.id} className="flex items-start gap-3 py-2 border-b border-border last:border-0">
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${config.bg}`}>
                <Icon className={`w-3.5 h-3.5 ${config.color}`} />
              </div>
              <p className="text-sm text-foreground leading-tight">{alert.title}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
