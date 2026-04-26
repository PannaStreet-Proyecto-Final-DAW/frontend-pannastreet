const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchApi = async (endpoint: string, options: RequestInit = {}) => {
  // Ensure endpoint starts with /
  const formattedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  const response = await fetch(`${API_URL}${formattedEndpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(error.error || error.message || `Error ${response.status}: ${response.statusText}`);
  }
  
  return response.json();
};
