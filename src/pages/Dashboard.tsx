
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getUserExpenses } from '@/lib/api';
import { Expense } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowUpRight, ArrowDownRight, DollarSign, PiggyBank } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const Dashboard: React.FC = () => {
  const { user, updateIncome } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [newAnnualIncome, setNewAnnualIncome] = useState(user?.annual_income || 0);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchExpenses = async () => {
      if (!user) return;
      
      try {
        const data = await getUserExpenses(user.id);
        setExpenses(data);
      } catch (error) {
        console.error("Failed to fetch expenses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, [user]);

  const handleUpdateIncome = async () => {
    if (!user) return;
    
    try {
      setUpdating(true);
      await updateIncome(newAnnualIncome);
    } catch (error) {
      console.error("Failed to update income:", error);
    } finally {
      setUpdating(false);
    }
  };

  // Calculate financial data
  const annualIncome = user?.annual_income || 0;
  const monthlyIncome = annualIncome / 12;
  
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const monthlySavings = monthlyIncome - totalExpenses;

  // Prepare chart data
  const categoryTotals: Record<string, number> = {};
  expenses.forEach(expense => {
    categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
  });

  const chartData = Object.keys(categoryTotals).map(category => ({
    name: category,
    value: categoryTotals[category]
  }));

  const COLORS = ['#9b87f5', '#7E69AB', '#6E59A5', '#D6BCFA', '#1EAEDB', '#33C3F0'];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Financial Dashboard</h1>
      
      {/* Income Section */}
      <Card className="bg-gradient-to-br from-secondary to-secondary/70 border-none">
        <CardHeader>
          <CardTitle>Annual Income</CardTitle>
          <CardDescription>Update your annual income to calculate monthly budget</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <div className="mb-2 text-sm font-medium">Annual Income ($)</div>
              <Input
                type="number"
                value={newAnnualIncome}
                onChange={(e) => setNewAnnualIncome(Number(e.target.value))}
                className="bg-background/50"
              />
            </div>
            <Button 
              onClick={handleUpdateIncome} 
              disabled={updating || newAnnualIncome === user?.annual_income}
              className="bg-expense hover:bg-expense-hover"
            >
              {updating ? 'Updating...' : 'Update Income'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Financial Overview Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-gradient-to-br from-secondary/80 to-secondary/50 border-none">
          <CardHeader className="pb-2">
            <CardDescription>Monthly Income</CardDescription>
            <CardTitle className="text-2xl flex items-center">
              <DollarSign className="h-5 w-5 mr-1 text-expense" />
              ${monthlyIncome.toFixed(2)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              Based on annual income of ${annualIncome.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-secondary/80 to-secondary/50 border-none">
          <CardHeader className="pb-2">
            <CardDescription>Monthly Expenses</CardDescription>
            <CardTitle className="text-2xl flex items-center">
              <ArrowDownRight className="h-5 w-5 mr-1 text-red-500" />
              ${totalExpenses.toFixed(2)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              {expenses.length} expense entries
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-secondary/80 to-secondary/50 border-none">
          <CardHeader className="pb-2">
            <CardDescription>Monthly Savings</CardDescription>
            <CardTitle className={`text-2xl flex items-center ${monthlySavings >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {monthlySavings >= 0 ? (
                <ArrowUpRight className="h-5 w-5 mr-1 text-green-500" />
              ) : (
                <ArrowDownRight className="h-5 w-5 mr-1 text-red-500" />
              )}
              ${Math.abs(monthlySavings).toFixed(2)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              {monthlySavings >= 0 ? 'Positive savings' : 'Overspending'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Expense Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Expense Breakdown</CardTitle>
          <CardDescription>Expenses by category</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-muted-foreground">Loading...</div>
            </div>
          ) : expenses.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [`$${value.toFixed(2)}`, 'Amount']} 
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
              <PiggyBank className="h-12 w-12 mb-2 text-expense/50" />
              <p>No expenses recorded yet</p>
              <p className="text-sm">Start adding expenses to see your spending breakdown</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
