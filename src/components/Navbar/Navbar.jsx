import React, { useState, useEffect } from 'react';
import './Navbar.css';
import booklogo from '../logos/book.png';
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from '../../authContext'; 
import { FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { authToken, logout, role } = useAuth();
  const navigate = useNavigate();

  const links = [
    { title: "Home", link: "/" },
    ...(authToken && role === "client"
      ? [
          { title: "All Books", link: "/all-books" },
          { title: "Favorite", link: "/favorite" },
          { title: "Cart", link: "/cart" },
          { title: "History", link: "/history" },
        ]
      : []),
    ...(authToken && role === "admin"
      ? [
          { title: "All Books", link: "/all-books" },
          { title: "Add Book", link: "/add-book" },
          { title: "All Orders", link: "/all-orders" },
        ]
      : []),
  ];

  const handleLogout = () => {
    logout(); 
    navigate('/'); 
  };

  return (
    <nav className="nav">
      <Link to="/" className="logname">
        <img src={booklogo} alt="logo" />
        <h1 className="name">LibrTrack</h1>
      </Link>

      <button
        className="menu-toggle"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {isMenuOpen ? <FaTimes /> : <FaBars />}
      </button>
      
      <div className={`nav-links ${isMenuOpen ? "active" : ""}`}>
        {links.map((item, i) => (
          <div key={i}>
            <Link
              to={item.link}
              className="nav-titles"
              onClick={() => item.title && setIsMenuOpen(false)}
            >
              {item.title}
            </Link>
          </div>
        ))}
        <div className="btns">
          {authToken ? (
            <button onClick={handleLogout} className="btn-signup">
              Log out
            </button>
          ) : (
            <>
              <Link to="/login" className="btn-signin">
                Log In
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
