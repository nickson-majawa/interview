import axios from "axios";

const API_URL = "https://zipatala.health.gov.mw/api/facilities";

export const getRecords = () => axios.get(API_URL);
export const getRecord = (id) => axios.get(`${API_URL}/${id}`);
