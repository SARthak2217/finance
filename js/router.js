
/**
 * Simple client-side router for the expense tracker application
 */

const Router = {
  // Current route
  currentRoute: '/',
  
  // Routes configuration
  routes: {
    '/': {
      redirectIfAuth: '/dashboard',
      redirectIfNotAuth: '/login'
    },
    '/login': {
      component: 'LoginPage',
      redirectIfAuth: '/dashboard',
    },
    '/register': {
      component: 'RegisterPage',
      redirectIfAuth: '/dashboard',
    },
    '/dashboard': {
      component: 'DashboardPage',
      requiresAuth: true
    },
    '/expenses': {
      component: 'ExpensesPage',
      requiresAuth: true
    },
    '/add-expense': {
      component: 'AddExpensePage',
      requiresAuth: true
    },
    '/not-found': {
      component: 'NotFoundPage'
    }
  },
  
  // Initialize router
  init() {
    // Handle initial route
    this.handleRouteChange();
    
    // Add event listener for popstate (browser back/forward)
    window.addEventListener('popstate', () => {
      this.handleRouteChange();
    });
    
    // Intercept link clicks for SPA navigation
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (link && link.href.startsWith(window.location.origin)) {
        e.preventDefault();
        const href = link.getAttribute('href');
        this.navigate(href);
      }
    });
    
    // Subscribe to auth state changes to handle redirects
    Auth.subscribe(() => {
      this.handleRouteChange();
    });
  },
  
  // Navigate to a route
  navigate(path) {
    // Push state to history
    window.history.pushState(null, '', path);
    // Handle the route change
    this.handleRouteChange();
  },
  
  // Handle route changes
  handleRouteChange() {
    // Get current path
    const path = window.location.pathname;
    this.currentRoute = path;
    
    // Find route config
    let route = this.routes[path];
    
    // Default to not-found if route doesn't exist
    if (!route) {
      route = this.routes['/not-found'];
      this.currentRoute = '/not-found';
    }
    
    // Handle authentication redirects
    if (Auth.state.loading) {
      this.showLoading();
      return;
    }
    
    if (route.requiresAuth && !Auth.state.isAuthenticated) {
      this.navigate('/login');
      return;
    }
    
    if (route.redirectIfAuth && Auth.state.isAuthenticated) {
      this.navigate(route.redirectIfAuth);
      return;
    }
    
    if (route.redirectIfNotAuth && !Auth.state.isAuthenticated) {
      this.navigate(route.redirectIfNotAuth);
      return;
    }
    
    // Render the component
    this.renderComponent(route.component);
  },
  
  // Show loading state
  showLoading() {
    const appElement = document.getElementById('app');
    appElement.innerHTML = '';
    
    const loadingElement = createElement('div', {
      className: 'flex items-center justify-center min-h-screen'
    }, [
      createElement('div', {
        className: 'text-center'
      }, [
        createElement('div', {
          className: 'spinner'
        }),
        createElement('p', {
          className: 'mt-4'
        }, 'Loading...')
      ])
    ]);
    
    appElement.appendChild(loadingElement);
  },
  
  // Render a component
  renderComponent(componentName) {
    const appElement = document.getElementById('app');
    appElement.innerHTML = '';
    
    // Initialize the component
    if (typeof window[componentName] === 'function') {
      const component = window[componentName]();
      appElement.appendChild(component);
    } else {
      console.error(`Component ${componentName} not found`);
      this.navigate('/not-found');
    }
  }
};
