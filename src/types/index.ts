
export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  annual_income: number;
}

export interface Expense {
  id: string;
  userId: string;
  name: string;
  amount: number;
  category: string;
  date: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}
