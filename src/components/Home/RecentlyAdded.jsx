import React, { useEffect, useState } from 'react';
import axios from "axios";
import BookCard from '../BookCard/BookCard';
import './RecentlyAdded.css';

const RecentlyAdded = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/RecentBooks"
        );
        setData(response.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if(loading) return <p className='loading'>Loading recent books...</p>

  return (
    <div className='recent-container'>
      <h4>Recently Added Books</h4>
      <div className='book-card-container'>
        {data.map((item) => (
          <BookCard key={item._id} data={item} />
        ))}
      </div>
    </div>
  );
}

export default RecentlyAdded;
