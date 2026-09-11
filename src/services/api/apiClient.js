/**
 * FoodShareAI - Reusable API Client
 * Automatically attaches Bearer JWT, handles JSON serialization, supports configurable timeouts, and formats errors.
 */
import { API_BASE_URL } from './apiConfig';
import { tokenStorage } from './tokenStorage';

const request = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  const token = await tokenStorage.getToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const timeoutMs = options.timeoutMs || 15000;
  const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const timeoutId = controller ? setTimeout(() => controller.abort(), timeoutMs) : null;

  const config = {
    ...options,
    headers,
    signal: options.signal || (controller ? controller.signal : undefined),
  };

  if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMessage = data.message || `Request failed with status ${response.status}`;
      const error = new Error(errorMessage);
      error.status = response.status;
      error.data = data;

      // If token expired or unauthorized, clear token from device
      if (response.status === 401) {
        await tokenStorage.removeToken();
      }

      throw error;
    }

    return data;
  } catch (err) {
    if (err.name === 'AbortError') {
      const timeoutError = new Error(`Request timed out after ${timeoutMs}ms`);
      timeoutError.status = 408;
      throw timeoutError;
    }

    if (err.status) throw err;
    const networkError = new Error(err.message || 'Unable to connect to FoodShareAI server');
    networkError.status = 0;
    throw networkError;
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }
};

export const apiClient = {
  get: (endpoint, options = {}) => request(endpoint, { ...options, method: 'GET' }),
  post: (endpoint, body, options = {}) => request(endpoint, { ...options, method: 'POST', body }),
  put: (endpoint, body, options = {}) => request(endpoint, { ...options, method: 'PUT', body }),
  delete: (endpoint, options = {}) => request(endpoint, { ...options, method: 'DELETE' }),
};
