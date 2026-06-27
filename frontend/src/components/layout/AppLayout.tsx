import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  LayoutDashboard, Car, Fuel, Wrench, FileText, Bell,
  BarChart3, Settings, LogOut, Menu, X, Sun, Moon, Monitor, CircleDot
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../providers/ThemeProvider';
import { useVehicleStore } from '../../store/vehicleStore';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/vehicles', icon: Car, label: 'Veículos' },
  { to: '/fuelings', icon: Fuel, label: 'Abastecimentos' },
  { to: '/maintenances', icon: Wrench, label: 'Manutenções' },
  { to: '/tires', icon: CircleDot, label: 'Pneus' },
  { to: '/documents', icon: FileText, label: 'Documentos' },
  { to: '/reports', icon: BarChart3, label: 'Relatórios' },
  { to: '/alerts', icon: Bell, label: 'Alertas' },
];

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const selectedVehicle = useVehicleStore((s) => s.selectedVehicle);
  const navigate = useNavigate();

  const { data: alertsData } = useQuery({
    queryKey: ['alerts-unread'],
    queryFn: async () => {
      const { data } = await api.get('/alerts?unread=true');
      return data.data;
    },
    refetchInterval: 30000,
  });

  const unreadCount = alertsData?.length ?? 0;

  const themeOptions: Array<{ value: typeof theme; icon: typeof Sun; label: string }> = [
    { value: 'light', icon: Sun, label: 'Claro' },
    { value: 'dark', icon: Moon, label: 'Escuro' },
    { value: 'system', icon: Monitor, label: 'Sistema' },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-sidebar border-r border-sidebar-border flex flex-col transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-sidebar-border">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
            <Car className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="text-sidebar-foreground font-bold text-lg">MeuCarro</span>
          <button
            className="ml-auto lg:hidden text-sidebar-foreground/60 hover:text-sidebar-foreground"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Vehicle selector */}
        {selectedVehicle && (
          <button
            onClick={() => navigate('/vehicles')}
            className="mx-4 mt-4 p-3 rounded-xl bg-sidebar-accent border border-sidebar-border flex items-center gap-3 hover:bg-sidebar-accent/80 transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <Car className="w-4 h-4 text-primary" />
            </div>
            <div className="text-left min-w-0">
              <p className="text-sidebar-foreground text-sm font-medium truncate">
                {selectedVehicle.brand} {selectedVehicle.model}
              </p>
              <p className="text-sidebar-foreground/60 text-xs">{selectedVehicle.year}</p>
            </div>
          </button>
        )}

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all relative ${
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-foreground'
                    : 'text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50'
                }`
              }
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
              {label === 'Alertas' && unreadCount > 0 && (
                <span className="ml-auto bg-destructive text-destructive-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Theme & User */}
        <div className="px-3 pb-4 space-y-2 border-t border-sidebar-border pt-4">
          <div className="flex items-center gap-1 p-1 rounded-xl bg-sidebar-accent">
            {themeOptions.map(({ value, icon: Icon, label }) => (
              <button
                key={value}
                onClick={() => setTheme(value)}
                title={label}
                className={`flex-1 flex items-center justify-center py-1.5 rounded-lg transition-all ${
                  theme === value
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-sidebar-foreground/50 hover:text-sidebar-foreground'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold text-sm flex-shrink-0">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sidebar-foreground text-sm font-medium truncate">{user?.name}</p>
              <p className="text-sidebar-foreground/50 text-xs truncate">{user?.email}</p>
            </div>
            <button
              onClick={logout}
              className="text-sidebar-foreground/50 hover:text-destructive transition-colors"
              title="Sair"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar (mobile) */}
        <header className="lg:hidden flex items-center gap-4 px-4 py-3 border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-foreground/70 hover:text-foreground"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
              <Car className="w-3 h-3 text-primary-foreground" />
            </div>
            <span className="font-bold text-foreground">MeuCarro</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <NavLink to="/alerts" className="relative text-foreground/70 hover:text-foreground">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </NavLink>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6 xl:p-8 overflow-auto">
          <Outlet />
        </main>

        {/* Bottom nav (mobile) */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-t border-border px-2 pb-safe z-10">
          <div className="flex items-center justify-around">
            {navItems.slice(0, 5).map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-0.5 py-2 px-3 rounded-xl transition-all ${
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''} transition-transform`} />
                    <span className="text-xs">{label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
}
