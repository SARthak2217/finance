
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { ArrowRight, Github } from 'lucide-react';

const Index = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background bg-gradient-to-br from-background via-background/95 to-background/90">
      <div className="mx-auto max-w-4xl text-center px-6 py-12 relative">
        <div className="absolute inset-0 bg-secondary/20 rounded-3xl blur-3xl opacity-20 -z-10"></div>
        <h1 className="text-5xl md:text-6xl font-bold mb-8 tracking-tight bg-gradient-to-r from-primary via-primary/90 to-primary/80 bg-clip-text text-transparent">
          Cash Control Haven
        </h1>
        <p className="text-xl md:text-2xl mb-10 text-foreground/80 leading-relaxed max-w-3xl mx-auto">
          Take control of your finances with our simple yet powerful expense tracking application.
          Visualize your spending habits, set budgets, and achieve your financial goals.
        </p>
        <div className="flex flex-wrap gap-5 justify-center mb-16">
          <Button 
            onClick={() => navigate('/register')}
            size="lg"
            className="bg-expense hover:bg-expense-hover text-primary-foreground shadow-lg shadow-expense/20 hover:shadow-expense/30 transition-all duration-300 px-6 py-6 text-lg h-auto"
          >
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button 
            onClick={() => navigate('/login')}
            variant="outline"
            size="lg"
            className="border-accent hover:bg-accent/10 px-6 py-6 text-lg h-auto"
          >
            Login to Your Account
          </Button>
          <Button 
            variant="secondary"
            size="lg"
            onClick={() => window.open('https://github.com/yourusername/cash-control-haven', '_blank')}
            className="px-6 py-6 text-lg h-auto"
          >
            <Github className="mr-2 h-5 w-5" />
            Download Project
          </Button>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          <div className="p-8 rounded-xl bg-gradient-to-br from-secondary/80 to-secondary/40 backdrop-blur-sm shadow-xl border border-secondary/80 transform transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
            <div className="h-14 w-14 bg-expense/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-expense">
                <path d="M16 6h6"></path>
                <path d="M21 12H6"></path>
                <path d="M12 18H3"></path>
                <path d="M16 6l-4 6 4 6"></path>
              </svg>
            </div>
            <h2 className="text-xl font-bold mb-3 text-primary">Track Expenses</h2>
            <p className="text-muted-foreground">Easily log and categorize your daily expenses in one secure place</p>
          </div>
          <div className="p-8 rounded-xl bg-gradient-to-br from-secondary/80 to-secondary/40 backdrop-blur-sm shadow-xl border border-secondary/80 transform transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
            <div className="h-14 w-14 bg-expense/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-expense">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 6v6l4 2"></path>
              </svg>
            </div>
            <h2 className="text-xl font-bold mb-3 text-primary">Visualize Data</h2>
            <p className="text-muted-foreground">See where your money goes with beautiful charts and insights</p>
          </div>
          <div className="p-8 rounded-xl bg-gradient-to-br from-secondary/80 to-secondary/40 backdrop-blur-sm shadow-xl border border-secondary/80 transform transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
            <div className="h-14 w-14 bg-expense/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-expense">
                <path d="M12 2v20"></path>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
              </svg>
            </div>
            <h2 className="text-xl font-bold mb-3 text-primary">Save More</h2>
            <p className="text-muted-foreground">Identify spending patterns and find opportunities to increase savings</p>
          </div>
        </div>
        <footer className="mt-20 text-muted-foreground/60 text-sm">
          © {new Date().getFullYear()} Cash Control Haven. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default Index;
