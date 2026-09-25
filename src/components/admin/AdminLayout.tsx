import React, { useState } from 'react';
import { Outlet, Link, NavLink, Navigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ClipboardList,
  DollarSign,
  Package,
  ArrowLeft,
  Menu,
  X,
  LogOut,
  Bell,
  BellOff
} from 'lucide-react';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { useStore } from '../../store/StoreContext';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';

const navItems = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { path: '/admin/orders', label: 'Pedidos', icon: ClipboardList },
  { path: '/admin/products', label: 'Produtos', icon: Package },
];

export default function AdminLayout() {
  const { session, profile, isLoading, orders } = useStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const prevCountRef = React.useRef(orders.length);

  React.useEffect(() => {
    if (orders.length > prevCountRef.current) {
      if (soundEnabled) {
        toast('🔔 Novo pedido recebido!', {
          description: 'Verifique a coluna Recebidos.',
          duration: 5000,
        });
        // Play sound (simple beep using Web Audio API)
        try {
          const ctx = new (window.AudioContext || window.webkitAudioContext)();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.frequency.value = 800;
          gain.gain.value = 0.3;
          osc.start();
          osc.stop(ctx.currentTime + 0.3);
          setTimeout(() => {
            const osc2 = ctx.createOscillator();
            const gain2 = ctx.createGain();
            osc2.connect(gain2);
            gain2.connect(ctx.destination);
            osc2.frequency.value = 1000;
            gain2.gain.value = 0.3;
            osc2.start();
            osc2.stop(ctx.currentTime + 0.3);
          }, 350);
        } catch (e) {
          // Silently fail if audio not available
        }
      }
    }
    prevCountRef.current = orders.length;
  }, [orders.length, soundEnabled]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const now = new Date();
  const dateStr = now.toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="flex h-screen bg-muted/40 overflow-hidden">
      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } flex flex-col`}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-border">
          <div className="flex flex-col">
            <Link to="/admin" className="flex items-center gap-2 font-bold text-lg hover:text-primary transition-colors">
              <span className="text-xl">🍣</span>
              <span>Sushiya</span>
            </Link>
            <span className="text-xs text-muted-foreground">Painel Administrativo</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </Button>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          {navItems.map(({ path, label, icon: Icon, exact }) => (
            <NavLink
              key={path}
              to={path}
              end={exact}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                }`
              }
              onClick={() => setSidebarOpen(false)}
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 mt-auto border-t border-border flex flex-col gap-2">
          <Button variant="ghost" className="w-full justify-start text-muted-foreground" asChild>
            <Link to="/">
              <ArrowLeft size={18} className="mr-2" />
              Voltar ao Site
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10" onClick={handleLogout}>
            <LogOut size={18} className="mr-2" />
            Sair
          </Button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col overflow-hidden w-full h-full">
        <header className="h-16 flex items-center justify-between px-4 sm:px-6 border-b border-border bg-card shrink-0 shadow-sm z-10">
          <div className="flex items-center gap-4 lg:hidden">
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
              <Menu size={20} />
            </Button>
          </div>
          <div className="flex items-center gap-4 ml-auto">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                if (!soundEnabled) toast.success("Notificações sonoras ativadas!");
              }}
              className={soundEnabled ? "text-primary" : "text-muted-foreground"}
              title="Ativar/Desativar som de novo pedido"
            >
              {soundEnabled ? <Bell size={18} className="mr-2" /> : <BellOff size={18} className="mr-2" />}
              <span className="hidden sm:inline">Som {soundEnabled ? 'ON' : 'OFF'}</span>
            </Button>
            <span className="text-sm font-medium text-muted-foreground capitalize hidden sm:inline">
              {dateStr}
            </span>
          </div>
        </header>
        
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
