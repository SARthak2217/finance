
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getUserExpenses, deleteExpense } from '@/lib/api';
import { Expense } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Trash2, Search } from 'lucide-react';
import { format } from 'date-fns';

const Expenses: React.FC = () => {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    const fetchExpenses = async () => {
      if (!user) return;
      
      try {
        const data = await getUserExpenses(user.id);
        // Sort expenses by date (newest first)
        data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setExpenses(data);
      } catch (error) {
        console.error("Failed to fetch expenses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, [user]);

  const handleDelete = async (expenseId: string) => {
    try {
      setDeleting(expenseId);
      await deleteExpense(expenseId);
      setExpenses(expenses.filter(expense => expense.id !== expenseId));
    } catch (error) {
      console.error("Failed to delete expense:", error);
    } finally {
      setDeleting(null);
    }
  };

  // Filter expenses based on search term
  const filteredExpenses = expenses.filter(expense => 
    expense.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expense.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate total expenses
  const totalAmount = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Expense History</h1>
      
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <CardTitle>Your Expenses</CardTitle>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search expenses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-muted-foreground">Loading expenses...</div>
            </div>
          ) : (
            <div>
              <Table>
                <TableCaption>Total: ${totalAmount.toFixed(2)}</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="w-[50px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredExpenses.length > 0 ? (
                    filteredExpenses.map((expense) => (
                      <TableRow key={expense.id}>
                        <TableCell className="font-medium">{expense.name}</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-expense/10 text-expense">
                            {expense.category}
                          </span>
                        </TableCell>
                        <TableCell>{format(new Date(expense.date), 'MMM dd, yyyy')}</TableCell>
                        <TableCell className="text-right">${expense.amount.toFixed(2)}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(expense.id)}
                            disabled={deleting === expense.id}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        {expenses.length === 0 ? "No expenses recorded yet" : "No matching expenses found"}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Expenses;
