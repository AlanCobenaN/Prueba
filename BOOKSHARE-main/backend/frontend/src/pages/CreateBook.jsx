import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookService } from '../services/bookService';
import { toast } from 'react-toastify';

const CreateBook = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    titulo: '',
    autor: '',
    materia: '',
    isbn: '',
    editorial: '',
    edicion: '',
    estado: 'Bueno',
    tipoOferta: 'Ambos',
    descripcion: ''
  });
  const [foto, setFoto] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    setFoto(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        data.append(key, formData[key]);
      });
      if (foto) {
        data.append('foto', foto);
      }

      await bookService.createBook(data);
      toast.success('Libro publicado exitosamente');
      navigate('/my-books');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al publicar libro');
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="card">
        <h1 className="text-2xl font-bold mb-6">Publicar Libro</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Título *</label>
              <input
                type="text"
                name="titulo"
                value={formData.titulo}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Autor *</label>
              <input
                type="text"
                name="autor"
                value={formData.autor}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Materia *</label>
              <input
                type="text"
                name="materia"
                value={formData.materia}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">ISBN</label>
              <input
                type="text"
                name="isbn"
                value={formData.isbn}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Editorial</label>
              <input
                type="text"
                name="editorial"
                value={formData.editorial}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Edición</label>
              <input
                type="text"
                name="edicion"
                value={formData.edicion}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Estado *</label>
              <select
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                className="input-field"
                required
              >
                <option value="Nuevo">Nuevo</option>
                <option value="Como nuevo">Como nuevo</option>
                <option value="Bueno">Bueno</option>
                <option value="Aceptable">Aceptable</option>
                <option value="Desgastado">Desgastado</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Tipo de Oferta *</label>
              <select
                name="tipoOferta"
                value={formData.tipoOferta}
                onChange={handleChange}
                className="input-field"
                required
              >
                <option value="Intercambio">Solo Intercambio</option>
                <option value="Préstamo">Solo Préstamo</option>
                <option value="Ambos">Ambos</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Descripción</label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              className="input-field"
              rows="3"
              placeholder="Agrega información adicional sobre el libro..."
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Foto del Libro</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="input-field"
            />
          </div>

          <div className="flex gap-4">
            <button type="submit" className="btn-primary flex-1">
              Publicar Libro
            </button>
            <button 
              type="button"
              onClick={() => navigate('/my-books')}
              className="btn-outline flex-1"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBook;
