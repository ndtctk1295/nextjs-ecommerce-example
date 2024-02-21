// context/UserContext.js
"use client";
import { createContext, useContext, useState } from "react";
export const UserContext = createContext(false);

export function useUser() {
  return useContext(UserContext);
}

export function UserProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // null when not logged in
  const [jwt, setJwt] = useState("");
  const [refreshToken, setRefreshToken] = useState(""); // empty string when not logged in
  const [user, setUser] = useState({}); // empty object when not logged in
  const login = (token, username, refreshToken) => {
    setIsLoggedIn(true); // Set the user data upon login
    setJwt(token); // Set JWT upon login
    setUser({ username: username });
    setRefreshToken(refreshToken);
    localStorage.setItem("jwt", token);
    localStorage.setItem("refreshToken", refreshToken);
  };

  const logout = () => {
    setIsLoggedIn(false); // Clear the user data upon logout
    setJwt(""); // Clear JWT upon logout
    setUser({});
    setRefreshToken("");
    localStorage.removeItem("jwt");
    localStorage.removeItem("refreshToken");
  };

  return (
    <UserContext.Provider value={{ isLoggedIn, login, logout, jwt, user }}>
      {children}
    </UserContext.Provider>
  );
}
