
import { User, Expense } from '../types';

// Simulate API calls to a local JSON file
// In a real application, these would be actual API calls to the server

// Local storage keys
const USERS_KEY = 'expense_tracker_users';
const EXPENSES_KEY = 'expense_tracker_expenses';

// Initialize local storage with empty arrays if not present
if (!localStorage.getItem(USERS_KEY)) {
  localStorage.setItem(USERS_KEY, JSON.stringify([]));
}

if (!localStorage.getItem(EXPENSES_KEY)) {
  localStorage.setItem(EXPENSES_KEY, JSON.stringify([]));
}

// User API functions
export const registerUser = async (userData: Omit<User, 'id' | 'annual_income'>): Promise<User> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
        
        // Check if email already exists
        const existingUser = users.find((user: User) => user.email === userData.email);
        if (existingUser) {
          reject(new Error('User with this email already exists'));
          return;
        }
        
        // Create new user
        const newUser: User = {
          ...userData,
          id: Date.now().toString(),
          annual_income: 0,
        };
        
        users.push(newUser);
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
        
        // Remove password before returning user data
        const { password, ...userWithoutPassword } = newUser;
        resolve(newUser);
      } catch (error) {
        reject(new Error('Failed to register user'));
      }
    }, 500); // simulate network delay
  });
};

export const loginUser = async (email: string, password: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
        const user = users.find((u: User) => u.email === email && u.password === password);
        
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
};

export const updateUserIncome = async (userId: string, annualIncome: number): Promise<User> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
        const userIndex = users.findIndex((u: User) => u.id === userId);
        
        if (userIndex !== -1) {
          users[userIndex].annual_income = annualIncome;
          localStorage.setItem(USERS_KEY, JSON.stringify(users));
          resolve(users[userIndex]);
        } else {
          reject(new Error('User not found'));
        }
      } catch (error) {
        reject(new Error('Failed to update income'));
      }
    }, 500);
  });
};

export const getCurrentUser = async (userId: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
        const user = users.find((u: User) => u.id === userId);
        
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
};

// Expense API functions
export const addExpense = async (expenseData: Omit<Expense, 'id'>): Promise<Expense> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const expenses = JSON.parse(localStorage.getItem(EXPENSES_KEY) || '[]');
        
        // Create new expense
        const newExpense: Expense = {
          ...expenseData,
          id: Date.now().toString(),
        };
        
        expenses.push(newExpense);
        localStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses));
        
        resolve(newExpense);
      } catch (error) {
        reject(new Error('Failed to add expense'));
      }
    }, 500);
  });
};

export const getUserExpenses = async (userId: string): Promise<Expense[]> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const expenses = JSON.parse(localStorage.getItem(EXPENSES_KEY) || '[]');
        const userExpenses = expenses.filter((expense: Expense) => expense.userId === userId);
        
        resolve(userExpenses);
      } catch (error) {
        reject(new Error('Failed to get expenses'));
      }
    }, 500);
  });
};

export const deleteExpense = async (expenseId: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const expenses = JSON.parse(localStorage.getItem(EXPENSES_KEY) || '[]');
        const updatedExpenses = expenses.filter((expense: Expense) => expense.id !== expenseId);
        
        localStorage.setItem(EXPENSES_KEY, JSON.stringify(updatedExpenses));
        resolve();
      } catch (error) {
        reject(new Error('Failed to delete expense'));
      }
    }, 500);
  });
};
