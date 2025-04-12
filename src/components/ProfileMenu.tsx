import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';

const ProfileMenu = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
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
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;
