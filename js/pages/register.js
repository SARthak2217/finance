function RegisterPage() {
  const container = createElement('div', {
    className: 'auth-container'
  });
  
  const card = createElement('div', {
    className: 'auth-card card'
  });
  
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
  
  const submitButton = createElement('button', {
    className: 'btn btn-primary btn-block',
    id: 'register-button',
    type: 'submit'
  }, 'Create Account');
  
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
  
  const loginLink = createElement('div', {
    className: 'mt-6 text-center text-sm'
  }, [
    'Already have an account? ',
    createElement('a', {
      className: 'text-primary hover:underline',
      href: '/login'
    }, 'Sign in')
  ]);
  
  const cardContent = createElement('div', {
    className: 'card-content'
  }, [form, loginLink]);
  
  card.appendChild(cardHeader);
  card.appendChild(cardContent);
  
  container.appendChild(card);
  
  async function handleSubmit(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value.trim();
    const errorElement = document.getElementById('register-error');
    const errorMessageElement = document.getElementById('error-message');
    const registerButton = document.getElementById('register-button');
    
    errorElement.classList.add('hidden');
    
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
      registerButton.disabled = true;
      registerButton.innerHTML = 'Creating Account...';
      
      await Auth.register(username, email, password);
      
      showToast('Account created successfully', 'success');
      Router.navigate('/dashboard');
    } catch (error) {
      errorMessageElement.textContent = error.message || 'Registration failed';
      errorElement.classList.remove('hidden');
      feather.replace();
    } finally {
      registerButton.disabled = false;
      registerButton.innerHTML = 'Create Account';
    }
  }
  
  setTimeout(() => {
    feather.replace();
  }, 0);
  
  return container;
}
