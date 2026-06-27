import { useState } from 'react';
import { useVehicleStore } from '../store/vehicleStore';
import { useExpenseReport, useHistory } from '../features/reports/hooks/useReports';
import { ExpenseSummaryCards } from '../features/reports/components/ExpenseSummaryCards';
import { MonthlyExpenseChart } from '../features/reports/components/MonthlyExpenseChart';
import { CategoryBreakdown } from '../features/reports/components/CategoryBreakdown';
import { HistoryTimeline } from '../features/reports/components/HistoryTimeline';
import { BarChart3, Clock, ChevronLeft, ChevronRight, Loader2, Car } from 'lucide-react';
import { Link } from 'react-router-dom';

type Tab = 'expenses' | 'history';

export function ReportsPage() {
  const selectedVehicle = useVehicleStore((s) => s.selectedVehicle);
  const [tab, setTab] = useState<Tab>('expenses');
  const [year, setYear] = useState(new Date().getFullYear());

  const vehicleId = selectedVehicle?.id ?? '';
  const { data: report, isLoading: loadingReport } = useExpenseReport(vehicleId, year);
  const { data: history, isLoading: loadingHistory } = useHistory(vehicleId);

  if (!selectedVehicle) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
          <Car className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="font-bold text-lg mb-1">Nenhum veículo selecionado</h3>
        <p className="text-muted-foreground text-sm mb-6">Adicione um veículo para ver relatórios.</p>
        <Link to="/vehicles/new" className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all">
          Adicionar veículo
        </Link>
      </div>
    );
  }

  const tabs = [
    { id: 'expenses' as Tab, label: 'Gastos', icon: BarChart3 },
    { id: 'history' as Tab, label: 'Histórico', icon: Clock },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-20 lg:pb-0">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Relatórios</h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          {selectedVehicle.brand} {selectedVehicle.model} {selectedVehicle.year}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-muted p-1 rounded-xl w-fit">
        {tabs.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                tab === t.id
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="w-4 h-4" />
              {t.label}
            </button>
          );
        })}
      </div>

      {tab === 'expenses' && (
        <div className="space-y-6">
          {/* Year selector */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setYear((y) => y - 1)}
              className="w-8 h-8 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-all flex items-center justify-center"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-lg font-bold text-foreground w-16 text-center">{year}</span>
            <button
              onClick={() => setYear((y) => Math.min(y + 1, new Date().getFullYear()))}
              disabled={year >= new Date().getFullYear()}
              className="w-8 h-8 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-all flex items-center justify-center disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {loadingReport ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : report ? (
            <>
              <ExpenseSummaryCards report={report} />
              <MonthlyExpenseChart months={report.months} />
              <CategoryBreakdown
                byCategory={report.maintenance.byCategory}
                total={report.maintenance.total}
              />
            </>
          ) : null}
        </div>
      )}

      {tab === 'history' && (
        <div className="bg-card border border-border rounded-2xl p-5">
          <HistoryTimeline events={history ?? []} isLoading={loadingHistory} />
        </div>
      )}
    </div>
  );
}
