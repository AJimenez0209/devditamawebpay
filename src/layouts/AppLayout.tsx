// src/layouts/AppLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import { CartProvider } from '../context/CartContext';
import { Logo } from '../components/Logo';
import AuthButton from '../components/AuthButton';

const AppLayout = () => {
  return (
    <CartProvider>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <Logo />
              <AuthButton />
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </CartProvider>
  );
};

export default AppLayout;
