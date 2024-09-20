import React from 'react';
import {Link, useNavigate} from 'react-router-dom';
import './BookCard.css';
import { FaTrashAlt } from "react-icons/fa";
import axios from 'axios';


const BookCard = ({ data, favorite }) => {
    const navigate = useNavigate();

  const headers ={
    id: localStorage.getItem("userId"),
    authorization: `Bearer ${localStorage.getItem("authToken")}`,
    bookid: data._id,
  };
  const handleRemoveBook = async () =>{
    const response = await axios.put('http://localhost:5000/api/RemoveBook', {}, { headers });
    
    navigate("/Favorite");
  };

  return (
    <Link to={`/viewDetails/${data._id}`}  className="book-card-link">
      <div className="book-card-container">
        <div className="book-card">
          <img
            src={`http://localhost:5000/uploads/${data.image}`}
            alt={data.title}
            className="book-cover-imag"
          />

          <div className="book-info">
            <h5 className="book-title">{data.title}</h5>
            <p>By {data.author}</p>
            <p>{data.price} DH</p>
          </div>
          {favorite && (
            <button className="btn-removeFav" onClick={handleRemoveBook}>
              <FaTrashAlt />
            </button>
          )}
        </div>
      </div>
    </Link>
  );
}

export default BookCard;