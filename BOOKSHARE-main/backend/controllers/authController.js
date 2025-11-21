import User from '../models/User.js';
import { generateToken } from '../middleware/auth.js';
import crypto from 'crypto';
import { sendVerificationEmail, sendWelcomeEmail } from '../services/emailService.js';

// Registrar nuevo usuario
export const register = async (req, res) => {
  try {
    const { nombre, email, password, universidad, carrera, telefono } = req.body;

    // Validar campos requeridos
    if (!nombre || !email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Nombre, email y contraseña son requeridos',
        errors: ['Nombre, email y contraseña son campos obligatorios']
      });
    }

    // Validaciones de datos
    const errors = [];
    
    // Validar nombre (mínimo 3 caracteres)
    if (nombre.length < 3) {
      errors.push('El nombre debe tener al menos 3 caracteres');
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.push('El email no es válido');
    }

    // Validar contraseña (mínimo 6 caracteres)
    if (password.length < 6) {
      errors.push('La contraseña debe tener al menos 6 caracteres');
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Errores de validación',
        errors
      });
    }

    // Verificar si el usuario ya existe
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ 
        success: false,
        message: 'El email ya existe' 
      });
    }

    // Generar token de verificación (Base64 URL-safe para URLs más cortas)
    const verificationToken = crypto.randomBytes(32).toString('base64url');
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 horas

    // Crear usuario (usar 'password' para el modelo)
    const user = await User.create({
      nombre,
      email,
      password: password, // El modelo espera 'password'
      universidad,
      carrera,
      telefono,
      verificationToken,
      verificationTokenExpires,
      isVerified: false
    });

    // Enviar email de verificación
    try {
      await sendVerificationEmail(user.email, verificationToken, user.nombre);
    } catch (emailError) {
      console.error('Error al enviar email de verificación:', emailError);
      // No fallar el registro si el email falla
    }

    // Generar token JWT
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente. Por favor verifica tu correo electrónico.',
      token,
      user: {
        id: user._id,
        nombre: user.nombre,
        email: user.email,
        universidad: user.universidad,
        carrera: user.carrera,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error al registrar usuario', 
      error: error.message 
    });
  }
};

// Iniciar sesión
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar campos requeridos
    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Email y contraseña son requeridos' 
      });
    }

    // Verificar usuario
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'Email o contraseña incorrectos. Si no tienes cuenta, regístrate.' 
      });
    }

    // Verificar contraseña
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false,
        message: 'Email o contraseña incorrectos' 
      });
    }

    // Advertir si el email no está verificado
    if (!user.isVerified) {
      return res.status(403).json({ 
        success: false,
        message: 'Por favor verifica tu correo electrónico antes de iniciar sesión',
        needsVerification: true,
        email: user.email
      });
    }

    // Generar token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Inicio de sesión exitoso',
      token,
      user: {
        id: user._id,
        nombre: user.nombre,
        email: user.email,
        universidad: user.universidad,
        carrera: user.carrera,
        avatar: user.avatar,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error al iniciar sesión. Intenta de nuevo más tarde.' 
    });
  }
};

// Obtener perfil del usuario actual
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener perfil', error: error.message });
  }
};

// Verificar email
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    
    console.log('🔍 Verificando email con token:', token);
    console.log('📏 Longitud del token:', token.length);

    // Buscar usuario con el token de verificación válido
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() }
    });

    console.log('👤 Usuario encontrado:', user ? `✅ ${user.email}` : '❌ No encontrado');

    if (!user) {
      console.log('❌ Verificación fallida - Token inválido o expirado');
      console.log('   Token recibido:', token);
      console.log('   Fecha actual:', new Date());
      
      // Buscar si existe el usuario sin importar la expiración (para debug)
      const userWithoutExpiry = await User.findOne({ verificationToken: token });
      if (userWithoutExpiry) {
        console.log('   ⚠️ Usuario existe pero token expiró el:', userWithoutExpiry.verificationTokenExpires);
      } else {
        console.log('   ⚠️ No existe ningún usuario con ese token');
      }
      
      return res.status(400).json({
        success: false,
        message: 'Token de verificación inválido o expirado'
      });
    }

    console.log('✅ Verificación exitosa para:', user.email);

    // Verificar el usuario
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    console.log('💾 Usuario actualizado y verificado');

    // Enviar email de bienvenida
    try {
      await sendWelcomeEmail(user.email, user.nombre);
      console.log('📧 Email de bienvenida enviado');
    } catch (emailError) {
      console.error('Error al enviar email de bienvenida:', emailError);
    }

    res.json({
      success: true,
      message: '¡Email verificado exitosamente! Tu cuenta está activa.'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al verificar email',
      error: error.message
    });
  }
};

// Reenviar email de verificación
export const resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'Este email ya está verificado'
      });
    }

    // Generar nuevo token (Base64 URL-safe para URLs más cortas)
    const verificationToken = crypto.randomBytes(32).toString('base64url');
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    user.verificationToken = verificationToken;
    user.verificationTokenExpires = verificationTokenExpires;
    await user.save();

    // Enviar email
    await sendVerificationEmail(user.email, verificationToken, user.nombre);

    res.json({
      success: true,
      message: 'Email de verificación reenviado exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al reenviar email de verificación',
      error: error.message
    });
  }
};

// Eliminar cuenta de usuario
export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;

    // Buscar el usuario
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Importar Book model para eliminar libros
    const Book = (await import('../models/Book.js')).default;
    
    // Eliminar todos los libros publicados por el usuario
    const deletedBooks = await Book.deleteMany({ propietario: userId });
    
    // Eliminar el usuario
    await User.findByIdAndDelete(userId);

    res.json({
      success: true,
      message: 'Cuenta eliminada exitosamente',
      booksDeleted: deletedBooks.deletedCount
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar la cuenta',
      error: error.message
    });
  }
};
