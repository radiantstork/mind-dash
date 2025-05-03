import axios from 'axios'

const customFetch = axios.create({
  baseURL: 'http://localhost:8000/'
});

export default customFetch;