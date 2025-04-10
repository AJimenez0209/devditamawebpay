// src/main.tsx
import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import ProductList from './pages/admin/ProductList';
import ProductForm from './pages/admin/ProductForm';
import RequireAdmin from './components/RequireAdmin';
import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />, // Layout con header y <Outlet />
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'admin/products',
        element: (
          <RequireAdmin>
            <ProductList />
          </RequireAdmin>
        ),
      },
      {
        path: 'admin/products/new',
        element: (
          <RequireAdmin>
            <ProductForm />
          </RequireAdmin>
        ),
      },
      {
        path: 'admin/products/:id',
        element: (
          <RequireAdmin>
            <ProductForm />
          </RequireAdmin>
        ),
      },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
