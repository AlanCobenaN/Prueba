import { Link } from 'react-router-dom';
import { FaUser, FaStar } from 'react-icons/fa';

const BookCard = ({ book }) => {
  const imageUrl = book.foto && book.foto !== 'default-book.jpg'
    ? `http://localhost:5000/uploads/${book.foto}`
    : '/book-placeholder.jpg';

  return (
    <div className="card hover:shadow-xl transition-shadow">
      <Link to={`/books/${book._id}`}>
        <img
          src={imageUrl}
          alt={book.titulo}
          className="w-full h-48 object-cover rounded-lg mb-4"
        />
      </Link>
      
      <Link to={`/books/${book._id}`}>
        <h3 className="text-lg font-semibold mb-2 hover:text-primary">{book.titulo}</h3>
      </Link>
      
      <p className="text-gray-600 text-sm mb-2">por {book.autor}</p>
      <p className="text-sm text-gray-500 mb-3">{book.materia}</p>
      
      <div className="flex items-center justify-between mb-3">
        <span className={`text-xs px-2 py-1 rounded ${
          book.estado === 'Nuevo' || book.estado === 'Como nuevo'
            ? 'bg-green-100 text-green-700'
            : 'bg-yellow-100 text-yellow-700'
        }`}>
          {book.estado}
        </span>
        <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700">
          {book.tipoOferta}
        </span>
      </div>

      {book.propietario && (
        <div className="flex items-center text-sm text-gray-600">
          <FaUser className="mr-2" />
          <span>{book.propietario.nombre}</span>
          {book.propietario.calificacion > 0 && (
            <div className="flex items-center ml-2">
              <FaStar className="text-yellow-400 mr-1" />
              <span>{book.propietario.calificacion}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BookCard;
