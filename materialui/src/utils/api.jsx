import Cookies from 'js-cookie';

export const apiRequest = async (url, options = {}) => {
  const token = Cookies.get('token');
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  const response = await fetch(url, config);
  
  if (response.status === 401) {
    // Token expired or invalid
    Cookies.remove('token');
    window.location.href = '/signin';
    return;
  }

  return response;
};