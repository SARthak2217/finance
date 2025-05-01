
function LoginPage() {
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
    }, 'Sign In'),
    createElement('p', {
      className: 'card-description'
    }, 'Enter your credentials to access your account')
  ]);
  
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
      placeholder: 'Enter your password',
      required: true
    })
  ]);
  
  const submitButton = createElement('button', {
    className: 'btn btn-primary btn-block',
    id: 'login-button',
    type: 'submit'
  }, 'Sign In');
  
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
  
  const registerLink = createElement('div', {
    className: 'mt-6 text-center text-sm'
  }, [
    'Don\'t have an account? ',
    createElement('a', {
      className: 'text-primary hover:underline',
      href: '/register'
    }, 'Sign up')
  ]);
  
  const cardContent = createElement('div', {
    className: 'card-content'
  }, [form, registerLink]);
  
  card.appendChild(cardHeader);
  card.appendChild(cardContent);
  
  container.appendChild(card);
  
  async function handleSubmit(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const errorElement = document.getElementById('login-error');
    const errorMessageElement = document.getElementById('error-message');
    const loginButton = document.getElementById('login-button');
    
    if (!email || !password) {
      errorMessageElement.textContent = 'Email and password are required';
      errorElement.classList.remove('hidden');
      feather.replace();
      return;
    }
    
    errorElement.classList.add('hidden');
    
    try {
      loginButton.disabled = true;
      loginButton.innerHTML = 'Signing In...';
      
      await Auth.login(email, password);
      
      showToast('Successfully signed in', 'success');
      Router.navigate('/dashboard');
    } catch (error) {
      errorMessageElement.textContent = error.message || 'Invalid email or password';
      errorElement.classList.remove('hidden');
      feather.replace();
    } finally {
      loginButton.disabled = false;
      loginButton.innerHTML = 'Sign In';
    }
  }
  
  setTimeout(() => {
    feather.replace();
  }, 0);
  
  return container;
}
