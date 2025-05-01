function Layout(content) {
  const userId = localStorage.getItem('userId');
  
  const container = createElement('div', {
    className: 'flex min-h-screen',
  });
  
  const sidebar = createElement('div', {
    className: 'sidebar',
    id: 'sidebar'
  });
  
  const sidebarHeader = createElement('div', {
    className: 'sidebar-header'
  }, [
    createElement('h1', {
      className: 'text-2xl font-bold'
    }, [
      createElement('span', {
        className: 'text-expense'
      }, 'Cash'),
      ' Control'
    ])
  ]);
  
  const currentPath = window.location.pathname;
  
  const sidebarNav = createElement('ul', {
    className: 'sidebar-nav'
  }, [
    createElement('li', {
      className: 'sidebar-nav-item'
    }, [
      createElement('a', {
        className: `sidebar-nav-link ${currentPath === '/dashboard' ? 'active' : ''}`,
        href: '/dashboard'
      }, [
        createElement('i', { 
          className: 'feather',
          'data-feather': 'home'
        }),
        'Dashboard'
      ])
    ]),
    createElement('li', {
      className: 'sidebar-nav-item'
    }, [
      createElement('a', {
        className: `sidebar-nav-link ${currentPath === '/expenses' ? 'active' : ''}`,
        href: '/expenses'
      }, [
        createElement('i', { 
          className: 'feather',
          'data-feather': 'pie-chart'
        }),
        'Expenses'
      ])
    ]),
    createElement('li', {
      className: 'sidebar-nav-item'
    }, [
      createElement('a', {
        className: `sidebar-nav-link ${currentPath === '/add-expense' ? 'active' : ''}`,
        href: '/add-expense'
      }, [
        createElement('i', { 
          className: 'feather',
          'data-feather': 'plus-circle'
        }),
        'Add Expense'
      ])
    ])
  ]);
  
  const sidebarContent = createElement('div', {
    className: 'sidebar-content'
  }, [sidebarNav]);
  
  const user = Auth.state.user;
  const username = user ? user.username : '';
  
  const sidebarFooter = createElement('div', {
    className: 'sidebar-footer'
  }, [
    createElement('div', {
      className: 'flex items-center gap-4 mb-4'
    }, [
      createElement('div', {
        className: 'flex items-center justify-center h-10 w-10 rounded-full bg-expense-light text-expense font-semibold'
      }, username ? username.charAt(0).toUpperCase() : ''),
      createElement('div', {
        className: 'text-sm'
      }, [
        createElement('div', {
          className: 'font-medium'
        }, username),
        createElement('div', {
          className: 'text-muted-foreground text-xs'
        }, user ? user.email : '')
      ])
    ]),
    createElement('button', {
      className: 'btn btn-outline btn-block flex items-center justify-center gap-2',
      onclick: () => Auth.logout()
    }, [
      createElement('i', { 
        className: 'feather', 
        'data-feather': 'log-out'
      }),
      'Logout'
    ])
  ]);
  
  sidebar.appendChild(sidebarHeader);
  sidebar.appendChild(sidebarContent);
  sidebar.appendChild(sidebarFooter);
  
  const mainContent = createElement('div', {
    className: 'main-content'
  }, [
    createElement('div', {
      className: 'container'
    }, [content])
  ]);
  
  const mobileMenuBtn = createElement('button', {
    className: 'mobile-menu-btn',
    onclick: () => toggleSidebar()
  }, [
    createElement('i', { 
      className: 'feather',
      'data-feather': 'menu' 
    })
  ]);
  
  const overlay = createElement('div', {
    className: 'overlay',
    id: 'sidebar-overlay',
    onclick: () => toggleSidebar()
  });
  
  function toggleSidebar() {
    sidebar.classList.toggle('open');
    overlay.classList.toggle('active');
  }
  
  container.appendChild(sidebar);
  container.appendChild(mainContent);
  container.appendChild(mobileMenuBtn);
  container.appendChild(overlay);
  
  setTimeout(() => {
    feather.replace();
  }, 0);
  
  return container;
}

function NotFoundPage() {
  const container = createElement('div', {
    className: 'flex items-center justify-center min-h-screen'
  });
  
  const content = createElement('div', {
    className: 'text-center'
  }, [
    createElement('h1', {
      className: 'text-4xl font-bold mb-4'
    }, '404'),
    createElement('p', {
      className: 'text-xl text-muted-foreground mb-4'
    }, 'Oops! Page not found'),
    createElement('a', {
      className: 'btn btn-expense mt-4',
      href: '/'
    }, 'Return to Home')
  ]);
  
  container.appendChild(content);
  return container;
}

function showToast(message, type = 'info') {
  let toastContainer = document.querySelector('.toast-container');
  if (!toastContainer) {
    toastContainer = createElement('div', {
      className: 'toast-container'
    });
    document.body.appendChild(toastContainer);
    
    const style = document.createElement('style');
    style.textContent = `
      .toast-container {
        position: fixed;
        bottom: 1rem;
        right: 1rem;
        z-index: 100;
        display: flex;
        flex-direction: column-reverse;
        gap: 0.5rem;
      }
      .toast {
        display: flex;
        align-items: center;
        padding: 0.85rem 1rem;
        border-radius: var(--radius);
        color: white;
        animation: toast-slide-in 0.3s ease-out forwards;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        min-width: 18rem;
        backdrop-filter: blur(10px);
      }
      .toast-icon {
        margin-right: 0.75rem;
      }
      .toast-info {
        background-color: rgba(37, 99, 235, 0.8);
        border-left: 4px solid #2563eb;
      }
      .toast-success {
        background-color: rgba(16, 185, 129, 0.8);
        border-left: 4px solid #10b981;
      }
      .toast-error {
        background-color: rgba(239, 68, 68, 0.8);
        border-left: 4px solid #ef4444;
      }
      @keyframes toast-slide-in {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  const iconMap = {
    info: 'info',
    success: 'check-circle',
    error: 'alert-circle'
  };
  
  const toast = createElement('div', {
    className: `toast toast-${type}`
  }, [
    createElement('i', {
      className: `feather toast-icon`,
      'data-feather': iconMap[type] || 'info'
    }),
    message
  ]);
  
  toastContainer.appendChild(toast);
  
  feather.replace();
  
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'opacity 0.3s, transform 0.3s';
    
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3000);
}
