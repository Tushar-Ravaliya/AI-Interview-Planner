import axios from "axios";
import { config } from "../config/config.ts";

const api = axios.create({
  baseURL: `${config.apiBaseUrl}/api`,
  withCredentials: true,
});

export default api;
