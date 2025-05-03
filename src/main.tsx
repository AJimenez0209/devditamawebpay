import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createBrowserRouter, Outlet } from 'react-router-dom';

import AppLayout from './layouts/AppLayout';
import AdminLayout from './layouts/AdminLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import ProductList from './pages/admin/ProductList';
import ProductForm from './pages/admin/ProductForm';
import RequireAdmin from './components/RequireAdmin';

import './index.css';

// ✅ Importar providers
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext'; // si también lo usas

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'login', element: <Login /> },
    ],
  },
  {
    path: '/admin',
    element: (
      <RequireAdmin>
        <AdminLayout>
          <Outlet />
        </AdminLayout>
      </RequireAdmin>
    ),
    children: [
      { path: 'products', element: <ProductList /> },
      { path: 'products/new', element: <ProductForm /> },
      { path: 'products/:id', element: <ProductForm /> },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider> {/* ✅ Contexto de autenticación */}
      <CartProvider> {/* ✅ Si estás usando el carrito */}
        <RouterProvider router={router} />
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>
);
