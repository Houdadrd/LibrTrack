import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../authContext.js";
import axios from "axios";

const UpdateBook = () => {
  const [data, setData] = useState({
    title: "",
    author: "",
    price: "",
    desc: "",
    category: "",
    language: "",
    image: null,
    stock: "",
  });
  const [originalImage, setOriginalImage] = useState(""); 
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});

  const { authToken, userId } = useAuth();

  const headers = {
    userid: userId,
    authorization: `Bearer ${authToken}`,
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const validateInputs = () => {
    const errors = {};

    const requiredFields = ["title", "author", "language", "desc"];
    requiredFields.forEach((field) => {
      if (/^\s*$/.test(data[field])) {
        errors[field] = `${
          field.charAt(0).toUpperCase() + field.slice(1)
        } cannot be just whitespace.`;
      }
    });

    if (data.price < 0 || isNaN(data.price)) {
      errors.price = "Price must be a non-negative number.";
    }

    if (data.stock < 0) {
      errors.stock = "Stock must be a positive integer.";
    }

    if (!Number.isInteger(+data.stock)) {
      errors.stock = "Stock should be integer";
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();

    if (!validateInputs()) {
      return;
    }
    const formData = new FormData();
    for (const key in data) {
      if (key === "image" && data[key] === null) continue;
      formData.append(key, data[key]);
    }

    try {       
      const response = await axios.put(
        `http://localhost:5000/api/EditeBooks/${id}`,
        formData,
        { headers }
      );      

      navigate("/all-books");
    } catch (error) {
      console.log("Catch Error :", error.response);
      alert(
        "Error updating book: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/GetBookById/${id}`
        );
        setData(response.data.data);
        setOriginalImage(response.data.data.image);
      } catch (error) {
        setErrors("Error fetching data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  return (
    <div className="add-books-container">
      <h2>Edit Book</h2>
      <form onSubmit={submit} className="add-books-form">
        <div className="input-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            name="title"
            placeholder="Enter book title"
            value={data.title}
            onChange={handleChange}
            required
          />
          {errors.title && <p className="error">{errors.title}</p>}
        </div>

        <div className="input-group">
          <label htmlFor="author">Author</label>
          <input
            type="text"
            name="author"
            placeholder="Enter author name"
            value={data.author}
            onChange={handleChange}
            required
          />
          {errors.author && <p className="error">{errors.author}</p>}
        </div>

        <div className="input-group">
          <label htmlFor="category">Category</label>
          <select
            name="category"
            value={data.category}
            onChange={handleChange}
            required
          >
            <option value="">Select category</option>
            <option value="Crime">Crime</option>
            <option value="Romantic">Romantic</option>
            <option value="Dramatic">Dramatic</option>
            <option value="Adventure">Adventure</option>
            <option value="Horror">Horror</option>
            <option value="Philosophical">Philosophical</option>
            <option value="Science fiction">Science fiction</option>
            <option value="Historical">Historical</option>
            <option value="Political">Political</option>
          </select>
          {errors.category && <p className="error">{errors.category}</p>}
        </div>

        <div className="input-group">
          <label htmlFor="language">Language</label>
          <input
            type="text"
            name="language"
            placeholder="Enter book language"
            value={data.language}
            onChange={handleChange}
            required
          />
          {errors.language && <p className="error">{errors.language}</p>}
        </div>

        <div className="input-group">
          <label htmlFor="price">Price</label>
          <input
            type="number"
            name="price"
            placeholder="Enter book price"
            value={data.price}
            onChange={handleChange}
            required
          />
          {errors.price && <p className="error">{errors.price}</p>}
        </div>

        <div className="input-group">
          <label htmlFor="stock">Stock</label>
          <input
            type="number"
            name="stock"
            placeholder="Enter book stock"
            value={data.stock}
            onChange={handleChange}
            required
          />
          {errors.stock && <p className="error">{errors.stock}</p>}
        </div>

        <div className="input-group">
          <label htmlFor="desc">Description</label>
          <textarea
            name="desc"
            placeholder="Enter book description"
            value={data.desc}
            onChange={handleChange}
            rows="6"
            required
          />
          {errors.desc && <p className="error">{errors.desc}</p>}
        </div>

        <div className="input-group">
          <label htmlFor="image">Image (Optional)</label>
          <input
            className="input-img"
            type="file"
            name="image"
            accept="image/png, image/jpeg"
            onChange={handleChange}
          />
          {originalImage && (
            <div className="current-image">
              <img
                src={originalImage}
                alt={data.title}
              />
            </div>
          )}
        </div>

        <button type="submit" className="submit-button">
          Update Book
        </button>
      </form>
    </div>
  );
};

export default UpdateBook;
