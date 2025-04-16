
/**
 * API interactions for the expense tracker application
 * This simulates backend API calls using local storage
 */

// Initialize local storage with empty data structures if they don't exist
function initializeLocalStorage() {
  if (!localStorage.getItem('expense_tracker_users')) {
    localStorage.setItem('expense_tracker_users', JSON.stringify([]));
  }
  
  if (!localStorage.getItem('expense_tracker_expenses')) {
    localStorage.setItem('expense_tracker_expenses', JSON.stringify([]));
  }
}

// Initialize on page load
initializeLocalStorage();

// User API
const UserAPI = {
  // Register a new user
  register: async function(userData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const users = JSON.parse(localStorage.getItem('expense_tracker_users') || '[]');
          
          // Check if email already exists
          const existingUser = users.find(user => user.email === userData.email);
          if (existingUser) {
            reject(new Error('User with this email already exists'));
            return;
          }
          
          // Create new user
          const newUser = {
            ...userData,
            id: generateUUID(),
            annual_income: 0
          };
          
          users.push(newUser);
          localStorage.setItem('expense_tracker_users', JSON.stringify(users));
          
          // Return user without password for security
          const { password, ...userWithoutPassword } = newUser;
          resolve(newUser);
        } catch (error) {
          reject(new Error('Failed to register user'));
        }
      }, 500); // simulate network delay
    });
  },
  
  // Login a user
  login: async function(email, password) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const users = JSON.parse(localStorage.getItem('expense_tracker_users') || '[]');
          const user = users.find(u => u.email === email && u.password === password);
          
          if (user) {
            resolve(user);
          } else {
            reject(new Error('Invalid email or password'));
          }
        } catch (error) {
          reject(new Error('Failed to login'));
        }
      }, 500);
    });
  },
  
  // Get current user
  getCurrentUser: async function(userId) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const users = JSON.parse(localStorage.getItem('expense_tracker_users') || '[]');
          const user = users.find(u => u.id === userId);
          
          if (user) {
            resolve(user);
          } else {
            reject(new Error('User not found'));
          }
        } catch (error) {
          reject(new Error('Failed to get user'));
        }
      }, 500);
    });
  },
  
  // Update user's annual income
  updateIncome: async function(userId, annualIncome) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const users = JSON.parse(localStorage.getItem('expense_tracker_users') || '[]');
          const userIndex = users.findIndex(u => u.id === userId);
          
          if (userIndex !== -1) {
            users[userIndex].annual_income = annualIncome;
            localStorage.setItem('expense_tracker_users', JSON.stringify(users));
            resolve(users[userIndex]);
          } else {
            reject(new Error('User not found'));
          }
        } catch (error) {
          reject(new Error('Failed to update income'));
        }
      }, 500);
    });
  }
};

// Expense API
const ExpenseAPI = {
  // Add a new expense
  addExpense: async function(expenseData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const expenses = JSON.parse(localStorage.getItem('expense_tracker_expenses') || '[]');
          
          // Create new expense
          const newExpense = {
            ...expenseData,
            id: generateUUID()
          };
          
          expenses.push(newExpense);
          localStorage.setItem('expense_tracker_expenses', JSON.stringify(expenses));
          
          resolve(newExpense);
        } catch (error) {
          reject(new Error('Failed to add expense'));
        }
      }, 500);
    });
  },
  
  // Get all expenses for a user
  getUserExpenses: async function(userId) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const expenses = JSON.parse(localStorage.getItem('expense_tracker_expenses') || '[]');
          const userExpenses = expenses.filter(expense => expense.userId === userId);
          
          resolve(userExpenses);
        } catch (error) {
          reject(new Error('Failed to get expenses'));
        }
      }, 500);
    });
  },
  
  // Delete an expense
  deleteExpense: async function(expenseId) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const expenses = JSON.parse(localStorage.getItem('expense_tracker_expenses') || '[]');
          const updatedExpenses = expenses.filter(expense => expense.id !== expenseId);
          
          localStorage.setItem('expense_tracker_expenses', JSON.stringify(updatedExpenses));
          resolve();
        } catch (error) {
          reject(new Error('Failed to delete expense'));
        }
      }, 500);
    });
  }
};
