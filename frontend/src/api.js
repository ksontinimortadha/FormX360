import axios from "axios";

// Axios instance
const API = axios.create({
  baseURL: "//https://form-x360-backend.vercel.app",
});

// Registration API
export const registerUser = (userData) => API.post("/users/register", userData);
export const loginUser = (userData) => API.post("/users/login", userData);

// Verify email with token
export const verifyEmail = async (token) => {
  try {
    const response = await axios.get(
      `https://form-x360-backend.vercel.app/users/verify-email?token=${token}`
    );
    console.log("Verification successful:", response.data);
  } catch (error) {
    console.error("Verification error:", error);
  }
};
