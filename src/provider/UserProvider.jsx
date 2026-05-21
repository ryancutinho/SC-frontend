import UserContext from "../context/UserContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

axios.defaults.withCredentials = true;

const userProvider = ({ children }) => {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  const BaseUrl = import.meta.env.VITE_BASE_URL;

  // Create axios instance with token
  const getAxiosConfig = () => ({
    headers: token ? { "auth-token": token } : {},
  });

  //global functions
  const handleRegister = async (data) => {
    try {
      const res = await axios.post(`${BaseUrl}/auth/register`, data);
      console.log(res);
      navigate("/"); // Redirect to login
      alert("Registration successful! Please login.");
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Registration failed!");
    }
  };

  const handleLogin = async (data) => {
    try {
      const res = await axios.post(`${BaseUrl}/auth/login`, data);
      console.log(res);

      // Store token
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        setToken(res.data.token);

        // Store user data if needed
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }

      alert("Login successful!");
      navigate("/allposts");
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Login failed!");
    }
  };

  const handleCreatePost = async ({ caption, location, media }) => {
    try {
      const formData = new FormData();

      formData.append("caption", caption);
      formData.append("location", location);

      media.forEach((file) => {
        formData.append("media", file);
      });

      const res = await axios.post(`${BaseUrl}/post/create`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          ...(token && { "auth-token": token }),
        },
      });

      return res.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const getAllPosts = async () => {
    try {
      const res = await axios.get(`${BaseUrl}/post/all`, getAxiosConfig());
      return res.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    navigate("/");
  };

  const value = {
    handleRegister,
    handleLogin,
    handleCreatePost,
    getAllPosts,
    handleLogout,
    token,
    user: localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null,
  };
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default userProvider;
