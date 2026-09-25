import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { ShoppingCart, Settings, User, LogOut } from 'lucide-react';
import { useStore } from '../../store/StoreContext';
import CartDrawer from './CartDrawer';
import { Button } from '../ui/button';
import { supabase } from '../../lib/supabase';

export default function ClientLayout() {
  const { cart, session, profile, clientPhone, clientProfile, setClientPhone } = useStore();
  const [cartOpen, setCartOpen] = useState(false);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogoutAdmin = async () => {
    await supabase.auth.signOut();
  };

  const handleLogoutClient = () => {
    setClientPhone(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-background/80 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl tracking-tight transition-colors hover:text-primary">
            <span className="text-2xl">🍣</span>
            <span>Sushiya</span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-4">
            
            {clientPhone ? (
              <div className="flex items-center gap-1 sm:gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/cliente/perfil">
                    <User className="sm:mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">{clientProfile?.full_name?.split(' ')[0] || 'Perfil'}</span>
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" onClick={handleLogoutClient} className="text-destructive hidden sm:flex">
                  <LogOut className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Sair</span>
                </Button>
              </div>
            ) : (
              <Button variant="ghost" size="sm" asChild>
                <Link to="/cliente/login">Entrar</Link>
              </Button>
            )}

            {session && profile?.role === 'admin' && (
              <Button variant="ghost" size="sm" asChild className="hidden sm:flex">
                <Link to="/admin">
                  <Settings className="mr-2 h-4 w-4" />
                  Admin
                </Link>
              </Button>
            )}
            
            <Button 
              variant="outline" 
              className="relative rounded-full px-4"
              onClick={() => setCartOpen(true)}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Carrinho</span>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shadow-sm">
                  {totalItems}
                </span>
              )}
            </Button>
            
          </div>
        </div>
      </header>

      {/* Page content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        <Outlet />
      </main>

      {/* Cart Drawer */}
      {cartOpen && <CartDrawer onClose={() => setCartOpen(false)} />}
    </div>
  );
}
