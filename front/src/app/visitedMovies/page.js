'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './watchlist.module.css'; // Import custom styles

const History = () => {
  const [history, setHistory] = useState([]);
  const [user, setUser] = useState(null);
  const email = localStorage.getItem('userEmail'); // Retrieve the email from localStorage

  useEffect(() => {
    // Fetch user details based on the email
    const fetchUser = async () => {
      try {
        

        // Fetch user's history
        const historyResponse = await fetch('http://localhost:5001/historyView', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            userEmail: email
          })
        });

        if (!historyResponse.ok) {
          throw new Error('Failed to fetch history');
        }

        const historyData = await historyResponse.json();
        setHistory(historyData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (email) {
      fetchUser(); // Call the fetchUser function if email is present
    }
  }, [email]);

  return (
    <div>
      <h2>History</h2>
      <div className={styles.movieList}>
        {history.length > 0 ? (
          history.map(movie => (
            <div key={movie._id} className="card movie-item" style={{ width: '18rem' }}>
              {movie.image && (
                <Link href={`/movie/${movie._id}`}>
                  <img src={movie.image} className="card-img-top" alt={movie.title} style={{ height: '400px', objectFit: 'cover', cursor: 'pointer' }} />
                </Link>
              )}
              <div className="card-body">
                <Link href={`/movie/${movie._id}`} passHref>
                  <h5 className="card-title" style={{ cursor: 'pointer' }}>
                    {movie.title} {movie.discontinued && <span>(Discontinued)</span>}
                  </h5>
                </Link>
                <p className="card-text">
                  {movie.description} <br />
                  Rating: {movie.rating} <br />
                  Release Year: {movie.releaseYear}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p>Your history is empty.</p>
        )}
      </div>
    </div>
  );
};

export default History;
