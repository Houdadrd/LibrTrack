import React from "react";
import "./Hero.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../authContext";

const Hero = () => {
  const { authToken } = useAuth();
  const navigate = useNavigate();

  const handleDiscoverBooksClick = () => {
    if (!authToken) {
      navigate("/login");
    } else {
      navigate("/all-books");
    }
  };

  return (
    <div className="hero-container">
      <div className="div-container">
        <h1 className="caption">Find Your Next Read!</h1>
        <p className="par-container">
          Explore a world of captivating stories, valuable knowledge, and
          endless inspiration. Dive into our bookstore today!
        </p>

        <div className="btn">
          <button onClick={handleDiscoverBooksClick} className="btn-container">
            Discover Books
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
