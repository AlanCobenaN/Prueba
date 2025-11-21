import User from '../models/User.js';

// Obtener todos los usuarios (excepto el actual)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user.id } })
      .select('-password')
      .sort({ createdAt: -1 });
    
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener usuarios', error: error.message });
  }
};

// Obtener perfil de usuario por ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener usuario', error: error.message });
  }
};

// Actualizar perfil
export const updateProfile = async (req, res) => {
  try {
    const { nombre, telefono, universidad, carrera } = req.body;

    const updatedData = {
      nombre,
      telefono,
      universidad,
      carrera,
      ...(req.file && { avatar: req.file.filename })
    };

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updatedData,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Perfil actualizado exitosamente',
      user
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar perfil', error: error.message });
  }
};
