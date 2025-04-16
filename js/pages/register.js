
/**
 * Register page component
 */
function RegisterPage() {
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
    }, 'Sign Up'),
    createElement('p', {
      className: 'card-description'
    }, 'Create an account to track your expenses')
  ]);
  
  // Error message (hidden by default)
  const errorAlert = createElement('div', {
    className: 'alert alert-error hidden',
    id: 'register-error'
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
  
  // Username input field
  const usernameGroup = createElement('div', {
    className: 'form-group'
  }, [
    createElement('label', {
      className: 'form-label',
      for: 'username'
    }, 'Username'),
    createElement('input', {
      className: 'form-input',
      id: 'username',
      type: 'text',
      placeholder: 'Enter your username',
      required: true
    })
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
      placeholder: 'Create a password',
      required: true
    })
  ]);
  
  // Confirm password input field
  const confirmPasswordGroup = createElement('div', {
    className: 'form-group'
  }, [
    createElement('label', {
      className: 'form-label',
      for: 'confirmPassword'
    }, 'Confirm Password'),
    createElement('input', {
      className: 'form-input',
      id: 'confirmPassword',
      type: 'password',
      placeholder: 'Confirm your password',
      required: true
    })
  ]);
  
  // Submit button
  const submitButton = createElement('button', {
    className: 'btn btn-primary btn-block',
    id: 'register-button',
    type: 'submit'
  }, 'Create Account');
  
  // Form element
  const form = createElement('form', {
    className: 'space-y-4',
    id: 'register-form',
    onsubmit: handleSubmit
  }, [
    errorAlert,
    usernameGroup,
    emailGroup,
    passwordGroup,
    confirmPasswordGroup,
    createElement('div', {
      className: 'mt-6'
    }, [submitButton])
  ]);
  
  // Login link
  const loginLink = createElement('div', {
    className: 'mt-6 text-center text-sm'
  }, [
    'Already have an account? ',
    createElement('a', {
      className: 'text-primary hover:underline',
      href: '/login'
    }, 'Sign in')
  ]);
  
  // Card content
  const cardContent = createElement('div', {
    className: 'card-content'
  }, [form, loginLink]);
  
  // Append all elements to the card
  card.appendChild(cardHeader);
  card.appendChild(cardContent);
  
  // Append card to container
  container.appendChild(card);
  
  // Form submission handler
  async function handleSubmit(e) {
    e.preventDefault();
    
    // Get form values
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value.trim();
    const errorElement = document.getElementById('register-error');
    const errorMessageElement = document.getElementById('error-message');
    const registerButton = document.getElementById('register-button');
    
    // Hide previous errors
    errorElement.classList.add('hidden');
    
    // Validate inputs
    if (!username || !email || !password || !confirmPassword) {
      errorMessageElement.textContent = 'All fields are required';
      errorElement.classList.remove('hidden');
      feather.replace();
      return;
    }
    
    if (password !== confirmPassword) {
      errorMessageElement.textContent = 'Passwords do not match';
      errorElement.classList.remove('hidden');
      feather.replace();
      return;
    }
    
    if (password.length < 6) {
      errorMessageElement.textContent = 'Password must be at least 6 characters';
      errorElement.classList.remove('hidden');
      feather.replace();
      return;
    }
    
    try {
      // Show loading state
      registerButton.disabled = true;
      registerButton.innerHTML = 'Creating Account...';
      
      // Attempt registration
      await Auth.register(username, email, password);
      
      // Show success message and redirect
      showToast('Account created successfully', 'success');
      Router.navigate('/dashboard');
    } catch (error) {
      // Show error message
      errorMessageElement.textContent = error.message || 'Registration failed';
      errorElement.classList.remove('hidden');
      feather.replace();
    } finally {
      // Reset button state
      registerButton.disabled = false;
      registerButton.innerHTML = 'Create Account';
    }
  }
  
  // Initialize feather icons
  setTimeout(() => {
    feather.replace();
  }, 0);
  
  return container;
}
