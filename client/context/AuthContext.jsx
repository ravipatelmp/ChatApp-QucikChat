import { createContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

axios.defaults.baseURL = backendUrl;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [authUser, setAuthUser] = useState(null);
  const [onlineUser, setOnlineUser] = useState([]);
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(true);

  // ================= CHECK AUTH =================
  const checkAuth = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.get("/api/v1/auth/check", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success) {
        setAuthUser(data.user);
        connectSocket(data.user);
      }
    } catch (error) {
      console.log("AUTH ERROR:", error.response?.data || error.message);

      // 🔥 FIX: clear invalid token
      localStorage.removeItem("token");
      setToken(null);
      setAuthUser(null);
    } finally {
      setLoading(false);
    }
  };

  // ================= LOGIN / SIGNUP =================
  const login = async (state, credential) => {
    try {
      const endpoint = state === "Sign Up" ? "signup" : "login";

      console.log("Credential sending:", credential);

      // 🔥 FIX: send only required fields for login
      const payload =
        endpoint === "login"
          ? {
              email: credential.email,
              password: credential.password,
            }
          : credential;

      const { data } = await axios.post(
        `/api/v1/auth/${endpoint}`,
        payload
      );

      if (data.success) {
        setAuthUser(data.user);
        setToken(data.token);

        localStorage.setItem("token", data.token);

        // 🔥 IMPORTANT: set axios header globally
        axios.defaults.headers.common["Authorization"] =
          `Bearer ${data.token}`;

        connectSocket(data.user);

        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error");
    }
  };

  // ================= LOGOUT =================
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setAuthUser(null);
    setOnlineUser([]);

    if (socket) {
      socket.disconnect();
      setSocket(null);
    }

    delete axios.defaults.headers.common["Authorization"];

    toast.success("Logged out successfully");
  };

  // ================= UPDATE PROFILE =================
  const updateProfile = async (body) => {
    try {
      const { data } = await axios.put(
        "/api/v1/auth/update-profile",
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        setAuthUser(data.user);
        toast.success("Profile updated successfully");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error");
    }
  };

  // ================= SOCKET =================
  const connectSocket = (userData) => {
    if (!userData) return;

    if (socket) socket.disconnect();

    const newSocket = io(backendUrl, {
      query: { userId: userData._id },
    });

    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);
    });

    newSocket.on("getOnlineUsers", (userIds) => {
      setOnlineUser(userIds);
    });

    setSocket(newSocket);
  };

  // ================= TOKEN SYNC =================
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] =
        `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  // ================= INIT =================
  useEffect(() => {
    checkAuth();
  }, []);

  // ================= CLEANUP =================
  useEffect(() => {
    return () => {
      if (socket) socket.disconnect();
    };
  }, [socket]);

  const value = {
    authUser,
    onlineUser,
    socket,
    login,
    logout,
    updateProfile,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};