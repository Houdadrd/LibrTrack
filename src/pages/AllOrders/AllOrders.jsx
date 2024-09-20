import React, { useState, useEffect } from "react";
import "./AllOrders.css";
import axios from "axios";
import { useAuth } from "../../authContext.js";
import { FaCheck } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AllOrders = () => {
  const { authToken, userId } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null); 
  const [statusValues, setStatusValues] = useState({}); 

  const headers = {
    userid: userId,
    authorization: `Bearer ${authToken}`,
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/getAllOrders",
          { headers }
        );
        setOrders(response.data.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchOrders();
  }, [authToken, userId]);

  const handleStatusChange = (e, index) => {
    const newStatus = e.target.value;
    setStatusValues((prev) => ({ ...prev, [index]: newStatus }));
    setEditingIndex(index);
  };

  const submitChanges = async (index) => {
    const id = orders[index]._id;
    const newStatus = statusValues[index];
    try {
      await axios.put(
        `http://localhost:5000/api/updateStatus/${id}`,
        { status: newStatus },
        { headers }
      );

      setOrders((prevOrders) => {
        const updatedOrders = [...prevOrders];
        updatedOrders[index].status = newStatus;
        return updatedOrders;
      });

      toast.success("Book status updated successfully!");
    } catch (error) {
      toast.error("Failed to update status.");
    } finally {
      setEditingIndex(null);
    }
  };

  if (loading) return <p className="loading">Loading orders...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="all-orders-container">
      <h1 className="title">All Orders</h1>
      <table className="orders-table">
        <thead>
          <tr className="table-header">
            <th>Order Date</th>
            <th>User</th>
            <th>Books</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody className="table-body">
          {orders.map((order, index) => (
            <tr key={order._id}>
              <td>{new Date(order.dateOrder).toLocaleDateString()}</td>
              <td>
                {order.users.firstName} {order.users.lastName}
              </td>
              <td>
                {order.books && order.books.length > 0
                  ? order.books.map((book, idx) => (
                      <div key={idx} className="book-info">
                        {book.title} (Quantity: {book.quantity})
                      </div>
                    ))
                  : "No books found"}
              </td>
              <td>
                <select
                  name="status"
                  className="orders-status"
                  onChange={(e) => handleStatusChange(e, index)}
                  value={statusValues[index] || order.status}
                >
                  {["Out of delivery", "Delivered"].map((status, i) => (
                    <option value={status} key={i}>
                      {status}
                    </option>
                  ))}
                </select>

                <button
                  className="check"
                  onClick={() => submitChanges(index)}
                  disabled={editingIndex !== index}>
                  <FaCheck />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ToastContainer />
    </div>
  );
};

export default AllOrders;
