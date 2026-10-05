import React from "react";
import SearchBar from "./components/SearchBar";
import Spinner from "./components/Spinner";
import ErrorMassage from "./components/ErrorMassage";
import MovieCard from "./components/MovieCard";
import MovieDetails from "./components/moveDetails";

function App() {
  const [movies, setMovies] = React.useState([]);
  const [favorites, setFavorites] = React.useState([]);
  const [initialized, setInitialized] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [view, setView] = React.useState("search");
  const [selectedMovie, setSelectedMovie] = React.useState(null);

  const API_KEY = import.meta.env.VITE_API_KEY;

  React.useEffect(() => {
    try {
      const storedFavorites = JSON.parse(
        localStorage.getItem("favorites") || "[]",
      );
      setFavorites(Array.isArray(storedFavorites) ? storedFavorites : []);
    } catch {
      setFavorites([]);
    } finally {
      setInitialized(true);
    }
  }, []);

  React.useEffect(() => {
    if (initialized) {
      localStorage.setItem("favorites", JSON.stringify(favorites));
    }
  }, [favorites, initialized]);

  React.useEffect(() => {
    if (view === "favorites") return;

    if (!API_KEY) {
      const message = "Missing TMDB API key. Add VITE_API_KEY to .env.";
      setError(message);
      setLoading(false);
      console.error(message);
      return;
    }

    const fetchMovies = async () => {
      setLoading(true);
      setError(null);

      try {
        const url = searchTerm
          ? `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${searchTerm}&page=${page}`
          : `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&page=${page}`;

        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch movies");

        const data = await res.json();
        setMovies(data.results || []);
        setTotalPages(Math.min(data.total_pages || 0, 500));
      } catch {
        setError("Failed to fetch movies");
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [API_KEY, page, searchTerm, view]);

  const handleSearch = (term) => {
    setSearchTerm(term.trim());
    setPage(1);
  };

  const openModal = async (movieId) => {
    if (!API_KEY) {
      setError("Missing TMDB API key. Add VITE_API_KEY to .env.");
      return;
    }

    setError(null);

    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch movie details");
      }

      const data = await response.json();
      setSelectedMovie(data);
    } catch {
      setError("Failed to fetch movie details");
    }
  };

  const closeModal = () => {
    setSelectedMovie(null);
  };

  const displayMovies = view === "favorites" ? favorites : movies;

  const toggleFavorite = (movie) => {
    setFavorites((currentFavorites) =>
      currentFavorites.some((favorite) => favorite.id === movie.id)
        ? currentFavorites.filter((favorite) => favorite.id !== movie.id)
        : [...currentFavorites, movie],
    );
  };

  return (
    <div className="container mx-auto p-4 flex flex-col items-center text-center">
      <h1 className="text-4xl font-extrabold mb-6 drop-shadow-2xl">
        Movie App
      </h1>

      <div className="tabs tabs-border mb-4">
        <button
          type="button"
          className={`tab text-lg ${view === "search" ? "tab-active" : ""}`}
          onClick={() => {
            setView("search");
            setSearchTerm("");
            setPage(1);
          }}
        >
          Search / Popular
        </button>
        <button
          type="button"
          className={`tab text-lg ${view === "favorites" ? "tab-active" : ""}`}
          onClick={() => setView("favorites")}
        >
          Favorites
        </button>
      </div>

      {view === "search" && (
        <div className="w-full max-w-md mb-6">
          <SearchBar onSearch={handleSearch} />
        </div>
      )}

      {loading && <Spinner />}
      {error && <ErrorMassage message={error} />}

      {!loading && !error && displayMovies.length === 0 && (
        <div>
          No movies found.
          {view === "favorites"
            ? " Add some to your favorites."
            : " Try a different search."}
        </div>
      )}

      {!loading && !error && displayMovies.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
          {displayMovies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              isFavorite={favorites.some(
                (favorite) => favorite.id === movie.id,
              )}
              onToggleFavorite={toggleFavorite}
              onViewDetails={openModal}
            />
          ))}
        </div>
      )}

      {view === "search" && totalPages > 1 && !loading && !error && (
        <div className="join mt-6">
          <button
            type="button"
            className="join-item btn"
            disabled={page === 1}
            onClick={() => setPage((currentPage) => currentPage - 1)}
          >
            Previous
          </button>
          <span className="join-item btn btn-ghost pointer-events-none">
            {page} / {totalPages}
          </span>
          <button
            type="button"
            className="join-item btn"
            disabled={page >= totalPages}
            onClick={() => setPage((currentPage) => currentPage + 1)}
          >
            Next
          </button>
        </div>
      )}

      {selectedMovie && (
        <MovieDetails movie={selectedMovie} onClose={closeModal} />
      )}
    </div>
  );
}

export default App;
