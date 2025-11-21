import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaComments, FaUser } from 'react-icons/fa';
import api from '../services/api';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/users');
      setUsers(data.users || []);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartChat = (userId) => {
    navigate(`/chat/${userId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Usuarios</h1>

      <div className="grid md:grid-cols-2 gap-4">
        {users.map((user) => (
          <div key={user._id} className="card hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-primary text-white rounded-full p-4">
                  <FaUser className="text-2xl" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{user.nombre}</h3>
                  <p className="text-sm text-gray-600">{user.universidad}</p>
                  <p className="text-sm text-gray-500">{user.carrera}</p>
                </div>
              </div>
              
              <button
                onClick={() => handleStartChat(user._id)}
                className="btn btn-primary flex items-center space-x-2"
              >
                <FaComments />
                <span>Chat</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {users.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No hay otros usuarios registrados aún</p>
        </div>
      )}
    </div>
  );
};

export default Users;
