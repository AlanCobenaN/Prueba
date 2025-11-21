import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { exchangeService } from '../services/exchangeService';
import { toast } from 'react-toastify';
import { FaBook, FaUser, FaClock, FaCheck, FaTimes, FaComments } from 'react-icons/fa';

const Exchanges = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('received');
  const [exchanges, setExchanges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExchanges();
  }, [activeTab]);

  const fetchExchanges = async () => {
    try {
      setLoading(true);
      const data = activeTab === 'received' 
        ? await exchangeService.getReceivedExchanges()
        : await exchangeService.getSentExchanges();
      setExchanges(data.exchanges);
    } catch (error) {
      toast.error('Error al cargar intercambios');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, estado) => {
    try {
      await exchangeService.updateExchangeStatus(id, estado);
      toast.success(`Solicitud ${estado.toLowerCase()} exitosamente`);
      fetchExchanges();
    } catch (error) {
      toast.error('Error al actualizar estado');
    }
  };

  const getStatusColor = (estado) => {
    switch (estado) {
      case 'Pendiente':
        return 'bg-yellow-100 text-yellow-700';
      case 'Aceptado':
        return 'bg-green-100 text-green-700';
      case 'Rechazado':
        return 'bg-red-100 text-red-700';
      case 'Completado':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
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
      <h1 className="text-3xl font-bold mb-6">Mis Intercambios</h1>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab('received')}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'received'
              ? 'bg-primary text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Recibidas
        </button>
        <button
          onClick={() => setActiveTab('sent')}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'sent'
              ? 'bg-primary text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Enviadas
        </button>
      </div>

      {exchanges.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-500 text-lg">
            No hay intercambios {activeTab === 'received' ? 'recibidos' : 'enviados'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {exchanges.map((exchange) => (
            <div key={exchange._id} className="card">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                  <img
                    src={`http://localhost:5000/uploads/${exchange.libro.foto}`}
                    alt={exchange.libro.titulo}
                    className="w-32 h-40 object-cover rounded-lg"
                  />
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-xl font-semibold mb-1">
                        {exchange.libro.titulo}
                      </h3>
                      <p className="text-gray-600">{exchange.libro.autor}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(exchange.estado)}`}>
                      {exchange.estado}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <FaUser className="mr-2" />
                      {activeTab === 'received' ? (
                        <span>Solicitante: {exchange.solicitante.nombre}</span>
                      ) : (
                        <span>Propietario: {exchange.propietario.nombre}</span>
                      )}
                    </div>

                    <div className="flex items-center text-sm text-gray-600">
                      <FaBook className="mr-2" />
                      <span>Tipo: {exchange.tipo}</span>
                    </div>

                    <div className="flex items-center text-sm text-gray-600">
                      <FaClock className="mr-2" />
                      <span>
                        {new Date(exchange.createdAt).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>

                    {exchange.mensaje && (
                      <div className="bg-gray-50 p-3 rounded-lg mt-3">
                        <p className="text-sm text-gray-700">{exchange.mensaje}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-3 mt-4">
                    {activeTab === 'received' && exchange.estado === 'Pendiente' && (
                      <>
                        <button
                          onClick={() => handleUpdateStatus(exchange._id, 'Aceptado')}
                          className="btn-secondary flex items-center gap-2"
                        >
                          <FaCheck />
                          Aceptar
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(exchange._id, 'Rechazado')}
                          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
                        >
                          <FaTimes />
                          Rechazar
                        </button>
                      </>
                    )}
                    
                    {/* Botón para ir al chat */}
                    <button
                      onClick={() => {
                        const otherUserId = activeTab === 'received' 
                          ? exchange.solicitante._id 
                          : exchange.propietario._id;
                        navigate(`/chat/${otherUserId}`);
                      }}
                      className="btn-outline flex items-center gap-2"
                    >
                      <FaComments />
                      Chat
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Exchanges;
