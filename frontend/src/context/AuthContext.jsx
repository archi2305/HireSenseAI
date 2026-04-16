import React, { createContext, useState, useEffect, useContext } from "react";
import api, { API_BASE_URL } from "../services/api";
import { toast } from "react-hot-toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const storedUser = localStorage.getItem("user") || sessionStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        localStorage.setItem("isAuthenticated", "true");
        setLoading(false);
        return;
      } catch (parseError) {
        console.error("Failed to parse stored user", parseError);
        localStorage.removeItem("user");
      }
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await api.get("/auth/me");
      setUser(response.data);
      localStorage.setItem("isAuthenticated", "true");
    } catch (error) {
      console.error("Auth verification failed", error);
      localStorage.removeItem("token");
      localStorage.removeItem("isAuthenticated");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    console.log("[auth] API:", `${API_BASE_URL}/api/auth/login`);
    try {
      const response = await api.post("/auth/login", { email, password });
      const { access_token } = response.data;
      localStorage.removeItem("user");
      sessionStorage.removeItem("user");
      localStorage.setItem("token", access_token);
      localStorage.setItem("isAuthenticated", "true");
      await checkUser();
      toast.success("Logged in successfully!", {
        style: {
          background: "#f0fdf4",
          color: "#166534",
          border: "1px solid #bbf7d0"
        }
      });
      return true;
    } catch (error) {
      toast.error(error?.userMessage || error.response?.data?.detail || "Auth failed", {
        style: {
          background: "#fef2f2",
          color: "#991b1b",
          border: "1px solid #fecaca"
        }
      });
      return false;
    }
  };

  const loginWithToken = async (token) => {
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
    localStorage.setItem("token", token);
    localStorage.setItem("isAuthenticated", "true");
    await checkUser();
    toast.success("Successfully logged in via Social Account!", {
      style: { background: "#f0fdf4", color: "#166534", border: "1px solid #bbf7d0" }
    });
    return true;
  };

  const signup = async (fullname, email, password) => {
    console.log("[auth] API:", `${API_BASE_URL}/api/auth/signup`);
    try {
      await api.post("/auth/signup", { fullname, email, password });
      toast.success("Account created successfully! Please log in.", {
        style: {
          background: "#f0fdf4",
          color: "#166534",
          border: "1px solid #bbf7d0"
        }
      });
      return true;
    } catch (error) {
      toast.error(error?.userMessage || error.response?.data?.detail || "Auth failed", {
        style: {
          background: "#fef2f2",
          color: "#991b1b",
          border: "1px solid #fecaca"
        }
      });
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
    setUser(null);
    toast.success("Logged out successfully", {
      style: {
        background: "#f0fdf0",
        color: "#166534"
      }
    });
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, loginWithToken }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
