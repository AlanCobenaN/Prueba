import Book from '../models/Book.js';

// Crear un nuevo libro
export const createBook = async (req, res) => {
  try {
    const bookData = {
      ...req.body,
      propietario: req.user.id,
      foto: req.file ? req.file.filename : 'default-book.jpg'
    };

    const book = await Book.create(bookData);
    await book.populate('propietario', 'nombre universidad');

    res.status(201).json({
      success: true,
      message: 'Libro publicado exitosamente',
      book
    });
  } catch (error) {
    // Si hay error y se subió un archivo, eliminarlo
    if (req.file && req.file.path) {
      const fs = await import('fs');
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({ 
      success: false,
      message: 'Error al crear libro', 
      error: error.message 
    });
  }
};

// Obtener todos los libros disponibles
export const getAllBooks = async (req, res) => {
  try {
    const { search, query, materia, estado, page = 1, limit = 12 } = req.query;
    
    const filter = { disponible: true };

    // Búsqueda por texto (título o autor)
    const searchTerm = search || query;
    if (searchTerm) {
      filter.$or = [
        { titulo: { $regex: searchTerm, $options: 'i' } },
        { autor: { $regex: searchTerm, $options: 'i' } },
        { descripcion: { $regex: searchTerm, $options: 'i' } }
      ];
    }

    // Filtro por materia
    if (materia) {
      filter.materia = { $regex: materia, $options: 'i' };
    }

    // Filtro por estado
    if (estado) {
      filter.estado = estado;
    }

    const books = await Book.find(filter)
      .populate('propietario', 'nombre universidad calificacion')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await Book.countDocuments(filter);

    res.json({
      success: true,
      books,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      total: count
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error al obtener libros', 
      error: error.message 
    });
  }
};

// Obtener un libro por ID
export const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
      .populate('propietario', 'nombre email universidad carrera telefono calificacion numeroIntercambios');

    if (!book) {
      return res.status(404).json({ message: 'Libro no encontrado' });
    }

    res.json({ success: true, book });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener libro', error: error.message });
  }
};

// Obtener libros del usuario actual
export const getMyBooks = async (req, res) => {
  try {
    const books = await Book.find({ propietario: req.user.id })
      .sort({ createdAt: -1 });

    res.json({ success: true, books });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener tus libros', error: error.message });
  }
};

// Actualizar un libro
export const updateBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: 'Libro no encontrado' });
    }

    // Verificar que el usuario es el propietario
    if (book.propietario.toString() !== req.user.id) {
      return res.status(403).json({ message: 'No autorizado' });
    }

    const updatedData = {
      ...req.body,
      ...(req.file && { foto: req.file.filename })
    };

    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Libro actualizado exitosamente',
      book: updatedBook
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar libro', error: error.message });
  }
};

// Eliminar un libro
export const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: 'Libro no encontrado' });
    }

    // Verificar que el usuario es el propietario
    if (book.propietario.toString() !== req.user.id) {
      return res.status(403).json({ message: 'No autorizado' });
    }

    await book.deleteOne();

    res.json({
      success: true,
      message: 'Libro eliminado exitosamente'
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar libro', error: error.message });
  }
};
