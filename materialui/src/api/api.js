import axios from 'axios';
import { ServerUrl } from '../consts/consts';
import Cookies from 'js-cookie';

const authPath =  ServerUrl.includes(':3000') ? '/api/v1/' : '/api/v1/auth/';
// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: ServerUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for global error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      Cookies.remove('token');
      window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);

export const apiHelpers = {
  // Generic error handler
  handleError: (error) => {
    if (error.response) {
      return `Server error: ${error.response.status}`;
    } else if (error.request) {
      return 'Network error';
    } else {
      return 'Unknown error';
    }
  },

  // Retry logic
  retry: async (fn, retries = 3) => {
    try {
      return await fn();
    } catch (error) {
      if (retries > 0) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return apiHelpers.retry(fn, retries - 1);
      }
      throw error;
    }
  },
};

// API Functions
export const api = {
  // Trip Points
  places: {
    getAll: () => apiClient.get('/api/v1/places/'),
    getById: (id) => apiClient.get(`/api/v1/places/${id}`), // Add if needed
    create: (data) => apiClient.post('/api/v1/places/', data), // ← Changed from /addplace
    update: (id, data) => apiClient.put(`/api/v1/places/${id}`, data), // ← Changed from /places/:id
    delete: (id) => apiClient.delete(`/api/v1/places/${id}`), // ← Changed from /places/:id
  },

  // Blog Posts
  blog: {
    getAll: () => apiClient.get('/api/v1/blog/'),
    getById: (id) => apiClient.get(`/api/v1/blog/${id}`),
    create: (data) => apiClient.post('/api/v1/blog/', data),
    update: (id, data) => apiClient.put(`/api/v1/blog/${id}`, data),
    delete: (id) => apiClient.delete(`/api/v1/blog/${id}`),
  },

  // Blog Comments
  comments: {
    getByBlogId: (blogId) => apiClient.get(`/api/v1/comments/${blogId}`),
    create: (blogId, data) => apiClient.post(`/api/v1/comments/${blogId}`, data), // ← Change to /comments
    update: (blogId, commentId, data) => apiClient.put(`/api/v1/comments/${blogId}/${commentId}`, data), // ← Change to /comments
    delete: (blogId, commentId) => apiClient.delete(`/api/v1/comments/${blogId}/${commentId}`), // ← Change to /comments
  },

  // Users
  users: {
    getAll: () => apiClient.get('/api/v1/users/'),
    getById: (id) => apiClient.get(`/api/v1/users/${id}`),
    create: (data) => apiClient.post('/api/v1/users/', data),
    update: (id, data) => apiClient.put(`/api/v1/users/${id}`, data),
    delete: (id) => apiClient.delete(`/api/v1/users/${id}`),
    verify: (data) => apiClient.post('/api/v1/users/verify-email/', data),
  },
  // Auth
  auth: {
    login: (credentials) => apiClient.post(authPath + 'login', credentials),
    signup: (userData) => apiClient.post(authPath + 'signup', userData),
    logout: () => apiClient.post(authPath + 'logout'),
    refreshToken: () => apiClient.post(authPath + 'refresh'),
    resendVerificationEmail: (data) => apiClient.post(authPath + 'resend-verification', data),
  },
  // Update the files section in your api object
  files: {
    getStructure: () => apiClient.get('/api/v1/files/structure'),
    getYearMakes: () => apiClient.get('/api/v1/files/'),
    getModels: (yearMake) => apiClient.get(`/api/v1/files/${yearMake}`),
    getFiles: (yearMake, model) => apiClient.get(`/api/v1/files/${yearMake}/${model}`),
    downloadFile: (yearMake, model, fileName, parentDir) => {
      if(parentDir) {
        return apiClient.get(`/api/v1/files/${yearMake}/${model}/download/${fileName}/${parentDir}`, {
          responseType: 'blob'
        })
      } else {
        return apiClient.get(`/api/v1/files/${yearMake}/${model}/download/${fileName}`, {
          responseType: 'blob'
        })
      }
    },
    downloadDirectory: (yearMake, model, dirName) =>
      apiClient.get(`/api/v1/files/${yearMake}/${model}/download-directory/${dirName}`, {
        responseType: 'blob'
      }),
    downloadAll: (yearMake, model) =>
      apiClient.get(`/api/v1/files/${yearMake}/${model}/download-all`, {
        responseType: 'blob'
      }),
    downloadSelected: (yearMake, model, fileNames) =>
      apiClient.post(`/api/v1/files/${yearMake}/${model}/download-selected`, { fileNames }, {
        responseType: 'blob'
      })
  },

  // Generic functions for custom endpoints
  get: (url) => apiClient.get(url),
  post: (url, data) => apiClient.post(url, data),
  put: (url, data) => apiClient.put(url, data),
  delete: (url) => apiClient.delete(url),
};

export default api;
