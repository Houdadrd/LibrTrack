import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Signup.css";
import axios from "axios";

const Signup = () => {
  const [Values, setValues] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
    phoneNumber: "",
    pwd: "",
    confpwd: "",
    adress: "",
  });

  const [error, setError] = useState({});
  const navigate = useNavigate();

  const change = (e) => {
    const { name, value } = e.target;
    setValues((prevValues) => ({ ...prevValues, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (Values.pwd !== Values.confpwd) {
      newErrors.confpwd = "Verify your passwords.";
    }
    return newErrors;
  };

  const submit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors);
      return;
    }

    setError("");
    try {
      const response = await axios.post(
        "http://localhost:5000/api/Signup",
        Values
      );
      console.log(response.data.message);
      if (response.data.message === "Signup successfully") {
        navigate("/login");
      }
    } catch (error) {
      if (error.response && error.response.data) {
        const field = error.response.data.field;
        setError({ [field]: error.response.data.message });
      } else {
        setError({ general: "An error occurred. Please try again later." });
      }
    }
  };

  return (
    <div>
      <div className="background-imag"></div>
      <div className="page-containe">
        <div className="signup-container">
          <p className="signup-text">Sign Up</p>
          <div className="form_container">
            <div className="fn_container">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                className="inputFN"
                placeholder="First Name"
                name="firstName"
                maxLength="30"
                required
                value={Values.firstName}
                onChange={change}
              />
              {error.firstName && (
                <p className="input-error">{error.firstName}</p>
              )}
            </div>
            <div className="ln-container">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                className="inputLN"
                maxLength="40"
                placeholder="Last Name"
                name="lastName"
                required
                value={Values.lastName}
                onChange={change}
              />
              {error.lastName && (
                <p className="input-error">{error.lastName}</p>
              )}
            </div>
            <div className="em-container">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                className="inputEm"
                maxLength="50"
                placeholder="Email"
                name="email"
                required
                value={Values.email}
                onChange={change}
              />
              {error.email && <p className="input-error">{error.email}</p>}
            </div>
            <div className="phone-container">
              <label htmlFor="phoneNumber">Phone Number</label>
              <input
                maxLength={10}
                minLength={10}
                type="tel"
                className="inputEm"
                placeholder="Phone Number"
                name="phoneNumber"
                required
                value={Values.phoneNumber}
                onChange={change}
              />
              {error.phoneNumber && (
                <p className="input-error">{error.phoneNumber}</p>
              )}
            </div>
            <div className="un-container">
              <label htmlFor="userName">Username</label>
              <input
                type="text"
                className="inputUser"
                maxLength="20"
                minLength={3}
                placeholder="Username"
                name="userName"
                required
                value={Values.userName}
                onChange={change}
              />
              {error.userName && (
                <p className="input-error">{error.userName}</p>
              )}
            </div>
            <div className="pwd-container">
              <label htmlFor="pwd">Password</label>
              <input
                type="password"
                className="inputPass"
                maxLength="20"
                placeholder="Password"
                name="pwd"
                required
                value={Values.pwd}
                onChange={change}
              />
              {error.pwd && <p className="input-error">{error.pwd}</p>}
            </div>
            <div className="pwd-container">
              <label htmlFor="confpwd">Confirm Password</label>
              <input
                type="password"
                className="inputPass"
                maxLength="20"
                placeholder="Confirm Password"
                name="confpwd"
                required
                value={Values.confpwd}
                onChange={change}
              />
              {error.confpwd && <p className="input-error">{error.confpwd}</p>}
            </div>
            <div className="adr-container">
              <label htmlFor="adress">Address</label>
              <textarea
                rows="5"
                className="inputAdre"
                minLength={10}
                maxLength="100"
                placeholder="Address"
                name="adress"
                required
                value={Values.adress}
                onChange={change}
              />
              {error.adress && <p className="input-error">{error.adress}</p>}
            </div>
            <div className="btn">
              <button className="btnSignup" onClick={submit}>
                Sign Up
              </button>
            </div>

            <div className="other">
              <p className="orContainer">Or</p>
              <p className="text_container">
                Already have an account? &nbsp;
                <Link to="/login" className="linkLogin">
                  <u>Log In</u>
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;