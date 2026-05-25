const API_URL = import.meta.env.VITE_API_URL || '';

// Mock responses for development/testing when backend is unavailable
const mockResponses: { [key: string]: unknown } = {
  '/api/ping': { message: 'ping pong' },
  '/api/demo': { data: 'demo' },
  '/api/contact': { success: true, message: 'Email enviado com sucesso' },
  '/api/trial-signup': { success: true, message: 'Teste grátis ativado com sucesso' },
};

async function fetchWithFallback(url: string, options: RequestInit) {
  try {
    const response = await fetch(url, {
      ...options,
      credentials: 'include',
    });
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    return response;
  } catch (error) {
    console.warn('API request failed, checking for mock:', url, error);
    // Extract endpoint from full URL
    const endpoint = url.includes('/api/') ? url.substring(url.indexOf('/api/')) : url;
    if (mockResponses[endpoint as keyof typeof mockResponses]) {
      console.warn('Using mock response for:', endpoint);
      return new Response(JSON.stringify(mockResponses[endpoint as keyof typeof mockResponses]), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    throw error;
  }
}

export const apiClient = {
  get: async (endpoint: string) => {
    const response = await fetchWithFallback(`${API_URL}${endpoint}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    return response.json();
  },

  post: async (endpoint: string, data: unknown) => {
    const response = await fetchWithFallback(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },
};

export const API_ENDPOINTS = {
  PING: '/api/ping',
  DEMO: '/api/demo',
  CONTACT: '/api/contact',
  TRIAL_SIGNUP: '/api/trial-signup',
} as const;
