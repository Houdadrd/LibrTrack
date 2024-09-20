import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../authContext";
import "./History.css";

const History = () => {
  const [history, setHistory] = useState([]);
  const { authToken, userId } = useAuth();
  const [loading, setLoading] = useState(true);

  const headers = {
    id: userId,
    Authorization: `Bearer ${authToken}`,
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/getOrderHistory",
          { headers }
        );
        setHistory(response.data.data); 
      } catch (error) {
        console.error("Failed to fetch order history:", error);
      }finally{
        setLoading(false);
      }
    };
    fetch();
  }, [headers]);

  const calculateTotal = (books) => {
    if (!books) return 0;
    return books.reduce((total, book) => {
      return total + book.price * book.quantity;
    }, 0);
  };

   const LoadingComponent = () => {
     return <p className="loading">Loading history...</p>;
   };

  const HistoryComponent = () => (
    <>
      {history.length === 0 ? (
        <div className="no-history">
          <h1>No Order History</h1>
        </div>
      ) : (
        <>
          <div className="history-table">
            <div className="header">
              <div className="header-item">Orders</div>
              <div className="header-item">Books </div>
              <div className="header-item">Total </div>
              <div className="header-item">Status</div>
            </div>
            <div className="row-table">
              {history.map((order, i) => (
                <div key={i} className="order-row">
                  <div className="order-item">{i + 1}</div>
                  <div className="order-item">
                    {order.books && order.books.length > 0 ? (
                      order.books.map((book, index) => (
                        <div key={index} className="book-details">
                          {" "}
                          <div className="book-title">
                            {" "}
                            - {book.title || "Unknown Title"}{" "}
                          </div>
                        </div>
                      ))
                    ) : (
                      <span className="book-unavailable">
                        Book details unavailable
                      </span>
                    )}
                  </div>
                  <div className="order-item">
                    {calculateTotal(order.books)} DH
                  </div>
                  <div
                    className={`order-item status ${
                      order.status === "Ddelivered" ? "Delivered" : ""
                    }`}
                  >
                    {order.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
   

  return (
    <div className="history-container">
      {loading ? <LoadingComponent /> : <HistoryComponent />}
    </div>
  );

};

export default History;
