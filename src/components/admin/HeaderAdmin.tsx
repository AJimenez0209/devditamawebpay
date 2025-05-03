import { Link, useNavigate } from 'react-router-dom';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { HomeIcon, UserIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { Logo } from '../Logo';
import { useAuth } from '../../context/AuthContext';

const HeaderAdmin = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Logo />

        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center text-blue-700 hover:text-blue-900 text-sm">
            <HomeIcon className="h-5 w-5 mr-1" />
            Ir a la tienda
          </Link>

          <Menu as="div" className="relative">
            <Menu.Button className="flex items-center gap-1 text-sm text-gray-700 hover:text-gray-900">
              <UserIcon className="h-5 w-5" />
              Mi Perfil
            </Menu.Button>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 mt-2 w-40 origin-top-right bg-white border border-gray-200 rounded-md shadow-lg focus:outline-none z-50">
                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={handleLogout}
                        className={`${
                          active ? 'bg-gray-100' : ''
                        } flex w-full items-center px-4 py-2 text-sm text-red-600`}
                      >
                        <ArrowRightOnRectangleIcon className="h-4 w-4 mr-2" />
                        Cerrar Sesión
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
    </header>
  );
};

export default HeaderAdmin;
