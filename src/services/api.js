import axios from 'axios'

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://real-estate-backend-billowing-leaf-4519.fly.dev/api'
  : 'http://localhost:5000/api'

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle API responses consistently
api.interceptors.response.use(
  (response) => {
    // Return the data if it's a successful API response
    if (response.data && response.data.success) {
      return response.data.data
    }
    return response.data
  },
  async (error) => {
    // Handle 401 errors (token expired)
    if (error.response?.status === 401) {
      const refreshToken = localStorage.getItem('refresh_token')
      
      if (refreshToken && !error.config._retry) {
        error.config._retry = true
        
        try {
          // Try to refresh the token
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {}, {
            headers: {
              Authorization: `Bearer ${refreshToken}`
            }
          })
          
          const newToken = response.data.data.access_token
          localStorage.setItem('access_token', newToken)
          
          // Retry the original request with new token
          error.config.headers.Authorization = `Bearer ${newToken}`
          return api.request(error.config)
        } catch (refreshError) {
          // Refresh failed, clear tokens and redirect to login
          localStorage.removeItem('access_token')
          localStorage.removeItem('refresh_token')
          window.location.href = '/login'
          return Promise.reject(refreshError)
        }
      } else {
        // No refresh token or refresh already attempted
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        window.location.href = '/login'
      }
    }
    
    // Handle API errors
    if (error.response && error.response.data && error.response.data.error) {
      throw new Error(error.response.data.error)
    }
    throw error
  }
)

// Authentication API
export const authAPI = {
  login: (usernameOrEmail, password) => api.post('/auth/login', { 
    username_or_email: usernameOrEmail, 
    password 
  }),
  register: (userData) => api.post('/auth/register', userData),
  refreshToken: () => {
    const refreshToken = localStorage.getItem('refresh_token')
    return axios.post(`${API_BASE_URL}/auth/refresh`, {}, {
      headers: {
        Authorization: `Bearer ${refreshToken}`
      }
    }).then(response => response.data.data)
  },
  getCurrentUser: () => api.get('/auth/me'),
  updateProfile: (profileData) => api.put('/auth/profile', profileData),
  changePassword: (currentPassword, newPassword) => api.post('/auth/change-password', {
    current_password: currentPassword,
    new_password: newPassword
  }),
}

// Dashboard API
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
}

// Properties API
export const propertiesAPI = {
  searchProperties: (searchData) => api.post('/properties/search', searchData),
  getAllProperties: () => api.get('/properties'),
}

// Deals API
export const dealsAPI = {
  getAllDeals: () => api.get('/deals'),
  createDeal: (dealData) => api.post('/deals', dealData),
  updateDeal: (dealId, updateData) => api.put(`/deals/${dealId}`, updateData),
}

// Developers API
export const developersAPI = {
  getAllDevelopers: () => api.get('/developers'),
  createDeveloper: (developerData) => api.post('/developers', developerData),
}

// Calculator API
export const calculatorAPI = {
  calculateOffer: (calculationData) => api.post('/calculate-offer', calculationData),
}

// Legacy API for backward compatibility
export const propertyApi = {
  searchProperties: async (city, state = 'CA') => {
    return propertiesAPI.searchProperties({ city, state })
  },
  getPropertyDetails: async (propertyId) => {
    const properties = await propertiesAPI.getAllProperties()
    return properties.find(p => p.id === propertyId || p.address === propertyId)
  },
}

export const calculatorApi = {
  calculateOffer: async (marketValue, taxOwed = 0, targetMargin = 0.35) => {
    return calculatorAPI.calculateOffer({
      market_value: marketValue,
      tax_owed: taxOwed,
      target_margin: targetMargin,
    })
  },
}

export const dealsApi = {
  getDeals: async () => {
    return dealsAPI.getAllDeals()
  },
  createDeal: async (propertyId, offerAmount, notes = '') => {
    return dealsAPI.createDeal({
      property_id: propertyId,
      offer_amount: offerAmount,
      notes,
    })
  },
  updateDeal: async (dealId, status, notes = '') => {
    return dealsAPI.updateDeal(dealId, { status, notes })
  },
}

export const developersApi = {
  getDevelopers: async () => {
    return developersAPI.getAllDevelopers()
  },
  createDeveloper: async (developerData) => {
    return developersAPI.createDeveloper(developerData)
  },
}

export default api
