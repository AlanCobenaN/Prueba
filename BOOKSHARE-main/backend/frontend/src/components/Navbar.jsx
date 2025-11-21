import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaBook, FaExchangeAlt, FaComments, FaUser, FaSignOutAlt, FaUsers, FaChevronDown, FaUserCircle } from 'react-icons/fa';
import { useState } from 'react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-amber-900 to-amber-800 shadow-lg">
      <div className="px-4">
        <div className="flex items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <FaBook className="text-amber-200 text-2xl" />
            <span className="text-xl font-bold text-white">BookShare</span>
          </Link>

          <div className="flex items-center space-x-7 ml-auto">
            {isAuthenticated ? (
              <>
                <Link to="/books" className="flex items-center space-x-1 text-amber-100 hover:text-white transition-colors">
                  <FaBook />
                  <span>Libros</span>
                </Link>
                <div className="h-6 w-px bg-amber-600"></div>
                <Link to="/exchanges" className="flex items-center space-x-1 text-amber-100 hover:text-white transition-colors">
                  <FaExchangeAlt />
                  <span>Intercambios</span>
                </Link>
                <div className="h-6 w-px bg-amber-600"></div>
                <Link to="/users" className="flex items-center space-x-1 text-amber-100 hover:text-white transition-colors">
                  <FaUsers />
                  <span>Usuarios</span>
                </Link>
                <div className="h-6 w-px bg-amber-600"></div>
                <Link to="/chat" className="flex items-center space-x-1 text-amber-100 hover:text-white transition-colors">
                  <FaComments />
                  <span>Chat</span>
                </Link>
                <div className="h-6 w-px bg-amber-600"></div>
                
                {/* Menú desplegable de usuario */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 text-amber-100 hover:text-white transition-colors bg-amber-800 px-3 py-2 rounded-lg hover:bg-amber-700"
                  >
                    <FaUser />
                    <span>{user?.nombre}</span>
                    <FaChevronDown className={`text-xs transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {showUserMenu && (
                    <>
                      {/* Overlay para cerrar el menú al hacer clic fuera */}
                      <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setShowUserMenu(false)}
                      ></div>
                      
                      {/* Menú desplegable */}
                      <div className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-xl border border-amber-200 py-2 z-20">
                        <Link
                          to="/profile"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center space-x-3 px-4 py-3 text-amber-900 hover:bg-amber-50 transition-colors"
                        >
                          <FaUserCircle className="text-amber-700 text-xl" />
                          <span className="font-semibold">Mi Perfil</span>
                        </Link>
                        <Link
                          to="/my-books"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center space-x-3 px-4 py-3 text-amber-900 hover:bg-amber-50 transition-colors"
                        >
                          <FaBook className="text-amber-700" />
                          <span className="font-semibold">Mis Libros</span>
                        </Link>
                        <hr className="my-2 border-amber-200" />
                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            logout();
                          }}
                          className="w-full flex items-center space-x-3 px-4 py-3 text-red-700 hover:bg-red-50 transition-colors"
                        >
                          <FaSignOutAlt />
                          <span className="font-semibold">Cerrar Sesión</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-amber-100 hover:text-white transition-colors">Iniciar Sesión</Link>
                <Link to="/register" className="bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-lg transition-colors">Registrarse</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
