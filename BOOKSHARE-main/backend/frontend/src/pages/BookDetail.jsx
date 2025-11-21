import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { bookService } from '../services/bookService';
import { exchangeService } from '../services/exchangeService';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { 
  FaStar, 
  FaUser, 
  FaBook, 
  FaGraduationCap, 
  FaBarcode, 
  FaBuilding, 
  FaCheckCircle, 
  FaHandshake,
  FaFileAlt 
} from 'react-icons/fa';

const BookDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showExchangeModal, setShowExchangeModal] = useState(false);
  const [exchangeData, setExchangeData] = useState({
    tipo: 'Préstamo',
    mensaje: ''
  });

  useEffect(() => {
    fetchBook();
  }, [id]);

  const fetchBook = async () => {
    try {
      const data = await bookService.getBookById(id);
      setBook(data.book);
    } catch (error) {
      toast.error('Error al cargar el libro');
      navigate('/books');
    } finally {
      setLoading(false);
    }
  };

  const handleExchangeRequest = async () => {
    try {
      await exchangeService.createExchange({
        libroId: book._id,
        tipo: exchangeData.tipo,
        mensaje: exchangeData.mensaje
      });
      toast.success('Solicitud enviada exitosamente');
      setShowExchangeModal(false);
      navigate('/exchanges');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al enviar solicitud');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!book) return null;

  const imageUrl = book.foto && book.foto !== 'default-book.jpg'
    ? `http://localhost:5000/uploads/${book.foto}`
    : '/book-placeholder.jpg';

  // Usar tanto user.id como user._id para compatibilidad
  const currentUserId = user?.id || user?._id;
  const isOwner = currentUserId === book.propietario?._id;

  console.log('Usuario actual ID:', currentUserId);
  console.log('Propietario del libro ID:', book.propietario?._id);
  console.log('¿Es propietario?:', isOwner);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <img
              src={imageUrl}
              alt={book.titulo}
              className="w-full rounded-lg shadow-lg"
            />
          </div>

          <div>
            <h1 className="text-4xl font-bold mb-4 text-amber-950 drop-shadow-[0_2px_4px_rgba(255,255,255,0.8)]">
              {book.titulo}
            </h1>
            <p className="text-xl text-amber-800 mb-4 font-medium">
              por <span className="italic">{book.autor}</span>
            </p>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
                <FaGraduationCap className="text-2xl text-amber-700" />
                <div>
                  <span className="text-sm text-amber-600">Materia</span>
                  <p className="font-semibold text-amber-900">{book.materia}</p>
                </div>
              </div>
              
              {book.isbn && (
                <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <FaBarcode className="text-2xl text-purple-700" />
                  <div>
                    <span className="text-sm text-amber-600">ISBN</span>
                    <p className="font-semibold text-amber-900">{book.isbn}</p>
                  </div>
                </div>
              )}

              {book.editorial && (
                <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <FaBuilding className="text-2xl text-orange-700" />
                  <div>
                    <span className="text-sm text-amber-600">Editorial</span>
                    <p className="font-semibold text-amber-900">{book.editorial}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
                <FaCheckCircle className="text-2xl text-green-700" />
                <div className="flex-1">
                  <span className="text-sm text-amber-600">Estado</span>
                  <p className="font-semibold">
                    <span className={`px-3 py-1 rounded ${
                      book.estado === 'Nuevo' || book.estado === 'Como nuevo'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {book.estado}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
                <FaHandshake className="text-2xl text-indigo-700" />
                <div className="flex-1">
                  <span className="text-sm text-amber-600">Tipo de oferta</span>
                  <p className="font-semibold">
                    <span className="px-3 py-1 rounded bg-blue-100 text-blue-800">
                      {book.tipoOferta}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {book.descripcion && (
              <div className="mb-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
                <div className="flex items-center gap-2 mb-2">
                  <FaFileAlt className="text-xl text-amber-700" />
                  <h3 className="font-semibold text-amber-900">Descripción:</h3>
                </div>
                <p className="text-amber-800">{book.descripcion}</p>
              </div>
            )}

            <div className="border-t pt-6 mb-6">
              <h3 className="font-semibold mb-3">Propietario:</h3>
              <div className="flex items-center space-x-4">
                <FaUser className="text-3xl text-gray-400" />
                <div>
                  <p className="font-medium">{book.propietario.nombre}</p>
                  <p className="text-sm text-gray-600">{book.propietario.universidad}</p>
                  <p className="text-sm text-gray-600">{book.propietario.carrera}</p>
                  {book.propietario.calificacion > 0 && (
                    <div className="flex items-center mt-1">
                      <FaStar className="text-yellow-400 mr-1" />
                      <span>{book.propietario.calificacion}</span>
                      <span className="text-gray-500 text-sm ml-2">
                        ({book.propietario.numeroIntercambios} intercambios)
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {!isOwner && book.disponible && (
              <div className="space-y-3">
                <button
                  onClick={() => setShowExchangeModal(true)}
                  className="btn-primary w-full"
                >
                  Solicitar {book.tipoOferta}
                </button>
                <button
                  onClick={() => navigate(`/chat/${book.propietario._id}`)}
                  className="btn-outline w-full"
                >
                  Enviar Mensaje
                </button>
              </div>
            )}

            {isOwner && (
              <div className="bg-gradient-to-r from-amber-100 to-orange-100 p-4 rounded-lg border-2 border-amber-300 shadow-md">
                <p className="text-amber-900 font-semibold flex items-center gap-2">
                  <span className="text-2xl">📖</span>
                  Este es tu libro
                </p>
              </div>
            )}

            {!book.disponible && !isOwner && (
              <div className="bg-gradient-to-r from-gray-100 to-gray-200 p-4 rounded-lg border-2 border-gray-300">
                <p className="text-gray-700 font-semibold">📕 Este libro no está disponible actualmente</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {showExchangeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-6 max-w-md w-full border-2 border-amber-300 shadow-2xl">
            <h2 className="text-2xl font-bold mb-4 text-amber-900">Solicitar {book.tipoOferta}</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Tipo</label>
                <select
                  value={exchangeData.tipo}
                  onChange={(e) => setExchangeData({ ...exchangeData, tipo: e.target.value })}
                  className="input-field"
                >
                  {(book.tipoOferta === 'Ambos' || book.tipoOferta === 'Préstamo') && (
                    <option value="Préstamo">Préstamo</option>
                  )}
                  {(book.tipoOferta === 'Ambos' || book.tipoOferta === 'Intercambio') && (
                    <option value="Intercambio">Intercambio</option>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Mensaje (opcional)</label>
                <textarea
                  value={exchangeData.mensaje}
                  onChange={(e) => setExchangeData({ ...exchangeData, mensaje: e.target.value })}
                  className="input-field"
                  rows="3"
                  placeholder="Escribe un mensaje al propietario..."
                ></textarea>
              </div>

              <div className="flex gap-3">
                <button onClick={handleExchangeRequest} className="btn-primary flex-1">
                  Enviar Solicitud
                </button>
                <button 
                  onClick={() => setShowExchangeModal(false)}
                  className="btn-outline flex-1"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookDetail;
