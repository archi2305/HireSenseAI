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
    const isDemoSession =
      localStorage.getItem("isDemoUser") === "true" ||
      sessionStorage.getItem("isDemoUser") === "true";
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        if (isDemoSession) {
          localStorage.setItem("user", JSON.stringify(parsedUser));
          localStorage.setItem("isDemoUser", "true");
          localStorage.removeItem("token");
        }
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

  const devLogin = () => {
    const demoUser = { name: "Demo User", role: "Recruiter" };
    setUser(demoUser);
    localStorage.setItem("user", JSON.stringify(demoUser));
    sessionStorage.setItem("user", JSON.stringify(demoUser));
    localStorage.setItem("isDemoUser", "true");
    sessionStorage.setItem("isDemoUser", "true");
    localStorage.setItem("isAuthenticated", "true");
    localStorage.removeItem("token");
    toast.success("Signed in as demo user", {
      style: {
        background: "#f0fdf4",
        color: "#166534",
        border: "1px solid #bbf7d0",
      },
    });
    return demoUser;
  };

  const login = async (email, password) => {
    console.log("[auth] API:", `${API_BASE_URL}/api/auth/login`);
    try {
      const response = await api.post("/auth/login", { email, password });
      const { access_token } = response.data;
      localStorage.removeItem("user");
      localStorage.removeItem("isDemoUser");
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("isDemoUser");
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
    localStorage.removeItem("isDemoUser");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("isDemoUser");
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
    localStorage.removeItem("isDemoUser");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("isDemoUser");
    setUser(null);
    toast.success("Logged out successfully", {
      style: {
        background: "#f0fdf0",
        color: "#166534"
      }
    });
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, devLogin, signup, logout, loginWithToken }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
