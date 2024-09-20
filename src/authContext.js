import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(localStorage.getItem("authToken"));
  const [userId, setUserId] = useState(localStorage.getItem("userId"));
  const [role, setRole] = useState(localStorage.getItem("role"));


  const login = (token, id, role) => {
    localStorage.setItem("authToken", token);
    localStorage.setItem("userId", id); 
    localStorage.setItem("role", role); 

    setRole(role);
    setAuthToken(token);
    setUserId(id);
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId"); 
    localStorage.removeItem("role");


    setAuthToken(null);
    setUserId(null);
    setRole(null);
  };

  useEffect(() => {
    console.log('running here')
  }, [])

  return (
    <AuthContext.Provider value={{ authToken, userId, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
