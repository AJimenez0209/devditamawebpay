import { Link } from 'react-router-dom';
import { Menu, LogOut, Home, User } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
      <Link to="/" className="flex items-center gap-2">
        <img src="/logo.png" alt="Ditama" className="h-8" />
        <span className="font-bold text-lg">PañalesDitama</span>
      </Link>

      <div className="flex items-center gap-4">
        {/* Botón ir a la tienda */}
        <Link to="/" className="flex items-center text-sm text-blue-600 hover:underline">
          <Home className="w-4 h-4 mr-1" />
          Ir a la tienda
        </Link>

        {/* Menú usuario */}
        <div className="relative group">
          <button className="flex items-center gap-2 text-sm font-medium">
            <User className="w-5 h-5" />
            Mi Perfil
          </button>

          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-md hidden group-hover:block">
            <Link to="/admin" className="block px-4 py-2 hover:bg-gray-100">
              Panel Admin
            </Link>
            <button
              onClick={() => alert('Cerrar sesión')}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
