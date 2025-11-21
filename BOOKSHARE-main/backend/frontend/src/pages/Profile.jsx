import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { 
  FaUser, 
  FaEnvelope, 
  FaUniversity, 
  FaGraduationCap, 
  FaPhone, 
  FaStar, 
  FaExchangeAlt,
  FaUserCircle,
  FaTrashAlt,
  FaExclamationTriangle
} from 'react-icons/fa';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [deleting, setDeleting] = useState(false);

  if (!user) return null;

  const handleDeleteAccount = async () => {
    if (confirmText !== 'ELIMINAR') {
      toast.error('Debes escribir "ELIMINAR" para confirmar');
      return;
    }

    setDeleting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete('http://localhost:5000/api/auth/delete-account', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        toast.success(`Cuenta eliminada. ${response.data.booksDeleted} libros eliminados.`);
        logout();
        navigate('/');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al eliminar la cuenta');
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-6 text-amber-950 drop-shadow-[0_2px_4px_rgba(255,255,255,0.8)]">
        👤 Mi Perfil
      </h1>

      <div className="card">
        {/* Header del perfil con avatar y nombre */}
        <div className="bg-gradient-to-r from-amber-100 to-orange-100 -m-6 mb-6 p-8 rounded-t-lg border-b-2 border-amber-300">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-5xl font-bold shadow-xl ring-4 ring-white">
                {user.nombre.charAt(0).toUpperCase()}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-amber-500 rounded-full p-2 shadow-lg">
                <FaUserCircle className="text-white text-2xl" />
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-amber-950 mb-2">{user.nombre}</h2>
              <div className="flex items-center gap-2 text-amber-700">
                <FaEnvelope className="text-sm" />
                <p className="text-lg">{user.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Grid de información */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Universidad */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-xl border-2 border-amber-200 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-amber-500 p-3 rounded-lg">
                <FaUniversity className="text-white text-2xl" />
              </div>
              <h3 className="font-bold text-lg text-amber-900">Universidad</h3>
            </div>
            <p className="text-amber-800 text-xl font-semibold pl-14">{user.universidad}</p>
          </div>

          {/* Carrera */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-xl border-2 border-amber-200 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-purple-500 p-3 rounded-lg">
                <FaGraduationCap className="text-white text-2xl" />
              </div>
              <h3 className="font-bold text-lg text-amber-900">Carrera</h3>
            </div>
            <p className="text-amber-800 text-xl font-semibold pl-14">{user.carrera}</p>
          </div>

          {/* Teléfono */}
          {user.telefono && (
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-xl border-2 border-amber-200 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-green-500 p-3 rounded-lg">
                  <FaPhone className="text-white text-2xl" />
                </div>
                <h3 className="font-bold text-lg text-amber-900">Teléfono</h3>
              </div>
              <p className="text-amber-800 text-xl font-semibold pl-14">{user.telefono}</p>
            </div>
          )}

          {/* Calificación */}
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-xl border-2 border-yellow-300 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-yellow-500 p-3 rounded-lg">
                <FaStar className="text-white text-2xl" />
              </div>
              <h3 className="font-bold text-lg text-yellow-900">Calificación</h3>
            </div>
            <div className="flex items-center gap-2 pl-14">
              <p className="text-4xl font-bold text-yellow-600">{user.calificacion || 0}</p>
              <FaStar className="text-yellow-500 text-3xl" />
            </div>
          </div>

          {/* Intercambios Realizados */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border-2 border-green-300 shadow-md hover:shadow-lg transition-shadow md:col-span-2">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-green-500 p-3 rounded-lg">
                <FaExchangeAlt className="text-white text-2xl" />
              </div>
              <h3 className="font-bold text-lg text-green-900">Intercambios Realizados</h3>
            </div>
            <div className="flex items-center justify-between pl-14">
              <p className="text-5xl font-bold text-green-600">{user.numeroIntercambios || 0}</p>
              <div className="text-right">
                <p className="text-sm text-green-700">
                  {user.numeroIntercambios === 0 
                    ? '¡Empieza tu primer intercambio!' 
                    : user.numeroIntercambios === 1
                    ? '¡Gran comienzo! Sigue compartiendo'
                    : '¡Excelente trabajo compartiendo libros!'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Zona de Peligro */}
      <div className="card mt-6 border-2 border-red-300">
        <div className="flex items-center gap-3 mb-4">
          <FaExclamationTriangle className="text-red-600 text-2xl" />
          <h2 className="text-2xl font-bold text-red-700">Zona de Peligro</h2>
        </div>
        <p className="text-amber-700 mb-4">
          Una vez que elimines tu cuenta, no hay vuelta atrás. Todos tus datos y libros publicados serán eliminados permanentemente.
        </p>
        <button
          onClick={() => setShowDeleteModal(true)}
          className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold"
        >
          <FaTrashAlt />
          Eliminar mi cuenta
        </button>
      </div>

      {/* Modal de Confirmación */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-red-100 p-3 rounded-full">
                <FaExclamationTriangle className="text-red-600 text-3xl" />
              </div>
              <h3 className="text-2xl font-bold text-red-700">¿Eliminar Cuenta?</h3>
            </div>

            <div className="mb-6">
              <p className="text-amber-800 mb-4">
                Esta acción es <strong>permanente e irreversible</strong>. Se eliminará:
              </p>
              <ul className="list-disc list-inside text-amber-700 space-y-2 mb-4">
                <li>Tu perfil y toda tu información personal</li>
                <li>Todos los libros que has publicado</li>
                <li>Tu historial de intercambios</li>
                <li>Tus calificaciones y reseñas</li>
              </ul>
              <p className="text-sm text-red-600 font-semibold bg-red-50 p-3 rounded-lg border border-red-200">
                ⚠️ Esta acción NO se puede deshacer
              </p>
            </div>

            <div className="mb-6">
              <label className="text-sm font-semibold mb-2 text-amber-900 flex flex-col">
                Para confirmar, escribe <span className="text-red-600">"ELIMINAR"</span> en el campo:
              </label>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="Escribe ELIMINAR"
                className="input-field mt-2"
                autoFocus
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setConfirmText('');
                }}
                disabled={deleting}
                className="flex-1 px-4 py-3 bg-amber-100 text-amber-800 rounded-lg hover:bg-amber-200 transition-colors font-semibold disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={confirmText !== 'ELIMINAR' || deleting}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Eliminando...
                  </>
                ) : (
                  <>
                    <FaTrashAlt />
                    Eliminar Cuenta
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
