
/**
 * Expenses page component
 */
function ExpensesPage() {
  // Get user data
  const user = Auth.state.user;
  let expenses = [];
  let filteredExpenses = [];
  
  // Create main content
  const content = createElement('div', {
    className: 'space-y-6'
  });
  
  // Page title
  const pageTitle = createElement('h1', {
    className: 'page-title'
  }, 'Expense History');
  content.appendChild(pageTitle);
  
  // Expenses card
  const expensesCard = createElement('div', {
    className: 'card'
  });
  
  // Card header with search
  const cardHeader = createElement('div', {
    className: 'card-header'
  });
  
  const headerContent = createElement('div', {
    className: 'flex flex-col md:flex-row items-center justify-between gap-4'
  }, [
    createElement('h2', {
      className: 'card-title'
    }, 'Your Expenses'),
    createElement('div', {
      className: 'relative w-full md:w-64'
    }, [
      createElement('i', { 
        className: 'feather absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground',
        'data-feather': 'search'
      }),
      createElement('input', {
        className: 'form-input pl-10',
        id: 'search-input',
        placeholder: 'Search expenses...',
        onkeyup: handleSearch
      })
    ])
  ]);
  
  cardHeader.appendChild(headerContent);
  expensesCard.appendChild(cardHeader);
  
  // Card content with table
  const cardContent = createElement('div', {
    className: 'card-content'
  });
  
  // Loading state
  const loadingDiv = createElement('div', {
    className: 'flex justify-center items-center h-64',
    id: 'loading-expenses'
  }, [
    createElement('div', {
      className: 'text-muted-foreground'
    }, 'Loading expenses...')
  ]);
  
  cardContent.appendChild(loadingDiv);
  
  // Table container (will be populated after loading)
  const tableContainer = createElement('div', {
    className: 'table-container hidden',
    id: 'expenses-table-container'
  });
  
  cardContent.appendChild(tableContainer);
  expensesCard.appendChild(cardContent);
  content.appendChild(expensesCard);
  
  // Function to handle search
  function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    
    filteredExpenses = expenses.filter(expense => 
      expense.name.toLowerCase().includes(searchTerm) ||
      expense.category.toLowerCase().includes(searchTerm)
    );
    
    renderExpensesTable(filteredExpenses);
  }
  
  // Function to delete expense
  async function handleDeleteExpense(expenseId) {
    try {
      // Find the delete button for this expense
      const deleteButton = document.querySelector(`button[data-expense-id="${expenseId}"]`);
      if (deleteButton) {
        deleteButton.disabled = true;
        const icon = deleteButton.querySelector('i');
        if (icon) {
          // Show loading state
          icon.setAttribute('data-feather', 'loader');
          feather.replace();
        }
      }
      
      // Delete the expense
      await ExpenseAPI.deleteExpense(expenseId);
      
      // Update expenses list
      expenses = expenses.filter(expense => expense.id !== expenseId);
      filteredExpenses = filteredExpenses.filter(expense => expense.id !== expenseId);
      
      // Re-render table
      renderExpensesTable(filteredExpenses);
      
      // Show success message
      showToast('Expense deleted successfully', 'success');
    } catch (error) {
      console.error('Failed to delete expense:', error);
      showToast('Failed to delete expense', 'error');
      
      // Reset delete button state
      const deleteButton = document.querySelector(`button[data-expense-id="${expenseId}"]`);
      if (deleteButton) {
        deleteButton.disabled = false;
        const icon = deleteButton.querySelector('i');
        if (icon) {
          icon.setAttribute('data-feather', 'trash-2');
          feather.replace();
        }
      }
    }
  }
  
  // Function to render expenses table
  function renderExpensesTable(expensesToRender) {
    const tableContainer = document.getElementById('expenses-table-container');
    tableContainer.innerHTML = '';
    
    // Create table
    const table = createElement('table', {});
    
    // Table caption with total
    const totalAmount = expensesToRender.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
    const tableCaption = createElement('caption', {}, `Total: ${formatCurrency(totalAmount)}`);
    table.appendChild(tableCaption);
    
    // Table header
    const tableHeader = createElement('thead', {}, [
      createElement('tr', {}, [
        createElement('th', {}, 'Name'),
        createElement('th', {}, 'Category'),
        createElement('th', {}, 'Date'),
        createElement('th', {
          style: { textAlign: 'right' }
        }, 'Amount'),
        createElement('th', {
          style: { width: '50px' }
        }, 'Actions')
      ])
    ]);
    
    table.appendChild(tableHeader);
    
    // Table body
    const tableBody = createElement('tbody', {});
    
    if (expensesToRender.length > 0) {
      // Sort expenses by date (newest first)
      expensesToRender
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .forEach(expense => {
          const row = createElement('tr', {}, [
            // Name cell
            createElement('td', {
              className: 'font-medium'
            }, expense.name),
            
            // Category cell with badge
            createElement('td', {}, [
              createElement('span', {
                className: 'badge badge-expense'
              }, expense.category)
            ]),
            
            // Date cell
            createElement('td', {}, formatDate(expense.date)),
            
            // Amount cell
            createElement('td', {
              style: { textAlign: 'right' }
            }, formatCurrency(expense.amount)),
            
            // Actions cell
            createElement('td', {}, [
              createElement('button', {
                className: 'btn btn-icon',
                'data-expense-id': expense.id,
                onclick: () => handleDeleteExpense(expense.id)
              }, [
                createElement('i', {
                  className: 'feather text-red-500',
                  'data-feather': 'trash-2'
                })
              ])
            ])
          ]);
          
          tableBody.appendChild(row);
        });
    } else {
      // Empty state
      const emptyRow = createElement('tr', {}, [
        createElement('td', {
          colSpan: 5,
          className: 'table-empty'
        }, expenses.length === 0 ? 'No expenses recorded yet' : 'No matching expenses found')
      ]);
      
      tableBody.appendChild(emptyRow);
    }
    
    table.appendChild(tableBody);
    tableContainer.appendChild(table);
    
    // Initialize feather icons
    feather.replace();
  }
  
  // Function to load expenses data
  async function loadExpenses() {
    try {
      // Fetch expenses
      expenses = await ExpenseAPI.getUserExpenses(user.id);
      filteredExpenses = [...expenses];
      
      // Hide loading, show table
      document.getElementById('loading-expenses').classList.add('hidden');
      document.getElementById('expenses-table-container').classList.remove('hidden');
      
      // Render expenses table
      renderExpensesTable(expenses);
    } catch (error) {
      console.error('Failed to load expenses:', error);
      
      // Show error state
      document.getElementById('loading-expenses').innerHTML = `
        <div class="text-center">
          <i data-feather="alert-circle" class="mb-2 text-red-500"></i>
          <p>Failed to load expenses. Please try again.</p>
        </div>
      `;
      
      feather.replace();
    }
  }
  
  // Load expenses when component mounts
  setTimeout(() => {
    loadExpenses();
  }, 0);
  
  // Wrap content in layout
  return Layout(content);
}
