function DashboardPage() {
  // Get user data
  const user = Auth.state.user;
  let expenses = [];
  let monthlyIncome = 0;
  let totalExpenses = 0;
  
  // Create main content
  const content = createElement('div', {
    className: 'space-y-8'
  });
  
  // Page title
  const pageTitle = createElement('h1', {
    className: 'page-title'
  }, 'Financial Dashboard');
  content.appendChild(pageTitle);
  
  // Income section
  const incomeCard = createElement('div', {
    className: 'card glass-card income-form'
  });
  
  const incomeCardHeader = createElement('div', {
    className: 'card-header'
  }, [
    createElement('div', {
      className: 'card-title'
    }, [
      createElement('i', { 
        className: 'feather',
        'data-feather': 'indian-rupee'
      }),
      'Annual Income'
    ]),
    createElement('p', {
      className: 'card-description'
    }, 'Update your annual income to calculate monthly budget')
  ]);
  
  const incomeForm = createElement('div', {
    className: 'flex flex-col md:flex-row gap-4 items-end'
  }, [
    createElement('div', {
      className: 'flex-1'
    }, [
      createElement('div', {
        className: 'mb-2 text-sm font-medium'
      }, 'Annual Income (₹)'),
      createElement('input', {
        className: 'form-input',
        id: 'annual-income',
        type: 'number',
        value: user.annual_income || 0,
        min: 0,
        step: 100
      })
    ]),
    createElement('button', {
      className: 'btn btn-expense',
      id: 'update-income-btn',
      onclick: handleUpdateIncome
    }, 'Update Income')
  ]);
  
  const incomeCardContent = createElement('div', {
    className: 'card-content'
  }, [incomeForm]);
  
  incomeCard.appendChild(incomeCardHeader);
  incomeCard.appendChild(incomeCardContent);
  content.appendChild(incomeCard);
  
  // Financial overview cards container
  const statsGrid = createElement('div', {
    className: 'grid grid-cols-3'
  });
  content.appendChild(statsGrid);
  
  // Monthly Income card
  const monthlyIncomeCard = createElement('div', {
    className: 'card stat-card hover-lift'
  });
  
  const monthlyIncomeHeader = createElement('div', {
    className: 'card-header pb-2'
  }, [
    createElement('div', {
      className: 'stat-label'
    }, 'Monthly Income'),
    createElement('div', {
      className: 'stat-value',
      id: 'monthly-income-value'
    }, [
      createElement('i', { 
        className: 'feather mr-2 text-expense',
        'data-feather': 'indian-rupee'
      }),
      formatCurrency(0)
    ])
  ]);
  
  const monthlyIncomeContent = createElement('div', {
    className: 'card-content'
  }, [
    createElement('div', {
      className: 'text-xs text-muted-foreground',
      id: 'annual-income-text'
    }, `Based on annual income of ₹0.00`)
  ]);
  
  monthlyIncomeCard.appendChild(monthlyIncomeHeader);
  monthlyIncomeCard.appendChild(monthlyIncomeContent);
  statsGrid.appendChild(monthlyIncomeCard);
  
  // Monthly Expenses card
  const expensesCard = createElement('div', {
    className: 'card stat-card hover-lift'
  });
  
  const expensesHeader = createElement('div', {
    className: 'card-header pb-2'
  }, [
    createElement('div', {
      className: 'stat-label'
    }, 'Monthly Expenses'),
    createElement('div', {
      className: 'stat-value',
      id: 'expenses-value'
    }, [
      createElement('i', { 
        className: 'feather mr-2 text-red-500',
        'data-feather': 'arrow-down-right'
      }),
      formatCurrency(0)
    ])
  ]);
  
  const expensesContent = createElement('div', {
    className: 'card-content'
  }, [
    createElement('div', {
      className: 'text-xs text-muted-foreground',
      id: 'expense-count'
    }, '0 expense entries')
  ]);
  
  expensesCard.appendChild(expensesHeader);
  expensesCard.appendChild(expensesContent);
  statsGrid.appendChild(expensesCard);
  
  // Monthly Savings card
  const savingsCard = createElement('div', {
    className: 'card stat-card hover-lift'
  });
  
  const savingsHeader = createElement('div', {
    className: 'card-header pb-2'
  }, [
    createElement('div', {
      className: 'stat-label'
    }, 'Monthly Savings'),
    createElement('div', {
      className: 'stat-value',
      id: 'savings-value'
    }, [
      createElement('i', { 
        className: 'feather mr-2 text-green-500',
        'data-feather': 'arrow-up-right'
      }),
      formatCurrency(0)
    ])
  ]);
  
  const savingsContent = createElement('div', {
    className: 'card-content'
  }, [
    createElement('div', {
      className: 'text-xs text-muted-foreground',
      id: 'savings-status'
    }, 'Calculating savings...')
  ]);
  
  savingsCard.appendChild(savingsHeader);
  savingsCard.appendChild(savingsContent);
  statsGrid.appendChild(savingsCard);
  
  // Function to calculate and update financial stats
  async function updateFinancialStats() {
    try {
      // Get user expenses
      expenses = await ExpenseAPI.getUserExpenses(user.id);
      
      // Calculate financial data
      const annualIncome = user.annual_income || 0;
      monthlyIncome = annualIncome / 12;
      totalExpenses = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
      const monthlySavings = monthlyIncome - totalExpenses;
      
      // Update monthly income
      document.getElementById('monthly-income-value').innerHTML = `
        <i class="feather mr-2 text-expense" data-feather="indian-rupee"></i>
        ₹ ${formatCurrency(monthlyIncome)}
      `;
      
      document.getElementById('annual-income-text').textContent = 
        `Based on annual income of ₹ ${formatCurrency(annualIncome)}`;
      
      // Update expenses
      document.getElementById('expenses-value').innerHTML = `
        <i class="feather mr-2 text-red-500" data-feather="arrow-down-right"></i>
        ₹ ${formatCurrency(totalExpenses)}
      `;
      
      document.getElementById('expense-count').textContent = 
        `${expenses.length} expense entries`;
      
      // Update savings
      const savingsIcon = monthlySavings >= 0 ? 'arrow-up-right' : 'arrow-down-right';
      const savingsColor = monthlySavings >= 0 ? 'text-green-500' : 'text-red-500';
      
      document.getElementById('savings-value').innerHTML = `
        <i class="feather mr-2 ${savingsColor}" data-feather="${savingsIcon}"></i>
        ₹ ${formatCurrency(Math.abs(monthlySavings))}
      `;
      
      document.getElementById('savings-status').textContent = 
        monthlySavings >= 0 ? 'Positive savings' : 'Overspending';
      
      // Refresh icons
      feather.replace();
      
    } catch (error) {
      console.error('Failed to update financial stats:', error);
      showToast('Failed to load expense data', 'error');
    }
  }
  
  // Handle income update
  async function handleUpdateIncome() {
    const incomeInput = document.getElementById('annual-income');
    const newIncome = parseFloat(incomeInput.value);
    
    if (isNaN(newIncome) || newIncome < 0) {
      showToast('Please enter a valid income amount', 'error');
      return;
    }
    
    // Skip if income hasn't changed
    if (newIncome === user.annual_income) {
      return;
    }
    
    const updateButton = document.getElementById('update-income-btn');
    
    try {
      // Show loading state
      updateButton.disabled = true;
      updateButton.textContent = 'Updating...';
      
      // Update income
      await Auth.updateIncome(newIncome);
      
      // Update UI
      updateFinancialStats();
      showToast('Income updated successfully', 'success');
    } catch (error) {
      console.error('Failed to update income:', error);
      showToast('Failed to update income', 'error');
    } finally {
      // Reset button state
      updateButton.disabled = false;
      updateButton.textContent = 'Update Income';
    }
  }
  
  // Load page data when component loads
  setTimeout(async () => {
    await updateFinancialStats();
  }, 0);
  
  // Wrap content in layout
  return Layout(content);
}
