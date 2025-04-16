
/**
 * Login page component
 */
function LoginPage() {
  // Create container
  const container = createElement('div', {
    className: 'auth-container'
  });
  
  // Create card
  const card = createElement('div', {
    className: 'auth-card card'
  });
  
  // Card header
  const cardHeader = createElement('div', {
    className: 'card-header text-center'
  }, [
    createElement('h1', {
      className: 'card-title text-3xl font-bold text-primary'
    }, 'Sign In'),
    createElement('p', {
      className: 'card-description'
    }, 'Enter your credentials to access your account')
  ]);
  
  // Error message (hidden by default)
  const errorAlert = createElement('div', {
    className: 'alert alert-error hidden',
    id: 'login-error'
  }, [
    createElement('i', { 
      className: 'feather',
      'data-feather': 'alert-circle'
    }),
    createElement('p', {
      className: 'text-sm',
      id: 'error-message'
    }, '')
  ]);
  
  // Email input field
  const emailGroup = createElement('div', {
    className: 'form-group'
  }, [
    createElement('label', {
      className: 'form-label',
      for: 'email'
    }, 'Email'),
    createElement('input', {
      className: 'form-input',
      id: 'email',
      type: 'email',
      placeholder: 'Enter your email',
      required: true
    })
  ]);
  
  // Password input field
  const passwordGroup = createElement('div', {
    className: 'form-group'
  }, [
    createElement('label', {
      className: 'form-label',
      for: 'password'
    }, 'Password'),
    createElement('input', {
      className: 'form-input',
      id: 'password',
      type: 'password',
      placeholder: 'Enter your password',
      required: true
    })
  ]);
  
  // Submit button
  const submitButton = createElement('button', {
    className: 'btn btn-primary btn-block',
    id: 'login-button',
    type: 'submit'
  }, 'Sign In');
  
  // Form element
  const form = createElement('form', {
    className: 'space-y-4',
    id: 'login-form',
    onsubmit: handleSubmit
  }, [
    errorAlert,
    emailGroup,
    passwordGroup,
    createElement('div', {
      className: 'mt-6'
    }, [submitButton])
  ]);
  
  // Register link
  const registerLink = createElement('div', {
    className: 'mt-6 text-center text-sm'
  }, [
    'Don\'t have an account? ',
    createElement('a', {
      className: 'text-primary hover:underline',
      href: '/register'
    }, 'Sign up')
  ]);
  
  // Card content
  const cardContent = createElement('div', {
    className: 'card-content'
  }, [form, registerLink]);
  
  // Append all elements to the card
  card.appendChild(cardHeader);
  card.appendChild(cardContent);
  
  // Append card to container
  container.appendChild(card);
  
  // Form submission handler
  async function handleSubmit(e) {
    e.preventDefault();
    
    // Get form values
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const errorElement = document.getElementById('login-error');
    const errorMessageElement = document.getElementById('error-message');
    const loginButton = document.getElementById('login-button');
    
    // Validate inputs
    if (!email || !password) {
      errorMessageElement.textContent = 'Email and password are required';
      errorElement.classList.remove('hidden');
      feather.replace();
      return;
    }
    
    // Hide previous errors
    errorElement.classList.add('hidden');
    
    try {
      // Show loading state
      loginButton.disabled = true;
      loginButton.innerHTML = 'Signing In...';
      
      // Attempt login
      await Auth.login(email, password);
      
      // Show success message and redirect
      showToast('Successfully signed in', 'success');
      Router.navigate('/dashboard');
    } catch (error) {
      // Show error message
      errorMessageElement.textContent = error.message || 'Invalid email or password';
      errorElement.classList.remove('hidden');
      feather.replace();
    } finally {
      // Reset button state
      loginButton.disabled = false;
      loginButton.innerHTML = 'Sign In';
    }
  }
  
  // Initialize feather icons
  setTimeout(() => {
    feather.replace();
  }, 0);
  
  return container;
}
