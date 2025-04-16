
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, PieChart, Plus, LogOut, Menu, X } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Close sidebar when route changes (mobile)
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isAuthenticated) {
    return <>{children}</>;
  }
  
  // Check if a route is active
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      {/* Mobile sidebar toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-sidebar border-r border-sidebar-border transition-transform duration-300 ease-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-sidebar-border">
            <h1 className="text-2xl font-bold text-gradient">Cash Control</h1>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            <Link 
              to="/dashboard" 
              className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 group ${
                isActive('/dashboard') 
                  ? 'bg-sidebar-accent text-primary' 
                  : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
              }`}
            >
              <Home className={`mr-3 h-5 w-5 transition-all ${isActive('/dashboard') ? 'text-primary' : 'group-hover:text-primary'}`} />
              <span>Dashboard</span>
              {isActive('/dashboard') && (
                <span className="ml-auto w-1.5 h-5 bg-primary rounded-full" />
              )}
            </Link>
            
            <Link 
              to="/expenses" 
              className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 group ${
                isActive('/expenses') 
                  ? 'bg-sidebar-accent text-primary' 
                  : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
              }`}
            >
              <PieChart className={`mr-3 h-5 w-5 transition-all ${isActive('/expenses') ? 'text-primary' : 'group-hover:text-primary'}`} />
              <span>Expenses</span>
              {isActive('/expenses') && (
                <span className="ml-auto w-1.5 h-5 bg-primary rounded-full" />
              )}
            </Link>
            
            <Link 
              to="/add-expense" 
              className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 group ${
                isActive('/add-expense') 
                  ? 'bg-sidebar-accent text-primary' 
                  : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
              }`}
            >
              <Plus className={`mr-3 h-5 w-5 transition-all ${isActive('/add-expense') ? 'text-primary' : 'group-hover:text-primary'}`} />
              <span>Add Expense</span>
              {isActive('/add-expense') && (
                <span className="ml-auto w-1.5 h-5 bg-primary rounded-full" />
              )}
            </Link>
          </nav>

          <div className="p-4 border-t border-sidebar-border">
            {user && (
              <div className="flex items-center mb-4 p-3 rounded-lg bg-sidebar-accent/50">
                <div className="h-9 w-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium">
                  {user.name?.[0] || user.email?.[0] || 'U'}
                </div>
                <div className="ml-3 overflow-hidden">
                  <p className="text-sm font-medium text-sidebar-foreground truncate">
                    {user.name || user.email}
                  </p>
                  {user.name && (
                    <p className="text-xs text-sidebar-foreground/60 truncate">
                      {user.email}
                    </p>
                  )}
                </div>
              </div>
            )}
            
            <Button 
              variant="outline" 
              className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-primary border-sidebar-border"
              onClick={handleLogout}
            >
              <LogOut className="mr-3 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 transition-all duration-300 md:ml-64">
        <div className="container mx-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
