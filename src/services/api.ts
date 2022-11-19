import axios from 'axios';

const apiUrl = 'http://localhost/';
const api = axios.create({
  baseURL: apiUrl,
});

export default api;

const javaApiUrl = 'http://localhost:8080/';
export const javaApi = axios.create({
  baseURL: javaApiUrl,
});
