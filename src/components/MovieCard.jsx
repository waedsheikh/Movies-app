import React from "react";

const MovieCard = ({ movie, onToggleFavorite, isFavorite, onViewDetails }) => {
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "https://via.placeholder.com/500x750";

  return (
    <div className="relative group rounded-2xl overflow-hidden shadow-lg">
      <img
        src={posterUrl}
        alt={movie.title}
        className="w-full h-96 object-cover group-hover:scale-110 duration-300"
      />
      <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 duration-300 flex flex-col justify-center items-center text-center p-4">
        <h2 className="text-xl font-bold text-white mb-2">{movie.title}</h2>
        {movie.release_date && (
          <p className="text-gray-300">{movie.release_date.substring(0, 4)}</p>
        )}
        <div className="flex flex-col gap-2">
          <button
            type="button"
            className="btn btn-success"
            onClick={() => onToggleFavorite(movie)}
          >
            {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
          </button>
          <button
            type="button"
            className="btn btn-info"
            onClick={() => onViewDetails(movie.id)}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
