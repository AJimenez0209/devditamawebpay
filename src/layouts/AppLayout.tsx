// src/layouts/AppLayout.tsx
import { Outlet } from 'react-router-dom';
import { CartProvider } from '../context/CartContext';
import Header from '../components/Header'; // <-- Este es el correcto

const AppLayout = () => {
  return (
    <CartProvider>
      <div className="min-h-screen bg-gray-100">
        <Header /> {/* Aquí dejamos tu Header limpio */}

        <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </CartProvider>
  );
};

export default AppLayout;
