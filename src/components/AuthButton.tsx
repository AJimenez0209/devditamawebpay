import React from 'react';
import { useNavigate } from 'react-router-dom';

const AuthButton = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  let isAdmin = false;

  if (token) {
    try {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      isAdmin = decoded.isAdmin;
    } catch (err) {
      localStorage.removeItem('token');
    }
  }

  const handleClick = () => {
    if (!token) {
      navigate('/login');
    } else if (isAdmin) {
      navigate('/admin/products');
    } else {
      navigate('/');
    }
  };

  return (
    <button
      onClick={handleClick}
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
    >
      {token ? (isAdmin ? 'Panel Admin' : 'Inicio') : 'Iniciar Sesión'}
    </button>
  );
};

export default AuthButton;
