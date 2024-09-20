import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Favorite.css';
import BookCard from "../../components/BookCard/BookCard";
import { CiStar } from "react-icons/ci";

const Favorite = () => {
  const [favoriteBooks, setFavoriteBooks] = useState([]); 
  const [loading, setLoading] = useState(true);

  const headers = {
    userid: localStorage.getItem("userId"),
    authorization: `Bearer ${localStorage.getItem("authToken")}`,
  };

    useEffect(() => {
        const fetchData = async () => {
            try {
              const response = await axios.get(
                "http://localhost:5000/api/FavoritesBooks",
                { headers }
              );
              setFavoriteBooks(response.data.data);
            } catch (error) {
              console.error("Error fetching data:", error);
            } finally {
              setLoading(false);
            }
        };
        fetchData();
    }, []); 

    const LoadingComponent = () => {
      return <p className="loading">Loading ...</p>;
    };

    const FavoriteComponent = () => {
        return (  
             <>
                {favoriteBooks.length == 0 ? (
                    <div className='NoFav_container'>
                        Favorite liste empty
                        <CiStar className='star' />
                    </div>
                ) : (
                    <div className='book-grid'>
                    {favoriteBooks.map((item, i) => (
                        
                        <div key={i} className='book-contain'>
                            <BookCard data={item} favorite={true} />
                        </div>))}
                </div> 
                )}
            </>
        )
    }

    return (
      <div className="fav-container">
        {loading ? <LoadingComponent /> : <FavoriteComponent />}
      </div>
    );
}

export default Favorite;
