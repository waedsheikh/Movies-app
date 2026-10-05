import React from "react";

const MovieDetails = ({ movie, onClose }) => {
  if (!movie) return null;

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "https://via.placeholder.com/500x750";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-4xl overflow-hidden rounded-2xl bg-slate-900 text-white shadow-2xl">
        <div className="flex justify-end p-4">
          <button
            type="button"
            className="btn btn-sm btn-circle btn-ghost"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className="grid gap-6 p-6 md:grid-cols-3 md:p-8">
          <img
            src={posterUrl}
            alt={movie.title}
            className="h-full w-full rounded-xl object-cover"
          />

          <div className="md:col-span-2">
            <h2 className="mb-3 text-3xl font-bold">{movie.title}</h2>
            <div className="mb-4 flex flex-wrap gap-2 text-sm text-gray-300">
              {movie.release_date && (
                <span>{movie.release_date.substring(0, 4)}</span>
              )}
              {movie.vote_average !== undefined && (
                <span>⭐ {movie.vote_average.toFixed(1)}</span>
              )}
              {movie.runtime && <span>{movie.runtime} min</span>}
            </div>

            <p className="mb-4 text-gray-200">
              {movie.overview || "No overview available for this title."}
            </p>

            <div className="flex flex-wrap gap-2">
              {movie.genres?.slice(0, 4).map((genre) => (
                <span key={genre.id} className="badge badge-outline">
                  {genre.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
