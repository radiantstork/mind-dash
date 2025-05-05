import customFetch from "./custom_fetch";

export async function getCsrfToken() {
    const response = await customFetch.post('/api/auth/login/', {
      credentials: 'include',
    });
    return response.data.csrfToken;
  }