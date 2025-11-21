import { useState, useEffect } from 'react';
import { bookService } from '../services/bookService';
import BookCard from '../components/BookCard';
import SearchBar from '../components/SearchBar';
import { toast } from 'react-toastify';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    materia: '',
    estado: ''
  });

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const params = {
        ...(search && { search }),
        ...(filters.materia && { materia: filters.materia }),
        ...(filters.estado && { estado: filters.estado })
      };
      const data = await bookService.getAllBooks(params);
      setBooks(data.books);
    } catch (error) {
      toast.error('Error al cargar los libros');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchBooks();
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
          Libros Disponibles
        </h1>
      </div>

      <SearchBar 
        search={search}
        setSearch={setSearch}
        onSearchSubmit={handleSearch}
      />

      <div className="mb-6 flex gap-4">
        <select
          value={filters.estado}
          onChange={(e) => setFilters({ ...filters, estado: e.target.value })}
          className="input-field"
        >
          <option value="">Todos los estados</option>
          <option value="Nuevo">Nuevo</option>
          <option value="Como nuevo">Como nuevo</option>
          <option value="Bueno">Bueno</option>
          <option value="Aceptable">Aceptable</option>
        </select>

        <button onClick={fetchBooks} className="btn-primary">
          Aplicar Filtros
        </button>
      </div>

      {books.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-amber-700 text-lg font-semibold">📚 No se encontraron libros</p>
          <p className="text-amber-600 text-sm mt-2">Intenta con otros filtros de búsqueda</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {books.map((book) => (
            <BookCard key={book._id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BookList;
