import React, { useState } from "react";

const SearchBar = ({ onSearch }) => {
  const [term, setTerm] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(term);
  };
  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="search"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        placeholder="search movies...."
        aria-label="Search movies"
        className="input input-success min-w-0 flex-1"
      />
      <button type="submit" className="btn btn-success">
        Search
      </button>
    </form>
  );
};

export default SearchBar;
