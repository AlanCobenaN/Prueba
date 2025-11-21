import { useState, useRef, useEffect } from 'react';
import { FaChevronDown, FaTimes } from 'react-icons/fa';

const AutocompleteSelect = ({ 
  options, 
  value, 
  onChange, 
  placeholder, 
  name,
  required = false,
  icon: Icon 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(value || '');
  const [filteredOptions, setFilteredOptions] = useState(options);
  const wrapperRef = useRef(null);

  // Filtrar opciones basado en el término de búsqueda
  useEffect(() => {
    if (searchTerm) {
      const filtered = options.filter(option =>
        option.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredOptions(filtered);
    } else {
      setFilteredOptions(options);
    }
  }, [searchTerm, options]);

  // Sincronizar searchTerm con value cuando cambia externamente
  useEffect(() => {
    setSearchTerm(value || '');
  }, [value]);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    onChange({ target: { name, value: newValue } });
    setIsOpen(true);
  };

  const handleSelectOption = (option) => {
    setSearchTerm(option);
    onChange({ target: { name, value: option } });
    setIsOpen(false);
  };

  const handleClear = () => {
    setSearchTerm('');
    onChange({ target: { name, value: '' } });
    setIsOpen(false);
  };

  const handleFocus = () => {
    setIsOpen(true);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={handleFocus}
          placeholder={placeholder}
          required={required}
          className="input-field pr-20"
          autoComplete="off"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {searchTerm && (
            <button
              type="button"
              onClick={handleClear}
              className="text-amber-500 hover:text-amber-700 transition-colors"
              title="Limpiar"
            >
              <FaTimes />
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="text-amber-600 hover:text-amber-800 transition-colors"
          >
            <FaChevronDown 
              className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
            />
          </button>
        </div>
      </div>

      {/* Dropdown con opciones filtradas */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border-2 border-amber-300 rounded-lg shadow-xl max-h-60 overflow-y-auto">
          {filteredOptions.length > 0 ? (
            <ul className="py-1">
              {filteredOptions.map((option, index) => (
                <li
                  key={index}
                  onClick={() => handleSelectOption(option)}
                  className={`px-4 py-2 cursor-pointer transition-colors ${
                    option === value
                      ? 'bg-amber-100 text-amber-900 font-semibold'
                      : 'hover:bg-amber-50 text-amber-800'
                  }`}
                >
                  {option}
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-3 text-center text-amber-600">
              No se encontraron resultados para "{searchTerm}"
            </div>
          )}
        </div>
      )}

      {/* Indicador de resultados */}
      {isOpen && searchTerm && (
        <p className="text-xs text-amber-600 mt-1">
          {filteredOptions.length} {filteredOptions.length === 1 ? 'resultado' : 'resultados'}
        </p>
      )}
    </div>
  );
};

export default AutocompleteSelect;
