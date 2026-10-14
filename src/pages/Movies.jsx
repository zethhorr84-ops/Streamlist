
import { useState } from 'react';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

function Movies() {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSearch = async (event) => {
    event.preventDefault();

    const searchTerm = query.trim();

    if (!searchTerm) {
      setError('Please enter a movie title to search.');
      setMovies([]);
      setSearched(false);
      return;
    }

    if (!API_KEY) {
      setError(
        'TMDB API key is missing. Check the VITE_TMDB_API_KEY setting in your .env file.'
      );
      setMovies([]);
      setSearched(false);
      return;
    }

    setLoading(true);
    setError('');
    setSearched(false);

    try {
      const params = new URLSearchParams({
        api_key: API_KEY,
        query: searchTerm,
        include_adult: 'false',
        language: 'en-US',
        page: '1',
      });

      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?${params}`
      );

      if (!response.ok) {
        throw new Error(
          response.status === 401
            ? 'TMDB rejected the API key. Check your .env file and key.'
            : `Movie search failed (HTTP ${response.status}).`
        );
      }

      const data = await response.json();

      setMovies(data.results || []);
      setSearched(true);

      if (!data.results || data.results.length === 0) {
        setError('No movies found. Try another title.');
      }
    } catch (searchError) {
      console.error('TMDB search error:', searchError);
      setMovies([]);
      setError(
        searchError.message ||
          'Unable to retrieve movie information. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="movies-page">
      <header className="movies-hero">
        <p className="eyebrow">Explore the database</p>
        <h1>Discover Movies</h1>
        <p>
          Search for a movie to explore its release date, rating,
          poster, and description.
        </p>
      </header>

      <form className="movie-search-form" onSubmit={handleSearch}>
        <label className="sr-only" htmlFor="movie-search">
          Movie title
        </label>

        <input
          id="movie-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search a movie, such as The Avengers..."
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Searching...' : 'Search Movies'}
        </button>
      </form>

      <p className="tmdb-attribution">
        Movie information provided by TMDB.
      </p>

      {error && (
        <p className="movie-message" role="status">
          {error}
        </p>
      )}

      {!searched && !loading && !error && (
        <div className="movie-search-empty">
          <span className="material-symbols-outlined">
            movie_search
          </span>
          <p>Enter a movie title above to get started.</p>
        </div>
      )}

      {loading && (
        <p className="movie-message" role="status">
          Searching TMDB for movies...
        </p>
      )}

      {movies.length > 0 && (
        <div className="movie-results">
          {movies.map((movie) => {
            const posterUrl = movie.poster_path
              ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
              : null;

            return (
              <article className="movie-result-card" key={movie.id}>
                {posterUrl ? (
                  <img
                    className="movie-poster"
                    src={posterUrl}
                    alt={`Poster for ${movie.title}`}
                    loading="lazy"
                  />
                ) : (
                  <div className="movie-poster poster-placeholder">
                    <span className="material-symbols-outlined">
                      movie
                    </span>
                    <span>No poster available</span>
                  </div>
                )}

                <div className="movie-result-content">
                  <h2>{movie.title}</h2>

                  <p className="movie-meta">
                    Release date:{' '}
                    {movie.release_date || 'Not available'}
                  </p>

                  <p className="movie-rating">
                    <span className="material-symbols-outlined">
                      star
                    </span>
                    {Number.isFinite(movie.vote_average)
                      ? `${movie.vote_average.toFixed(1)} / 10`
                      : 'Not rated'}
                  </p>

                  <p className="movie-overview">
                    {movie.overview ||
                      'No description is available for this movie.'}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <footer className="tmdb-footer">
        <p>
          This product uses the TMDB API but is not endorsed or
          certified by TMDB.
        </p>
      </footer>
    </section>
  );
}

export default Movies;
