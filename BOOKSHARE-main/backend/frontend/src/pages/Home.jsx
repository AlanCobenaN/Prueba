import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaBook, FaExchangeAlt, FaComments, FaUsers } from 'react-icons/fa';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div>
      <section className="text-center mb-16 bg-gradient-to-b from-amber-50/80 to-transparent rounded-2xl py-12 px-4">
        <h1 className="text-6xl font-bold mb-4 text-blue-600 drop-shadow-[0_2px_8px_rgba(255,255,255,0.9)]">
          BookShare
        </h1>
        <p className="text-2xl font-semibold text-amber-900 mb-8 drop-shadow-sm">
          Intercambia libros con estudiantes de tu universidad
        </p>
        {!isAuthenticated && (
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/register" className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-10 py-4 rounded-xl text-lg font-bold hover:from-amber-700 hover:to-amber-800 transition-all inline-block shadow-xl hover:shadow-2xl hover:scale-105 transform">
              Comenzar Ahora
            </Link>
            <Link to="/login" className="bg-white text-amber-800 px-10 py-4 rounded-xl text-lg font-bold hover:bg-amber-50 transition-all inline-block border-3 border-amber-600 shadow-xl hover:shadow-2xl hover:scale-105 transform">
              Iniciar Sesión
            </Link>
          </div>
        )}
      </section>

      <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        <div className="card text-center">
          <FaBook className="text-5xl text-blue-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2 text-amber-950">Publica tus libros</h3>
          <p className="text-amber-700">
            Comparte los libros que ya no necesitas con otros estudiantes
          </p>
        </div>

        <div className="card text-center">
          <FaExchangeAlt className="text-5xl text-green-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2 text-amber-950">Intercambia</h3>
          <p className="text-amber-700">
            Intercambia libros o préstalos temporalmente
          </p>
        </div>

        <div className="card text-center">
          <FaComments className="text-5xl text-amber-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2 text-amber-950">Comunícate</h3>
          <p className="text-amber-700">
            Chat en tiempo real para coordinar entregas
          </p>
        </div>

        <div className="card text-center">
          <FaUsers className="text-5xl text-purple-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2 text-amber-950">Comunidad</h3>
          <p className="text-amber-700">
            Califica y revisa las experiencias de intercambio
          </p>
        </div>
      </section>

      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white shadow-2xl p-12">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utb3BhY2l0eT0iLjEiLz48L2c+PC9zdmc+')] opacity-20"></div>
        <div className="relative z-10 text-center">
          <h2 className="text-4xl font-bold mb-4 text-white drop-shadow-lg">¿Listo para comenzar?</h2>
          <p className="text-xl mb-8 text-blue-50 drop-shadow-md max-w-2xl mx-auto">
            Únete a la comunidad de estudiantes que comparten conocimiento
          </p>
          {isAuthenticated ? (
            <Link to="/books" className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-10 py-4 rounded-xl text-lg font-bold hover:from-amber-600 hover:to-amber-700 transition-all inline-block shadow-xl hover:shadow-2xl hover:scale-105 transform">
              Ver Libros Disponibles
            </Link>
          ) : (
            <Link to="/register" className="bg-white text-blue-700 px-10 py-4 rounded-xl text-lg font-bold hover:bg-blue-50 transition-all inline-block shadow-xl hover:shadow-2xl hover:scale-105 transform">
              Registrarse Gratis
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
