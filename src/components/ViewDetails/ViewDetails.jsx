import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ViewDetails.css";
import { Link,useParams, useNavigate } from "react-router-dom";
import { GrLanguage } from "react-icons/gr";
import { IoIosPricetags } from "react-icons/io";
import { FaStar, FaShoppingCart } from "react-icons/fa";
import { useAuth } from "../../authContext";
import { FaEdit } from "react-icons/fa";
import { MdOutlineDelete } from "react-icons/md";

const ViewDetails = () => {
  const { id } = useParams();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { authToken, userId, role } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/GetBookById/${id}`
        );
        setData(response.data.data);
      } catch (error) {
        setError("Error fetching data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const headers = {
    bookid: id,
    userid: userId,
    authorization: `Bearer ${authToken}`,
  };

  const handleFavorite = async () => {
    try {
      await axios.put(
        "http://localhost:5000/api/AddBookToFavorite",
        {},
        { headers }
      );
      navigate("/favorite");
    } catch (error) {
      setError("Error adding to favorites. Please try again.");
    }
  };


  const deleteBook = async () => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      try {
        await axios.delete(`http://localhost:5000/api/DeleteBook/${id}`, {
          headers,
        });
        navigate("/all-books");
      } catch (error) {
        setError("Error deleting book. Please try again.");
      }
    }
  };

  const handleCart = async () => {
    if (!authToken) {
      navigate("/login");
      return;
    }

    if (data.stock > 0 && role === "client") {
      try {
        await axios.post(
          "http://localhost:5000/api/AddToCart",
          {},
          { headers }
        );
        navigate("/cart");
      } catch (error) {
        setError("Error adding to cart. Please try again.");
      }
    }
  };

  if (loading) return <p className="loading">Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="viewDetail-container">
      <div className="book">
        <div className="book-container">
          {data.image ? (
            <img
              src={`http://localhost:5000/uploads/${data.image}`}
              alt="Book cover"
            />
          ) : (
            <p>Loading image...</p>
          )}
        </div>

        {data.stock === 0 && role === "client" && (
          <p className="out-of-stock-message">Out of Stock</p>
        )}

      </div>

      {role === "client" && (
        <div className="icon-btn">
          <button
            className={`cart-btn ${data.stock === 0 ? "out-of-stock" : ""}`}
            onClick={handleCart}
            disabled={data.stock === 0}
            aria-label="Add to cart"
          >
            <FaShoppingCart />
          </button>

          <button
            className="heart-btn"
            onClick={handleFavorite}
            aria-label="Add to favorites"
          >
            <FaStar />
          </button>
        </div>
      )}

      {role === "admin" && (
        <div className="icon-btn">
          <Link to={`/edit-book/${id}`} className="update-btn">
            <FaEdit />
          </Link>

          <button
            className="delete-btn"
            onClick={deleteBook}
            aria-label="Delete book"
          >
            <MdOutlineDelete />
          </button>
        </div>
      )}

      <div className="detailsBook">
        <h1 className="title_container">{data.title}</h1>
        <p className="author-container">By {data.author}</p>
        <p className="desc-container">{data.desc}</p>
        <p className="language">
          <GrLanguage className="grlg" />
          {data.language}
        </p>
        <p className="price">
          {" "}
          <IoIosPricetags className="prc" /> {data.price} DH
        </p>
      </div>
    </div>
  );
};

export default ViewDetails;
