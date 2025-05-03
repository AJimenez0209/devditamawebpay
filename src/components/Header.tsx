import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  let timeout: NodeJS.Timeout;

  const handleMouseEnter = () => {
    clearTimeout(timeout);
    setOpen(true);
  };

  const handleMouseLeave = () => {
    timeout = setTimeout(() => setOpen(false), 200);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
      <Link to="/" className="flex items-center gap-2">
        <img src="/logo.png" alt="Ditama" className="h-8" />
        <span className="font-bold text-lg">PañalesDitama</span>
      </Link>

      <div className="relative">
        <button
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="flex items-center gap-2 text-sm font-medium"
        >
          <User className="w-5 h-5" />
          Mi Perfil
        </button>

        {open && (
          <div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-md"
          >
            {isAuthenticated ? (
              <>
                <Link to="/admin/products" className="block px-4 py-2 hover:bg-gray-100">
                  Administrar Panel
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                >
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <Link to="/login" className="block px-4 py-2 hover:bg-gray-100">
                Iniciar Sesión
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
