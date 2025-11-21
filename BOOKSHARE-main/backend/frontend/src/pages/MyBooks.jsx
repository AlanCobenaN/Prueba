import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookService } from '../services/bookService';
import BookCard from '../components/BookCard';
import { toast } from 'react-toastify';
import { FaPlus, FaTrashAlt, FaEdit, FaEye, FaBookOpen } from 'react-icons/fa';

const MyBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyBooks();
  }, []);

  const fetchMyBooks = async () => {
    try {
      const data = await bookService.getMyBooks();
      setBooks(data.books);
    } catch (error) {
      toast.error('Error al cargar tus libros');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este libro?')) {
      return;
    }

    try {
      await bookService.deleteBook(id);
      toast.success('Libro eliminado exitosamente');
      fetchMyBooks();
    } catch (error) {
      toast.error('Error al eliminar libro');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-amber-950 drop-shadow-[0_2px_4px_rgba(255,255,255,0.8)]">
          Mis Libros
        </h1>
        <Link to="/create-book" className="btn-primary flex items-center gap-2">
          <FaPlus />
          Publicar Libro
        </Link>
      </div>

      {books.length === 0 ? (
        <div className="card text-center py-12">
          <div className="flex justify-center mb-4">
            <FaBookOpen className="text-6xl text-amber-600" />
          </div>
          <p className="text-amber-900 text-xl mb-2 font-bold">
            Aún no has publicado ningún libro
          </p>
          <p className="text-amber-600 text-sm mb-6">
            ¡Comparte tus libros con la comunidad universitaria!
          </p>
          <Link to="/create-book" className="btn-primary inline-block">
            Publicar tu Primer Libro
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {books.map((book) => (
            <div key={book._id} className="relative group">
              <BookCard book={book} />
              <div className="mt-3 flex gap-2">
                <Link
                  to={`/books/${book._id}`}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 text-sm font-medium"
                  title="Ver detalles"
                >
                  <FaEye />
                  Ver
                </Link>
                <button
                  onClick={() => handleDelete(book._id)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all duration-200 text-sm font-medium hover:shadow-lg transform hover:scale-105"
                  title="Eliminar libro"
                >
                  <FaTrashAlt />
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBooks;
