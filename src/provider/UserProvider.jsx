import UserContext from "../context/UserContext"
import axios from "axios"

axios.defaults.withCredentials = true

const userProvider = ({ children }) => {
    //global states

    const BaseUrl = import.meta.env.VITE_BASE_URL

    //global functions
    const handleRegister = async (data) => {
        try {
            const res = await axios.post(`${BaseUrl}auth/register`, data)
            console.log(res)
        } catch (error) {
            console.log(error)
        }
    }

    const handleLogin = async (data) => {
        try {
            const res = await axios.post(`${BaseUrl}auth/login`, data)
            console.log(res)
        } catch (error) {
            console.log(error)
        }
    }

  const handleCreatePost = async ({ caption, location, media }) => {
    try {
      const formData = new FormData();

      formData.append("caption", caption);
      formData.append("location", location);

      media.forEach((file) => {
        formData.append("media", file);
      });

      const res = await axios.post(`${BaseUrl}post/create`, formData, {
        headers: {  
          "Content-Type": "multipart/form-data",
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
      const res = await axios.get(`${BaseUrl}post/all`);
      return res.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };


    const value = {
        handleRegister,
        handleLogin,
        handleCreatePost,
        getAllPosts,
    }
    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    )
}

export default userProvider;