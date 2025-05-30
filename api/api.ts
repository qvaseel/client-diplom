import axios from "axios";

const api = axios.create({
  baseURL: `https://server-diplom.onrender.com`,
  headers: {
    "Content-Type": "application/json"
  },
  withCredentials: true
});

export { api };
