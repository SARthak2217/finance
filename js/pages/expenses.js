function ExpensesPage() {
  const user = Auth.state.user;
  let expenses = [];
  let filteredExpenses = [];
  
  const content = createElement('div', {
    className: 'space-y-6'
  });
  
  const pageTitle = createElement('h1', {
    className: 'page-title'
  }, 'Expense History');
  content.appendChild(pageTitle);
  
  const expensesCard = createElement('div', {
    className: 'card'
  });
  
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
  
  const cardContent = createElement('div', {
    className: 'card-content'
  });
  
  const loadingDiv = createElement('div', {
    className: 'flex justify-center items-center h-64',
    id: 'loading-expenses'
  }, [
    createElement('div', {
      className: 'text-muted-foreground'
    }, 'Loading expenses...')
  ]);
  
  cardContent.appendChild(loadingDiv);
  
  const tableContainer = createElement('div', {
    className: 'table-container hidden',
    id: 'expenses-table-container'
  });
  
  cardContent.appendChild(tableContainer);
  expensesCard.appendChild(cardContent);
  content.appendChild(expensesCard);
  
  function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    
    filteredExpenses = expenses.filter(expense => 
      expense.name.toLowerCase().includes(searchTerm) ||
      expense.category.toLowerCase().includes(searchTerm)
    );
    
    renderExpensesTable(filteredExpenses);
  }
  
  async function handleDeleteExpense(expenseId) {
    try {
      const deleteButton = document.querySelector(`button[data-expense-id="${expenseId}"]`);
      if (deleteButton) {
        deleteButton.disabled = true;
        const icon = deleteButton.querySelector('i');
        if (icon) {
          icon.setAttribute('data-feather', 'loader');
          feather.replace();
        }
      }
      
      await ExpenseAPI.deleteExpense(expenseId);
      
      expenses = expenses.filter(expense => expense.id !== expenseId);
      filteredExpenses = filteredExpenses.filter(expense => expense.id !== expenseId);
      
      renderExpensesTable(filteredExpenses);
      
      showToast('Expense deleted successfully', 'success');
    } catch (error) {
      console.error('Failed to delete expense:', error);
      showToast('Failed to delete expense', 'error');
      
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
  
  function renderExpensesTable(expensesToRender) {
    const tableContainer = document.getElementById('expenses-table-container');
    tableContainer.innerHTML = '';
    
    const table = createElement('table', {});
    
    const totalAmount = expensesToRender.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
    const tableCaption = createElement('caption', {}, `Total: ${formatCurrency(totalAmount)}`);
    table.appendChild(tableCaption);
    
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
    
    const tableBody = createElement('tbody', {});
    
    if (expensesToRender.length > 0) {
      expensesToRender
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .forEach(expense => {
          const row = createElement('tr', {}, [
            
            createElement('td', {
              className: 'font-medium'
            }, expense.name),
            
            
            createElement('td', {}, [
              createElement('span', {
                className: 'badge badge-expense'
              }, expense.category)
            ]),
            
            createElement('td', {}, formatDate(expense.date)),
            
            createElement('td', {
              style: { textAlign: 'right' }
            }, formatCurrency(expense.amount)),
            
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
    
    feather.replace();
  }
  
  async function loadExpenses() {
    try {
      expenses = await ExpenseAPI.getUserExpenses(user.id);
      filteredExpenses = [...expenses];
      
      document.getElementById('loading-expenses').classList.add('hidden');
      document.getElementById('expenses-table-container').classList.remove('hidden');
      
      renderExpensesTable(expenses);
    } catch (error) {
      console.error('Failed to load expenses:', error);
      
      document.getElementById('loading-expenses').innerHTML = `
        <div class="text-center">
          <i data-feather="alert-circle" class="mb-2 text-red-500"></i>
          <p>Failed to load expenses. Please try again.</p>
        </div>
      `;
      
      feather.replace();
    }
  }
  
  setTimeout(() => {
    loadExpenses();
  }, 0);
  
  return Layout(content);
}
