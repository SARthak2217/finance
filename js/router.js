const Router = {
  currentRoute: '/',
  
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
  
  init() {
    this.handleRouteChange();
    
    window.addEventListener('popstate', () => {
      this.handleRouteChange();
    });
    
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (link && link.href.startsWith(window.location.origin)) {
        e.preventDefault();
        const href = link.getAttribute('href');
        this.navigate(href);
      }
    });
    
    Auth.subscribe(() => {
      this.handleRouteChange();
    });
  },
  
  navigate(path) {
    window.history.pushState(null, '', path);
    this.handleRouteChange();
  },
  
  handleRouteChange() {
    const path = window.location.pathname;
    this.currentRoute = path;
    
    let route = this.routes[path];
    
    if (!route) {
      route = this.routes['/not-found'];
      this.currentRoute = '/not-found';
    }
    
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
    
    this.renderComponent(route.component);
  },
  
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
  
  renderComponent(componentName) {
    const appElement = document.getElementById('app');
    appElement.innerHTML = '';
    
    if (typeof window[componentName] === 'function') {
      const component = window[componentName]();
      appElement.appendChild(component);
    } else {
      console.error(`Component ${componentName} not found`);
      this.navigate('/not-found');
    }
  }
};
