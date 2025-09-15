// API Configuration for BanRakshak Frontend
const getBaseUrl = () => {
  // Check for environment variable first
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  if (envUrl) {
    return envUrl;
  }
  
  // Fallback to localhost
  return 'http://localhost:8000';
};

export const API_CONFIG = {
  BASE_URL: getBaseUrl(),
  ENDPOINTS: {
    OCR: {
      UPLOAD: '/api/ocr/upload',
      STATUS: '/api/ocr/status',
      RESULT: '/api/ocr/result',
      TASKS: '/api/ocr/tasks',
      DELETE: '/api/ocr/task'
    },
    ASSETS: {
      HEALTH: '/api/assets/health',
      ANALYZE: '/api/assets/analyze'
    },
    HEALTH: '/api/health'
  }
}

// Helper function for API calls
export const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  }

  // Remove Content-Type for FormData (let browser set it)
  if (options.body instanceof FormData) {
    const headers = defaultOptions.headers as Record<string, string>
    delete headers['Content-Type']
  }

  try {
    const response = await fetch(url, defaultOptions)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error(`API call failed for ${endpoint}:`, error)
    throw error
  }
}
