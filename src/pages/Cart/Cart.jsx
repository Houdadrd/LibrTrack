import React, { useState, useEffect } from "react";
import { AiFillDelete } from "react-icons/ai";
import axios from "axios";
import "./Cart.css";
import { useAuth } from "../../authContext";
import { useNavigate } from "react-router-dom";
import { MdOutlineAdd } from "react-icons/md";
import { IoIosRemove } from "react-icons/io";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Cart = () => {
  const [cart, setCart] = useState({ books: [] });
  const [total, setTotal] = useState(0);
  const { authToken, userId } = useAuth();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCartData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/GetUserCart",
        {
          headers: {
            id: userId,
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setCart(response.data.data || { books: [] });
    } catch (error) {
      toast.error(
        "Error fetching cart data: " +
          (error.response?.data?.message || "An unexpected error occurred")
      );
      setCart({ books: [] });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId && authToken) {
      fetchCartData();
    }
  }, [userId, authToken]);

  const deleteItem = async (bookId) => {
    try {
      await axios.put(
        `http://localhost:5000/api/RemoveFromCart/${bookId}`,
        {},
        {
          headers: {
            id: userId,
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      fetchCartData();
    } catch (error) {
      toast.error(
        "Error removing book: " +
          (error.response?.data?.message || "An unexpected error occurred")
      );
    }
  };

  const updateQuantity = async (bookId, newQuantity) => {
    try {
      await axios.put(
        `http://localhost:5000/api/UpdateQuantity/${bookId}`,
        { quantity: newQuantity },
        {
          headers: {
            id: userId,
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      fetchCartData();
    } catch (error) {
      toast.error(
        "Error updating quantity: " +
          (error.response?.data?.message || "An unexpected error occurred")
      );
    }
  };

  useEffect(() => {
    if (cart.books.length > 0) {
      const totalAmount = cart.books.reduce(
        (acc, item) => acc + item.bookId.price * item.quantity,
        0
      );
      setTotal(totalAmount);
    }
  }, [cart]);

  const placeOrder = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/PlaceOrders",
        {},
        {
          headers: {
            id: userId,
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.data.status === "Success") {
        toast.success(response.data.message);
        navigate("/history");
      } else {
        toast.error(response.data.message || "An unexpected error occurred");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "An unexpected error occurred.";
      toast.error(errorMessage);
    }
  };

  const LoadingComponent = () => <p className="loading">Loading ...</p>;

  const CartComponent = () => (
    <>
      {cart.books.length === 0 ? (
        <div className="TextCart-container">
          <h1>Empty Cart</h1>
        </div>
      ) : (
        <>
          <h1 className="cart-text">Your Cart</h1>
          <div className="table-container">
            <table className="cart-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {cart.books.map((item) => (
                  <tr key={item._id}>
                    <td>{item.bookId.title}</td>
                    <td>{item.bookId.author}</td>
                    <td>{item.bookId.price} DH</td>
                    <td>
                      <div className="quantity-controls">
                        <button
                          onClick={() =>
                            updateQuantity(item.bookId._id, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                          className="btnRemove"
                        >
                          <IoIosRemove />
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() =>
                            updateQuantity(item.bookId._id, item.quantity + 1)
                          }
                          className="btnAdd"
                        >
                          <MdOutlineAdd />
                        </button>
                      </div>
                    </td>
                    <td>{item.bookId.price * item.quantity} DH</td>
                    <td>
                      <button
                        className="btnDelet"
                        onClick={(e) => {
                          e.preventDefault();
                          deleteItem(item.bookId._id);
                        }}
                      >
                        <AiFillDelete />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {cart && (
            <div className="total-container">
              <div className="total-card">
                <h1 className="total-text">Total amount</h1>
                <hr className="ligne" />
                <div className="books-detail">
                  <h2>{total} DH</h2>
                </div>
                <div className="btns">
                  <button className="btn-order" onClick={placeOrder}>
                    Place your order
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );

  return (
    <div className="cart-container">
      {loading ? <LoadingComponent /> : <CartComponent />}
      <ToastContainer />
    </div>
  );
};

export default Cart;
