import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem("campushive_token")) {
      setLoading(false);
      return;
    }
    api("/auth/me")
      .then((d) => setUser(d.user))
      .catch(() => localStorage.removeItem("campushive_token"))
      .finally(() => setLoading(false));
  }, []);

  const saveSession = ({ token, user }) => {
    localStorage.setItem("campushive_token", token);
    setUser(user);
  };

  const login = async (email, password) =>
    saveSession(await api("/auth/login", { method: "POST", body: { email, password } }));

  const register = async (form) =>
    saveSession(await api("/auth/register", { method: "POST", body: form }));

  const logout = () => {
    localStorage.removeItem("campushive_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
