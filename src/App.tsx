import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from './components/ui/sonner';
import { StoreProvider } from './store/StoreContext';

// Client pages
import ClientLayout from './components/client/ClientLayout';
import MenuPage from './components/client/MenuPage';
import CheckoutPage from './components/client/CheckoutPage';
import TrackingPage from './components/client/TrackingPage';
import ClientAuthPage from './components/client/ClientAuthPage';
import ClientProfilePage from './components/client/ClientProfilePage';

// Admin pages
import AdminLayout from './components/admin/AdminLayout';
import LoginPage from './components/admin/LoginPage';
import DashboardPage from './components/admin/DashboardPage';
import OrdersPage from './components/admin/OrdersPage';
import ProductsPage from './components/admin/ProductsPage';
import AdminSettingsPage from './components/admin/AdminSettingsPage';

export default function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <Toaster position="top-center" />
        <Routes>
          {/* ── Client Routes ── */}
          <Route element={<ClientLayout />}>
            <Route path="/" element={<MenuPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/tracking" element={<TrackingPage />} />
            <Route path="/tracking/:orderId" element={<TrackingPage />} />
            <Route path="/cliente/login" element={<ClientAuthPage />} />
            <Route path="/cliente/perfil" element={<ClientProfilePage />} />
          </Route>

          {/* ── Admin Routes ── */}
          <Route path="/login" element={<LoginPage />} />
          
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </StoreProvider>
  );
}
