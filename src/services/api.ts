import axios from 'axios';

const apiUrl = 'http://localhost/';
const api = axios.create({
  baseURL: apiUrl,
});

export default api;
