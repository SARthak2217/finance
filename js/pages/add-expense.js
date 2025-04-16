
/**
 * Add Expense page component
 */
function AddExpensePage() {
  // Get user data
  const user = Auth.state.user;
  
  // Define expense categories
  const EXPENSE_CATEGORIES = [
    'Food', 
    'Housing', 
    'Transportation', 
    'Entertainment', 
    'Utilities', 
    'Healthcare', 
    'Education', 
    'Shopping', 
    'Personal Care', 
    'Other'
  ];
  
  // Create main content
  const content = createElement('div', {});
  
  // Page title
  const pageTitle = createElement('h1', {
    className: 'page-title'
  }, 'Add New Expense');
  content.appendChild(pageTitle);
  
  // Expense form card
  const formCard = createElement('div', {
    className: 'card'
  });
  
  // Card header
  const cardHeader = createElement('div', {
    className: 'card-header'
  }, [
    createElement('div', {
      className: 'flex items-center'
    }, [
      createElement('i', {
        className: 'feather mr-2 text-expense',
        'data-feather': 'file-text'
      }),
      createElement('h2', {
        className: 'card-title'
      }, 'Expense Details')
    ]),
    createElement('p', {
      className: 'card-description'
    }, 'Enter the details of your expense')
  ]);
  
  // Error message (hidden by default)
  const errorAlert = createElement('div', {
    className: 'alert alert-error hidden',
    id: 'expense-error'
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
  
  // Expense name field
  const nameGroup = createElement('div', {
    className: 'form-group'
  }, [
    createElement('label', {
      className: 'form-label',
      for: 'expense-name'
    }, 'Expense Name'),
    createElement('input', {
      className: 'form-input',
      id: 'expense-name',
      type: 'text',
      placeholder: 'e.g., Grocery Shopping, Rent Payment',
      required: true
    })
  ]);
  
  // Amount field
  const amountGroup = createElement('div', {
    className: 'form-group'
  }, [
    createElement('label', {
      className: 'form-label',
      for: 'expense-amount'
    }, 'Amount ($)'),
    createElement('input', {
      className: 'form-input',
      id: 'expense-amount',
      type: 'number',
      step: '0.01',
      placeholder: '0.00',
      min: '0.01',
      required: true
    })
  ]);
  
  // Category field
  const categoryGroup = createElement('div', {
    className: 'form-group'
  }, [
    createElement('label', {
      className: 'form-label',
      for: 'expense-category'
    }, 'Category'),
    createElement('select', {
      className: 'form-select',
      id: 'expense-category',
      required: true
    }, [
      createElement('option', {
        value: '',
        disabled: true,
        selected: true
      }, 'Select category'),
      ...EXPENSE_CATEGORIES.map(category => 
        createElement('option', {
          value: category
        }, category)
      )
    ])
  ]);
  
  // Date field
  const dateGroup = createElement('div', {
    className: 'form-group'
  }, [
    createElement('label', {
      className: 'form-label',
      for: 'expense-date'
    }, 'Date'),
    createElement('input', {
      className: 'form-input',
      id: 'expense-date',
      type: 'date',
      value: new Date().toISOString().split('T')[0],
      max: new Date().toISOString().split('T')[0],
      required: true
    })
  ]);
  
  // Submit button
  const submitButtonContainer = createElement('div', {
    className: 'pt-4'
  }, [
    createElement('button', {
      className: 'btn btn-expense btn-block',
      id: 'add-expense-btn',
      type: 'submit'
    }, 'Add Expense')
  ]);
  
  // Form element
  const form = createElement('form', {
    className: 'space-y-4',
    id: 'expense-form',
    onsubmit: handleSubmit
  }, [
    errorAlert,
    nameGroup,
    amountGroup,
    categoryGroup,
    dateGroup,
    submitButtonContainer
  ]);
  
  // Card content
  const cardContent = createElement('div', {
    className: 'card-content'
  }, [form]);
  
  // Append card parts
  formCard.appendChild(cardHeader);
  formCard.appendChild(cardContent);
  content.appendChild(formCard);
  
  // Form submission handler
  async function handleSubmit(e) {
    e.preventDefault();
    
    // Get form values
    const name = document.getElementById('expense-name').value.trim();
    const amountStr = document.getElementById('expense-amount').value.trim();
    const category = document.getElementById('expense-category').value;
    const date = document.getElementById('expense-date').value;
    
    const errorElement = document.getElementById('expense-error');
    const errorMessageElement = document.getElementById('error-message');
    const submitButton = document.getElementById('add-expense-btn');
    
    // Validate user is logged in
    if (!user) {
      errorMessageElement.textContent = 'User not authenticated';
      errorElement.classList.remove('hidden');
      feather.replace();
      return;
    }
    
    // Validate all fields are present
    if (!name || !amountStr || !category || !date) {
      errorMessageElement.textContent = 'All fields are required';
      errorElement.classList.remove('hidden');
      feather.replace();
      return;
    }
    
    // Validate amount is a positive number
    const amount = parseFloat(amountStr);
    if (isNaN(amount) || amount <= 0) {
      errorMessageElement.textContent = 'Please enter a valid amount';
      errorElement.classList.remove('hidden');
      feather.replace();
      return;
    }
    
    // Hide previous errors
    errorElement.classList.add('hidden');
    
    try {
      // Show loading state
      submitButton.disabled = true;
      submitButton.textContent = 'Adding Expense...';
      
      // Submit expense
      await ExpenseAPI.addExpense({
        userId: user.id,
        name,
        amount,
        category,
        date
      });
      
      // Reset form
      document.getElementById('expense-form').reset();
      document.getElementById('expense-date').value = new Date().toISOString().split('T')[0];
      
      // Show success message
      showToast('Expense added successfully', 'success');
      
      // Navigate to expenses page
      Router.navigate('/expenses');
    } catch (error) {
      // Show error message
      errorMessageElement.textContent = error.message || 'Failed to add expense';
      errorElement.classList.remove('hidden');
      feather.replace();
    } finally {
      // Reset button state
      submitButton.disabled = false;
      submitButton.textContent = 'Add Expense';
    }
  }
  
  // Initialize feather icons
  setTimeout(() => {
    feather.replace();
  }, 0);
  
  // Wrap content in layout
  return Layout(content);
}
