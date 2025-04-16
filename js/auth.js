
/**
 * Authentication management for expense tracker application
 */

// Auth state management
const Auth = {
  // Current state
  state: {
    isAuthenticated: false,
    user: null,
    loading: true
  },
  
  // Event listeners
  listeners: [],
  
  // Subscribe to auth state changes
  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  },
  
  // Notify all listeners of state change
  notify() {
    this.listeners.forEach(listener => listener(this.state));
  },
  
  // Initialize auth state from local storage
  async init() {
    const userId = localStorage.getItem('userId');
    if (userId) {
      try {
        this.state.loading = true;
        this.notify();
        
        const user = await UserAPI.getCurrentUser(userId);
        this.state = {
          isAuthenticated: true,
          user,
          loading: false
        };
      } catch (error) {
        localStorage.removeItem('userId');
        this.state = {
          isAuthenticated: false,
          user: null,
          loading: false
        };
      }
    } else {
      this.state = {
        isAuthenticated: false,
        user: null,
        loading: false
      };
    }
    
    this.notify();
  },
  
  // Login a user
  async login(email, password) {
    try {
      this.state.loading = true;
      this.notify();
      
      const user = await UserAPI.login(email, password);
      localStorage.setItem('userId', user.id);
      
      this.state = {
        isAuthenticated: true,
        user,
        loading: false
      };
      
      this.notify();
      return user;
    } catch (error) {
      this.state.loading = false;
      this.notify();
      throw error;
    }
  },
  
  // Register a new user
  async register(username, email, password) {
    try {
      this.state.loading = true;
      this.notify();
      
      const user = await UserAPI.register({ username, email, password });
      localStorage.setItem('userId', user.id);
      
      this.state = {
        isAuthenticated: true,
        user,
        loading: false
      };
      
      this.notify();
      return user;
    } catch (error) {
      this.state.loading = false;
      this.notify();
      throw error;
    }
  },
  
  // Logout current user
  logout() {
    localStorage.removeItem('userId');
    
    this.state = {
      isAuthenticated: false,
      user: null,
      loading: false
    };
    
    this.notify();
    Router.navigate('/login');
  },
  
  // Update user income
  async updateIncome(income) {
    if (!this.state.user) return;
    
    try {
      this.state.loading = true;
      this.notify();
      
      const updatedUser = await UserAPI.updateIncome(this.state.user.id, income);
      
      this.state = {
        ...this.state,
        user: updatedUser,
        loading: false
      };
      
      this.notify();
      return updatedUser;
    } catch (error) {
      this.state.loading = false;
      this.notify();
      throw error;
    }
  }
};
