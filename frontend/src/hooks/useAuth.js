import api from "@/lib/axios";
import { useEffect, useState } from "react";

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Thêm loading state

  useEffect(() => {
    checkAuth();
  }, []); // Gọi checkAuth khi component mount

  const checkAuth = async () => {
    // Thêm async
    try {
      setLoading(true);
      const response = await api.get("/users/verify-auth", {
        // Thêm await
        withCredentials: true,
      });

      if (response.status === 200) {
        setIsAuthenticated(true);
        setUser(response.data.user);
      }
    } catch (error) {
      console.log("Not authenticated, redirecting to login...", error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };
  return { isAuthenticated, user, checkAuth, loading };
};
