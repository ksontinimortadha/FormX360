import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000", // ✅ Correct: HTTP for local development
});

// Registration API
export const registerUser = (userData) => API.post("/users/register", userData);
export const loginUser = (userData) => API.post("/users/login", userData);

// Verify email with token
export const verifyEmail = async (token) => {
  try {
    const response = await axios.get(
      `http://localhost:5000/users/verify-email?token=${token}`
    );

    console.log("Verification successful:", response.data);
  } catch (error) {
    console.error("Verification error:", error);
  }
};
