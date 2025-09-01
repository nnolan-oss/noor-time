import axios from "axios";

export const namazApi = axios.create({
    baseURL: "https://islomapi.uz/api",
    timeout: 5000
})