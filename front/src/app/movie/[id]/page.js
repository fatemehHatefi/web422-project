'use client';
console.log("Hello, World!");

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './MovieDetail.module.css'; // Ensure this file exists

export default function MovieDetails() {
  const params = useParams();
  const { id } = params;
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovie = async (id) => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`http://localhost:5001/movies/${id}`);
        if (response.status === 200) {
          setMovie(response.data);
        } else {
          throw new Error('Movie not found');
        }
      } catch (error) {
        console.error('Fetch error:', error.response ? error.response.data : error.message);
        setError('Error fetching movie');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMovie(id);
    } else {
      setError('No movie ID in query');
      setLoading(false);
    }
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!movie) return <div>No movie found</div>;

  return (
    <div className={styles.movieDetail}>
      <div className={styles.movieContent}>
        {movie.image && <img src={movie.image} alt={movie.title} className={styles.movieImage} />}
        <div className={styles.movieDescription}>
          <h1>{movie.title}</h1>
          <p>{movie.description}</p>
          <p><strong>Release Year:</strong> {movie.releaseYear}</p>
          <p><strong>Rating:</strong> {movie.rating}</p>
          {/* Add more movie details as needed */}
        </div>
      </div>
    </div>
  );
}
