import axios from 'axios';

// Function to get CSRF token from cookies
function getCSRFToken(): string | null {
  const cookieValue = document.cookie
    .split('; ')
    .find(row => row.startsWith('csrftoken='))
    ?.split('=')[1];
  return cookieValue || null;
}

const customFetch = axios.create({
  baseURL: 'http://localhost:8000/',
  withCredentials: true, // Important for session authentication
});

// Add a request interceptor to include CSRF token in headers
customFetch.interceptors.request.use(config => {
  // Only add CSRF token for methods that modify data
  if (['post', 'put', 'patch', 'delete'].includes(config.method?.toLowerCase() || '')) {
    const csrfToken = getCSRFToken();
    if (csrfToken) {
      config.headers['X-CSRFToken'] = csrfToken;
    } else {
      console.warn('CSRF token not found in cookies');
    }
  }
  return config;
}, error => {
  return Promise.reject(error);
});

export default customFetch;