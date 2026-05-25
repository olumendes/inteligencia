const API_URL = import.meta.env.VITE_API_URL || '';

export const apiClient = {
  get: async (endpoint: string) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    return response.json();
  },
  
  post: async (endpoint: string, data: unknown) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    return response.json();
  },
};

export const API_ENDPOINTS = {
  PING: '/api/ping',
  DEMO: '/api/demo',
  CONTACT: '/api/contact',
  TRIAL_SIGNUP: '/api/trial-signup',
} as const;
