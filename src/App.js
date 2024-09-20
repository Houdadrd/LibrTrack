import "./App.css";
import Home from "./pages/Home/Home.jsx";
import Navbar from "./components/Navbar/Navbar.jsx";
import Footer from "./components/Footer/Footer.jsx";
import { Routes, Route, Navigate } from "react-router-dom";
import AllBook from "./pages/AllBooks/AllBooks.jsx";
import Login from "./pages/Login/Login.jsx";
import SignUp from "./pages/SignUp/Signup.jsx";
import Cart from "./pages/Cart/Cart.jsx";
import ViewDetails from "./components/ViewDetails/ViewDetails.jsx";
import Favorite from "./pages/Favorite/Favorite.jsx";
import History from "./pages/History/History.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AllOrders from "./pages/AllOrders/AllOrders.jsx";
import AddBooks from "./pages/AddBooks/AddBooks.jsx";
import { useAuth } from "./authContext.js";
import { useEffect } from "react";
import UpdateBook from "./pages/UpdateBook/UpdateBook.jsx";
import Unauthorized from "./unauthorized.jsx";

function App() {
  const { authToken, role } = useAuth();
  return (
    <div className="all">
      <Navbar />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/all-books" element={<AllBook />} />
        <Route exact path="/SignUp" element={<SignUp />} />
        <Route exact path="/Login" element={<Login />} />

        <Route
          path="/all-orders"
          element={
            role === "admin" ? <AllOrders /> : <Navigate to="/unauthorized" />
          }
        />
        <Route
          path="/add-book"
          element={
            role === "admin" ? <AddBooks /> : <Navigate to="/unauthorized" />
          }
        />
        <Route
          path="/Favorite"
          element={
            role === "client" ? <Favorite /> : <Navigate to="/unauthorized" />
          }
        />
        <Route
          path="/History"
          element={
            role === "client" ? <History /> : <Navigate to="/unauthorized" />
          }
        />
        <Route
          path="/cart"
          element={
            role === "client" ? <Cart /> : <Navigate to="/unauthorized" />
          }
        />

        <Route path="viewDetails/:id" element={<ViewDetails />} />
        <Route path="/edit-book/:id" element={<UpdateBook />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>
      <ToastContainer />
    </div>
  );
}

export default App;
