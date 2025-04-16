
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { addExpense } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, Receipt } from 'lucide-react';

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

const AddExpense: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError('User not authenticated');
      return;
    }
    
    if (!name || !amount || !category || !date) {
      setError('All fields are required');
      return;
    }
    
    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      await addExpense({
        userId: user.id,
        name,
        amount: amountValue,
        category,
        date,
      });
      
      // Clear the form and redirect
      setName('');
      setAmount('');
      setCategory('');
      setDate(new Date().toISOString().split('T')[0]);
      
      navigate('/expenses');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to add expense');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Add New Expense</h1>
      
      <Card>
        <CardHeader>
          <div className="flex items-center">
            <Receipt className="h-6 w-6 mr-2 text-expense" />
            <CardTitle>Expense Details</CardTitle>
          </div>
          <CardDescription>Enter the details of your expense</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-md bg-red-500/10 text-red-500">
                <AlertCircle className="h-4 w-4" />
                <p className="text-sm">{error}</p>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="name">Expense Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Grocery Shopping, Rent Payment"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="amount">Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                min="0.01"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {EXPENSE_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
            
            <div className="pt-4">
              <Button 
                type="submit" 
                className="w-full bg-expense hover:bg-expense-hover" 
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Adding Expense...' : 'Add Expense'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddExpense;
