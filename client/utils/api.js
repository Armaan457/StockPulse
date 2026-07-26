const BASE_URL = 'http://127.0.0.1:8000';

class ApiClient {
  constructor() {
    this.accessToken = null;
    this.refreshToken = null;
    if (typeof window !== 'undefined') {
      this.accessToken = localStorage.getItem('access_token');
      this.refreshToken = localStorage.getItem('refresh_token');
    }
  }

  setTokens(access, refresh) {
    this.accessToken = access;
    this.refreshToken = refresh;
    if (typeof window !== 'undefined') {
      if (access) localStorage.setItem('access_token', access);
      else localStorage.removeItem('access_token');
      
      if (refresh) localStorage.setItem('refresh_token', refresh);
      else localStorage.removeItem('refresh_token');
    }
  }

  clearTokens() {
    this.setTokens(null, null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
    }
  }

  getUser() {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      if (!userStr) return null;
      try {
        return JSON.parse(userStr);
      } catch (e) {
        console.error('Failed to parse user JSON', e);
        return { username: userStr }; // Fallback to raw string
      }
    }
    return null;
  }

  setUser(user) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }

  getWebSocketUrl(endpoint) {
    const isHttps = BASE_URL.startsWith('https:');
    const wsProtocol = isHttps ? 'wss:' : 'ws:';
    
    // Extract host and port from BASE_URL
    const baseUrlHost = BASE_URL.replace(/^https?:\/\//, '');
    let finalHost = baseUrlHost;
    
    // If running locally, match the browser's hostname to prevent CORS/Shield blocks
    if (typeof window !== 'undefined' && window.location) {
      const browserHost = window.location.hostname;
      const isLocal = browserHost === 'localhost' || browserHost === '127.0.0.1' || browserHost === '0.0.0.0';
      
      if (isLocal) {
        const portMatch = BASE_URL.match(/:(\d+)/);
        const port = portMatch ? portMatch[1] : '';
        finalHost = port ? `${browserHost}:${port}` : browserHost;
      }
    }
    
    return `${wsProtocol}//${finalHost}${endpoint}`;
  }

  async request(endpoint, options = {}) {
    const url = `${BASE_URL}${endpoint}`;
    
    // Set headers
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }

    const config = {
      ...options,
      headers,
    };

    let response = await fetch(url, config);

    // Auto-refresh token if 401 Unauthorized
    if (response.status === 401) {
      const isAuthEndpoint = endpoint.includes('/auth/login/') || endpoint.includes('/auth/register/');
      
      if (!isAuthEndpoint) {
        let refreshed = false;
        if (this.refreshToken) {
          refreshed = await this.refreshAccessToken();
        }
        
        if (refreshed) {
          // Retry original request with new token
          headers['Authorization'] = `Bearer ${this.accessToken}`;
          response = await fetch(url, config);
        } else {
          this.clearTokens();
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
        }
      }
    }

    return response;
  }

  async refreshAccessToken() {
    try {
      const response = await fetch(`${BASE_URL}/auth/token/refresh/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: this.refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        this.setTokens(data.access, this.refreshToken);
        return true;
      }
    } catch (e) {
      console.error('Failed to refresh token', e);
    }
    return false;
  }

  // Auth Methods
  async login(username, password) {
    const response = await this.request('/auth/login/', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.detail || 'Login failed');
    }

    const data = await response.json();
    this.setTokens(data.access, data.refresh);
    
    // Save minimal user info (like username)
    this.setUser({ username });
    return data;
  }

  async register(username, fullName, phoneNumber, email, password) {
    const response = await this.request('/auth/register/', {
      method: 'POST',
      body: JSON.stringify({
        username,
        full_name: fullName,
        phone_number: phoneNumber,
        email,
        password,
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      // Handle array of error messages or single message
      const errorMsg = Object.values(err).flat().join(', ');
      throw new Error(errorMsg || 'Registration failed');
    }

    return response.json();
  }

  async logout() {
    try {
      if (this.refreshToken) {
        await this.request('/auth/logout/', {
          method: 'POST',
          body: JSON.stringify({ refresh_token: this.refreshToken }),
        });
      }
    } catch (e) {
      console.error('Logout request failed', e);
    } finally {
      this.clearTokens();
    }
  }

  // Portfolio Methods
  async getPortfolios() {
    const response = await this.request('/Portfolios/portfolio/');
    if (!response.ok) throw new Error('Failed to fetch portfolio');
    return response.json();
  }

  async createPortfolio(tickerName, investmentAmount) {
    const response = await this.request('/Portfolios/portfolio/', {
      method: 'POST',
      body: JSON.stringify({
        ticker_name: tickerName.toUpperCase(),
        investment_amount: parseInt(investmentAmount, 10),
      }),
    });
    if (!response.ok) throw new Error('Failed to add ticker');
    return response.json();
  }

  async deletePortfolio(id) {
    const response = await this.request(`/Portfolios/portfolio/${id}/`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete ticker');
    return true;
  }

  // Investment Methods
  async getPortfolioPerformance(companies, amounts, startDate = '2015-01-01') {
    const queryParams = new URLSearchParams();
    companies.forEach(company => queryParams.append('companies', company));
    amounts.forEach(amount => queryParams.append('amounts', amount));
    if (startDate) {
      queryParams.append('start_date', startDate);
    }

    const response = await this.request(`/investment/portfolio-performance/?${queryParams.toString()}`);
    if (!response.ok) throw new Error('Failed to load portfolio performance data');
    return response.json();
  }

  async getTopStocks(tickers = [], period = '1mo') {
    const queryParams = new URLSearchParams({ period });
    if (tickers && tickers.length > 0) {
      tickers.forEach(t => queryParams.append('tickers', t));
    }
    const response = await this.request(`/investment/top-stocks/?${queryParams.toString()}`);
    if (!response.ok) throw new Error('Failed to load market top stocks');
    return response.json();
  }

  // AI Agent Methods
  async predictStock(stocksName) {
    const response = await this.request('/agents/predict', {
      method: 'POST',
      body: JSON.stringify({ stocks_name: stocksName.toUpperCase() }),
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || 'Prediction failed');
    }
    return response.json();
  }

  async analyzePortfolio(portfolioStocks, traderProfile) {
    const response = await this.request('/agents/analyze', {
      method: 'POST',
      body: JSON.stringify({ portfolio_stocks: portfolioStocks, trader_profile: traderProfile }),
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || 'Portfolio analysis failed');
    }
    return response.json();
  }

  async chatBot(query, history = []) {
    const response = await this.request('/agents/chat', {
      method: 'POST',
      body: JSON.stringify({ query, history }),
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || 'Chat request failed');
    }
    return response.json();
  }

  async getVideos(stocksName) {
    const response = await this.request('/agents/videos', {
      method: 'POST',
      body: JSON.stringify({ stocks_name: stocksName }),
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || 'Videos request failed');
    }
    return response.json();
  }
}

export const api = new ApiClient();
