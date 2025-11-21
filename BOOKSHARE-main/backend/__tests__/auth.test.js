import request from 'supertest';
import mongoose from 'mongoose';
import app from '../server.js';
import User from '../models/User.js';

describe('Auth Controller - POST /api/auth/register', () => {
  
  // Después de cada prueba, limpiar la BD
  afterEach(async () => {
    await User.deleteMany({});
  });

  // Después de todas las pruebas, cerrar conexión
  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('🔴 RED - Test que debe fallar (endpoint no existe)', () => {
    
    it('debería registrar un nuevo usuario con datos válidos', async () => {
      const newUser = {
        nombre: 'Juan Pérez',
        email: 'juan.perez@test.com',
        contraseña: 'Password123!',
        universidad: 'ESPOL',
        carrera: 'Ingeniería en Computación',
        telefono: '0987654321'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(newUser)
        .expect('Content-Type', /json/)
        .expect(201);

      // Verificar estructura de respuesta
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');

      // Verificar datos del usuario
      expect(response.body.user).toHaveProperty('nombre', newUser.nombre);
      expect(response.body.user).toHaveProperty('email', newUser.email);
      expect(response.body.user).toHaveProperty('universidad', newUser.universidad);
      expect(response.body.user).not.toHaveProperty('contraseña'); // No debe devolver contraseña

      // Verificar que el usuario fue guardado en BD
      const userInDb = await User.findOne({ email: newUser.email });
      expect(userInDb).toBeTruthy();
      expect(userInDb.nombre).toBe(newUser.nombre);
      expect(userInDb.contraseña).not.toBe(newUser.contraseña); // Debe estar hasheada
    });

    it('debería rechazar registro con email duplicado', async () => {
      // Crear usuario primero
      const userData = {
        nombre: 'Usuario Existente',
        email: 'existente@test.com',
        contraseña: 'Password123!',
        universidad: 'ESPOL',
        carrera: 'Sistemas'
      };

      await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      // Intentar crear otro con mismo email
      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body.message).toMatch(/email.*ya.*existe/i);
    });

    it('debería rechazar registro con datos inválidos', async () => {
      const invalidUser = {
        nombre: 'Ab', // Muy corto
        email: 'email-invalido', // Email inválido
        contraseña: '123', // Contraseña débil
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(invalidUser)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('errors');
      expect(Array.isArray(response.body.errors)).toBe(true);
    });

    it('debería rechazar registro sin campos requeridos', async () => {
      const incompleteUser = {
        nombre: 'Juan Pérez'
        // Faltan email, contraseña, etc.
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(incompleteUser)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
    });

    it('debería generar un token JWT válido', async () => {
      const newUser = {
        nombre: 'Test User',
        email: 'test.jwt@test.com',
        contraseña: 'SecurePass123!',
        universidad: 'ESPOL',
        carrera: 'Sistemas'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(newUser)
        .expect(201);

      const token = response.body.token;
      expect(token).toBeTruthy();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // JWT tiene 3 partes
    });

  });

});
