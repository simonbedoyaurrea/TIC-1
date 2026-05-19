import { createContext, useContext, useState } from "react";
import { parseToken, isTokenExpired } from "../utils/jwt";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("token");
    if (!token || isTokenExpired(token)) {
      localStorage.removeItem("token");
      return null;
    }
    const payload = parseToken(token);
    return { token, role: payload.role, id: payload.sub };
  });

  const login = (data) => {
    const payload = parseToken(data.token);
    setUser({ token: data.token, role: payload.role, id: payload.sub });
    localStorage.setItem("token", data.token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
