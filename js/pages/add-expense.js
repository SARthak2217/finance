function AddExpensePage() {
  const user = Auth.state.user;
  
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
  
  const content = createElement('div', {});
  
  const pageTitle = createElement('h1', {
    className: 'page-title'
  }, 'Add New Expense');
  content.appendChild(pageTitle);
  
  const formCard = createElement('div', {
    className: 'card'
  });
  
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
  
  const submitButtonContainer = createElement('div', {
    className: 'pt-4'
  }, [
    createElement('button', {
      className: 'btn btn-expense btn-block',
      id: 'add-expense-btn',
      type: 'submit'
    }, 'Add Expense')
  ]);
  
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
  
  const cardContent = createElement('div', {
    className: 'card-content'
  }, [form]);
  
  formCard.appendChild(cardHeader);
  formCard.appendChild(cardContent);
  content.appendChild(formCard);
  
  async function handleSubmit(e) {
    e.preventDefault();
    
    const name = document.getElementById('expense-name').value.trim();
    const amountStr = document.getElementById('expense-amount').value.trim();
    const category = document.getElementById('expense-category').value;
    const date = document.getElementById('expense-date').value;
    
    const errorElement = document.getElementById('expense-error');
    const errorMessageElement = document.getElementById('error-message');
    const submitButton = document.getElementById('add-expense-btn');
    
    if (!user) {
      errorMessageElement.textContent = 'User not authenticated';
      errorElement.classList.remove('hidden');
      feather.replace();
      return;
    }
    
    if (!name || !amountStr || !category || !date) {
      errorMessageElement.textContent = 'All fields are required';
      errorElement.classList.remove('hidden');
      feather.replace();
      return;
    }
    
    const amount = parseFloat(amountStr);
    if (isNaN(amount) || amount <= 0) {
      errorMessageElement.textContent = 'Please enter a valid amount';
      errorElement.classList.remove('hidden');
      feather.replace();
      return;
    }
    
    errorElement.classList.add('hidden');
    
    try {
      submitButton.disabled = true;
      submitButton.textContent = 'Adding Expense...';
      
      await ExpenseAPI.addExpense({
        userId: user.id,
        name,
        amount,
        category,
        date
      });
      
      document.getElementById('expense-form').reset();
      document.getElementById('expense-date').value = new Date().toISOString().split('T')[0];
      
      showToast('Expense added successfully', 'success');
      
      Router.navigate('/expenses');
    } catch (error) {
      errorMessageElement.textContent = error.message || 'Failed to add expense';
      errorElement.classList.remove('hidden');
      feather.replace();
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = 'Add Expense';
    }
  }
  
  setTimeout(() => {
    feather.replace();
  }, 0);
  
  return Layout(content);
}
