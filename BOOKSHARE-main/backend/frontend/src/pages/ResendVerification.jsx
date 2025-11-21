import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaEnvelope, FaPaperPlane } from 'react-icons/fa';

const ResendVerification = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/auth/resend-verification', {
        email
      });

      if (response.data.success) {
        toast.success(response.data.message);
        setEmail('');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al reenviar el email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="card">
          <div className="text-center mb-6">
            <FaEnvelope className="text-5xl text-amber-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-amber-950 mb-2">
              Reenviar Verificación
            </h2>
            <p className="text-amber-700">
              Ingresa tu email y te enviaremos un nuevo enlace de verificación
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-semibold mb-2 text-amber-900 flex items-center gap-2">
                <FaEnvelope className="text-amber-600" />
                Correo Electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="tu@email.com"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Enviando...
                </>
              ) : (
                <>
                  <FaPaperPlane />
                  Reenviar Email
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-amber-700">
              ¿Ya verificaste tu cuenta?{' '}
              <Link to="/login" className="text-amber-800 font-semibold hover:underline">
                Iniciar Sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResendVerification;
