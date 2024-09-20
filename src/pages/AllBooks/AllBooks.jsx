import React, { useEffect, useState } from "react";
import axios from "axios";
import BookCard from "../../components/BookCard/BookCard";
import "./AllBook.css";

const AllBook = () => {
  const [data, setData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(
          selectedCategory
            ? `http://localhost:5000/api/FilterByCategory/${selectedCategory}`
            : "http://localhost:5000/api/AllBooks"
        );
        setData(response.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, [selectedCategory]);

  const categories = [
    "Crime",
    "Romantic",
    "Dramatic",
    "Adventure",
    "Horror",
    "Philosophical",
    "Science fiction",
    "Historical",
    "Political",
  ];
   if (loading) return <p className="loading">Loading...</p>;

  return (
    <div className="allBooks-container">
      <div className="category-buttons">
        {categories.map((category) => (
          <button
            key={category}
            className={`category-button ${
              selectedCategory === category ? "active" : ""
            }`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
        <button
          className={`category-button ${
            selectedCategory === "" ? "active" : ""
          }`}
          onClick={() => setSelectedCategory("")}>
          All
        </button>
      </div>

      <div className="book-card-container">
        {data.map((item) => (
          <BookCard key={item._id} data={item} />
        ))}
      </div>
    </div>
  );
};

export default AllBook;
