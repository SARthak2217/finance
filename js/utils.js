function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric'
  });
}

function formatCurrency(amount) {
  return parseFloat(amount).toFixed(2);
}

function createElement(tag, props = {}, children = []) {
  const element = document.createElement(tag);
  
  Object.entries(props).forEach(([key, value]) => {
    if (key === 'className') {
      element.className = value;
    } else if (key === 'style' && typeof value === 'object') {
      Object.entries(value).forEach(([cssKey, cssValue]) => {
        element.style[cssKey] = cssValue;
      });
    } else if (key.startsWith('on') && typeof value === 'function') {
      const eventName = key.slice(2).toLowerCase();
      element.addEventListener(eventName, value);
    } else {
      element.setAttribute(key, value);
    }
  });
  
  if (Array.isArray(children)) {
    children.forEach(child => {
      if (child !== null && child !== undefined) {
        if (typeof child === 'string') {
          element.appendChild(document.createTextNode(child));
        } else {
          element.appendChild(child);
        }
      }
    });
  } else if (typeof children === 'string') {
    element.textContent = children;
  }
  
  return element;
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
        padding: 0.75rem 1rem;
        border-radius: var(--radius);
        color: white;
        animation: toast-slide-in 0.3s ease-out forwards;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        max-width: 24rem;
      }
      .toast-info {
        background-color: #3b82f6;
      }
      .toast-success {
        background-color: #10b981;
      }
      .toast-error {
        background-color: #ef4444;
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
  
  const toast = createElement('div', {
    className: `toast toast-${type}`
  }, message);
  
  toastContainer.appendChild(toast);
  
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'opacity 0.3s, transform 0.3s';
    
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3000);
}

function generateUUID() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}
