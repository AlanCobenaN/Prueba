import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FaCheckCircle, FaTimesCircle, FaSpinner } from 'react-icons/fa';

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Limpiar cualquier token de sesión no verificada
    localStorage.removeItem('token');
    verifyEmail();
  }, [token]);

  const verifyEmail = async () => {
    try {
      console.log('🔍 Verificando email con token:', token);
      const response = await axios.get(`http://localhost:5000/api/auth/verify-email/${token}`);
      
      console.log('✅ Respuesta del servidor:', response.data);
      
      if (response.data.success) {
        setStatus('success');
        setMessage(response.data.message);
        
        // Redirigir al login después de 3 segundos
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        // Por si acaso success viene como false
        setStatus('error');
        setMessage(response.data.message || 'Error desconocido');
      }
    } catch (error) {
      console.error('❌ Error al verificar:', error);
      console.error('📋 Detalles:', error.response?.data);
      setStatus('error');
      setMessage(error.response?.data?.message || 'Error al verificar el email');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="card text-center py-12 px-6">
          {status === 'loading' && (
            <>
              <FaSpinner className="text-6xl text-amber-600 mx-auto mb-4 animate-spin" />
              <h2 className="text-2xl font-bold text-amber-950 mb-2">
                Verificando tu email...
              </h2>
              <p className="text-amber-700">
                Por favor espera un momento
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="mb-4">
                <FaCheckCircle className="text-6xl text-green-600 mx-auto animate-bounce" />
              </div>
              <h2 className="text-2xl font-bold text-green-800 mb-2">
                ¡Email Verificado!
              </h2>
              <p className="text-amber-700 mb-4">
                {message}
              </p>
              <p className="text-sm text-amber-600">
                Redirigiendo al inicio de sesión...
              </p>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="mb-4">
                <FaTimesCircle className="text-6xl text-red-600 mx-auto" />
              </div>
              <h2 className="text-2xl font-bold text-red-800 mb-2">
                Error de Verificación
              </h2>
              <p className="text-amber-700 mb-6">
                {message}
              </p>
              <div className="space-y-3">
                <Link
                  to="/login"
                  className="btn-primary inline-block w-full"
                >
                  Ir a Iniciar Sesión
                </Link>
                <p className="text-sm text-amber-600">
                  ¿El enlace expiró?{' '}
                  <Link to="/resend-verification" className="text-amber-800 font-semibold hover:underline">
                    Reenviar email de verificación
                  </Link>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
