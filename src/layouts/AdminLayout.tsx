import HeaderAdmin from '../components/admin/HeaderAdmin';
import { ReactNode } from 'react';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <HeaderAdmin />
      <main className="max-w-7xl mx-auto p-6">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
