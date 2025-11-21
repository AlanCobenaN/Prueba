const SearchBar = ({ search, setSearch, onSearchSubmit }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearchSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex gap-2">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por título, autor o materia..."
          className="input-field flex-1"
        />
        <button type="submit" className="btn-primary">
          Buscar
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
