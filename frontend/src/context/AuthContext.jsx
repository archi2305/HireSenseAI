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

  const devLogin = async () => {
    console.log("[auth] API:", `${API_BASE_URL}/api/auth/dev-login`);
    try {
      const response = await api.post("/auth/dev-login");
      const { access_token } = response.data;
      localStorage.setItem("token", access_token);
      localStorage.setItem("isAuthenticated", "true");
      await checkUser();
      toast.success("Signed in as demo user", {
        style: {
          background: "#f0fdf4",
          color: "#166534",
          border: "1px solid #bbf7d0",
        },
      });
      return true;
    } catch (error) {
      console.error("Dev login failed, trying fallback flow", error);
      const status = error?.response?.status;
      const demoEmail = "demo@hiresense.local";
      const demoPassword = "demo123456";

      // Backward-compatible fallback for older backends without /auth/dev-login
      if (status === 404) {
        try {
          await api.post("/auth/signup", {
            fullname: "Demo User",
            email: demoEmail,
            password: demoPassword,
          });
        } catch (signupError) {
          const detail = signupError?.response?.data?.detail;
          // Ignore "already registered" and proceed to login
          if (
            !(signupError?.response?.status === 400 && detail === "Email already registered")
          ) {
            console.error("Demo fallback signup failed", signupError);
          }
        }

        try {
          const loginResponse = await api.post("/auth/login", {
            email: demoEmail,
            password: demoPassword,
          });
          const { access_token } = loginResponse.data;
          localStorage.setItem("token", access_token);
          localStorage.setItem("isAuthenticated", "true");
          await checkUser();
          toast.success("Signed in as demo user", {
            style: {
              background: "#f0fdf4",
              color: "#166534",
              border: "1px solid #bbf7d0",
            },
          });
          return true;
        } catch (fallbackLoginError) {
          console.error("Demo fallback login failed", fallbackLoginError);
        }
      }

      toast.error(error.response?.data?.detail || "Demo login failed", {
        style: {
          background: "#fef2f2",
          color: "#991b1b",
          border: "1px solid #fecaca",
        },
      });
      return false;
    }
  };

  const login = async (email, password) => {
    console.log("[auth] API:", `${API_BASE_URL}/api/auth/login`);
    try {
      const response = await api.post("/auth/login", { email, password });
      const { access_token } = response.data;
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
      toast.error(error.response?.data?.detail || "Login failed", {
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
      toast.error(error.response?.data?.detail || "Signup failed", {
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
