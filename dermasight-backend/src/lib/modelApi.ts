import axios from "axios";

const modelApi = axios.create({
    baseURL: process.env.MODEL_API_URL,
    timeout: 30000
});

export default modelApi;
