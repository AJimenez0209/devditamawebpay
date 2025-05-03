import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const ProfileMenu = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
      >
        <FaUserCircle size={24} />
        <span>Mi Perfil</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-md z-10">
          {isAuthenticated ? (
            <>
              <button
                onClick={() => navigate('/admin/products')}
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Administrar Panel
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
              >
                Cerrar Sesión
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 text-blue-600"
            >
              Iniciar Sesión
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;
