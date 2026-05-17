const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchApi = async (endpoint: string, options: RequestInit = {}) => {
  if (!API_URL) {
    console.error("❌ NEXT_PUBLIC_API_URL is not defined in .env");
    throw new Error("API URL is not configured. Please check your .env file.");
  }

  const formattedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const fullUrl = `${API_URL}${formattedEndpoint}`;
  
  console.log(`🌐 Calling API: ${options.method || 'GET'} ${fullUrl}`);
  
  try {
    const headers: any = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('jwt_token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    const response = await fetch(fullUrl, {
      ...options,
      headers,
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: response.statusText }));
      if (!(options as any).ignoreErrors) {
        console.error(`❌ API Error (${response.status}):`, error);
      }
      throw new Error(error.error || error.message || `Error ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    if (!(options as any).ignoreErrors) {
      console.error("❌ Fetch failed:", error);
    }
    throw error;
  }
};
