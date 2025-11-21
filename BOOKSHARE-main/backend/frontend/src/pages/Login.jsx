import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FaEnvelope, FaExclamationTriangle } from 'react-icons/fa';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showVerificationWarning, setShowVerificationWarning] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState('');
  const [resendingEmail, setResendingEmail] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData.email, formData.password);
      toast.success('¡Bienvenido!');
      navigate('/books');
    } catch (error) {
      const errorData = error.response?.data;
      
      // Si necesita verificación, mostrar advertencia
      if (errorData?.needsVerification) {
        setShowVerificationWarning(true);
        setUnverifiedEmail(errorData.email);
        toast.error(errorData.message);
      } else {
        toast.error(errorData?.message || 'Error al iniciar sesión');
      }
    }
  };

  const handleResendVerification = async () => {
    setResendingEmail(true);
    try {
      await axios.post('http://localhost:5000/api/auth/resend-verification', {
        email: unverifiedEmail
      });
      toast.success('Email de verificación reenviado. Revisa tu bandeja de entrada.');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al reenviar email');
    } finally {
      setResendingEmail(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="card">
        <h2 className="text-2xl font-bold text-center mb-6 text-amber-950">Iniciar Sesión</h2>
        
        {/* Advertencia de verificación */}
        {showVerificationWarning && (
          <div className="mb-4 p-4 bg-amber-50 border-2 border-amber-400 rounded-lg">
            <div className="flex items-start gap-3">
              <FaExclamationTriangle className="text-amber-600 text-xl flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="font-bold text-amber-900 mb-1">Email no verificado</h3>
                <p className="text-sm text-amber-800 mb-3">
                  Necesitas verificar tu correo electrónico antes de iniciar sesión.
                  Revisa tu bandeja de entrada en <strong>{unverifiedEmail}</strong>
                </p>
                <button
                  onClick={handleResendVerification}
                  disabled={resendingEmail}
                  className="flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors text-sm font-semibold disabled:opacity-50"
                >
                  {resendingEmail ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Enviando...
                    </>
                  ) : (
                    <>
                      <FaEnvelope />
                      Reenviar Email de Verificación
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Contraseña</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>

          <button type="submit" className="btn-primary w-full">
            Iniciar Sesión
          </button>
        </form>

        <p className="text-center mt-4 text-amber-700">
          ¿No tienes cuenta?{' '}
          <Link to="/register" className="text-amber-800 font-semibold hover:underline">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
