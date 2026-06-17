import axios from "axios";

export { axios };

export const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});
