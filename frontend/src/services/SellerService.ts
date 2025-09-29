import axios from "axios";

const REST_API_URL = "http://localhost:8090/api/sellers";

// List all sellers
export const listSellers = () => axios.get(REST_API_URL);

// Get seller by ID
export const getSellerById = (id: number) => axios.get(`${REST_API_URL}/${id}`);