import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { universities, careers } from '../data/universities';
import { FaEye, FaEyeSlash, FaCheck, FaTimes, FaUser, FaEnvelope, FaUniversity, FaGraduationCap, FaPhone, FaLock, FaCheckCircle, FaInfoCircle } from 'react-icons/fa';
import AutocompleteSelect from '../components/AutocompleteSelect';

const Register = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: '',
    universidad: '',
    carrera: '',
    telefono: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const validatePassword = (password) => {
    setPasswordStrength({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    if (name === 'password') {
      validatePassword(value);
    }
  };

  const getPasswordStrengthScore = () => {
    return Object.values(passwordStrength).filter(Boolean).length;
  };

  const getPasswordStrengthColor = () => {
    const score = getPasswordStrengthScore();
    if (score <= 2) return 'bg-red-500';
    if (score <= 3) return 'bg-yellow-500';
    if (score <= 4) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = () => {
    const score = getPasswordStrengthScore();
    if (score <= 2) return 'Débil';
    if (score <= 3) return 'Media';
    if (score <= 4) return 'Fuerte';
    return 'Muy Fuerte';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    const score = getPasswordStrengthScore();
    if (score < 3) {
      toast.error('La contraseña debe tener al menos 3 de los requisitos de seguridad');
      return;
    }

    try {
      const { confirmPassword, ...userData } = formData;
      await register(userData);
      toast.success('¡Registro exitoso! Revisa tu correo para verificar tu cuenta', {
        autoClose: 5000
      });
      // Redirigir al login en lugar de books
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al registrarse');
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="card">
        <h2 className="text-3xl font-bold text-center mb-2 text-amber-950">Crear Cuenta</h2>
        <p className="text-center text-amber-700 mb-4">Únete a la comunidad de intercambio de libros</p>
        
        {/* Banner informativo */}
        <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-300 rounded-lg flex items-start gap-3">
          <FaInfoCircle className="text-blue-600 text-xl flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold text-blue-900 mb-1">📧 Verificación de Email Requerida</p>
            <p className="text-blue-800">
              Después de registrarte, recibirás un correo electrónico con un enlace de verificación. 
              Debes verificar tu email antes de poder iniciar sesión.
            </p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Nombre Completo */}
            <div>
              <label className="text-sm font-semibold mb-2 text-amber-900 flex items-center gap-2">
                <FaUser className="text-amber-600" />
                Nombre Completo *
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="input-field"
                placeholder="Ej: Juan Pérez"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-semibold mb-2 text-amber-900 flex items-center gap-2">
                <FaEnvelope className="text-amber-600" />
                Correo Electrónico *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-field"
                placeholder="tu@email.com"
                required
              />
              <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                <FaCheckCircle className="text-green-600" />
                Recibirás un correo de confirmación
              </p>
            </div>

            {/* Universidad - AUTOCOMPLETE */}
            <div>
              <label className="text-sm font-semibold mb-2 text-amber-900 flex items-center gap-2">
                <FaUniversity className="text-amber-600" />
                Universidad *
              </label>
              <AutocompleteSelect
                options={universities}
                value={formData.universidad}
                onChange={handleChange}
                name="universidad"
                placeholder="Escribe o selecciona tu universidad"
                required={true}
              />
            </div>

            {/* Carrera - AUTOCOMPLETE */}
            <div>
              <label className="text-sm font-semibold mb-2 text-amber-900 flex items-center gap-2">
                <FaGraduationCap className="text-amber-600" />
                Carrera *
              </label>
              <AutocompleteSelect
                options={careers}
                value={formData.carrera}
                onChange={handleChange}
                name="carrera"
                placeholder="Escribe o selecciona tu carrera"
                required={true}
              />
            </div>

            {/* Teléfono */}
            <div className="md:col-span-2">
              <label className="text-sm font-semibold mb-2 text-amber-900 flex items-center gap-2">
                <FaPhone className="text-amber-600" />
                Teléfono (opcional)
              </label>
              <input
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                className="input-field"
                placeholder="0999999999"
                pattern="[0-9]{10}"
                title="Debe contener 10 dígitos"
              />
            </div>

            {/* Contraseña con visualización */}
            <div>
              <label className="text-sm font-semibold mb-2 text-amber-900 flex items-center gap-2">
                <FaLock className="text-amber-600" />
                Contraseña *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input-field pr-10"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-600 hover:text-amber-800"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              
              {/* Indicador de fortaleza de contraseña */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-amber-800">Fortaleza:</span>
                    <span className={`text-xs font-bold ${
                      getPasswordStrengthScore() <= 2 ? 'text-red-600' :
                      getPasswordStrengthScore() <= 3 ? 'text-yellow-600' :
                      getPasswordStrengthScore() <= 4 ? 'text-blue-600' : 'text-green-600'
                    }`}>
                      {getPasswordStrengthText()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all ${getPasswordStrengthColor()}`}
                      style={{ width: `${(getPasswordStrengthScore() / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {/* Confirmar Contraseña */}
            <div>
              <label className="text-sm font-semibold mb-2 text-amber-900 flex items-center gap-2">
                <FaLock className="text-amber-600" />
                Confirmar Contraseña *
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="input-field pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-600 hover:text-amber-800"
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {formData.confirmPassword && (
                <p className={`text-xs mt-1 flex items-center gap-1 ${
                  formData.password === formData.confirmPassword ? 'text-green-600' : 'text-red-600'
                }`}>
                  {formData.password === formData.confirmPassword ? (
                    <><FaCheck /> Las contraseñas coinciden</>
                  ) : (
                    <><FaTimes /> Las contraseñas no coinciden</>
                  )}
                </p>
              )}
            </div>
          </div>

          {/* Requisitos de contraseña */}
          {formData.password && (
            <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-4">
              <p className="text-sm font-semibold text-amber-900 mb-2">Requisitos de contraseña:</p>
              <div className="grid md:grid-cols-2 gap-2">
                <div className={`flex items-center gap-2 text-sm ${passwordStrength.length ? 'text-green-600' : 'text-gray-500'}`}>
                  {passwordStrength.length ? <FaCheck /> : <FaTimes />}
                  Mínimo 8 caracteres
                </div>
                <div className={`flex items-center gap-2 text-sm ${passwordStrength.uppercase ? 'text-green-600' : 'text-gray-500'}`}>
                  {passwordStrength.uppercase ? <FaCheck /> : <FaTimes />}
                  Una letra mayúscula
                </div>
                <div className={`flex items-center gap-2 text-sm ${passwordStrength.lowercase ? 'text-green-600' : 'text-gray-500'}`}>
                  {passwordStrength.lowercase ? <FaCheck /> : <FaTimes />}
                  Una letra minúscula
                </div>
                <div className={`flex items-center gap-2 text-sm ${passwordStrength.number ? 'text-green-600' : 'text-gray-500'}`}>
                  {passwordStrength.number ? <FaCheck /> : <FaTimes />}
                  Un número
                </div>
                <div className={`flex items-center gap-2 text-sm ${passwordStrength.special ? 'text-green-600' : 'text-gray-500'}`}>
                  {passwordStrength.special ? <FaCheck /> : <FaTimes />}
                  Un carácter especial (!@#$...)
                </div>
              </div>
            </div>
          )}

          <button 
            type="submit" 
            className="btn-primary w-full text-lg py-3"
            disabled={getPasswordStrengthScore() < 3 || formData.password !== formData.confirmPassword}
          >
            Crear Cuenta
          </button>
        </form>

        <p className="text-center mt-6 text-amber-800">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-amber-700 hover:text-amber-900 font-semibold hover:underline">
            Inicia sesión aquí
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
