const BACKEND_URL = "https://marketplace-be-csqx.onrender.com";
import axios from "axios";

export default axios.create({
  baseURL: BACKEND_URL,
  headers: { "Content-Type": "application/json" },
});
