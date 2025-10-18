import axios from "axios";

// const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3333" : ""

const BASE_URL= "http://localhost:3333"

const api = axios.create({
  baseURL : BASE_URL,
  withCredentials: true, // QUAN TRỌNG: Cho phép gửi/nhận cookies
  headers: {
    'Content-Type': 'application/json',
  }
})

export default api;

