import axios from "axios";
// import authHeader from "./auth-header";
const API_URL = import.meta.env.VITE_APP_API_ENDPOINT;

export default axios.create({
    baseURL: API_URL,
    // headers: authHeader(),
});
