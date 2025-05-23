
import { useState } from 'react';
import { 
  Home, 
  User, 
  FileText, 
  BookOpen, 
  HelpCircle, 
  CheckSquare, 
  Layout, 
  Timer, 
  Sun, 
  Moon, 
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { theme, setTheme } = useTheme();
  const location = useLocation();

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/' },
    { icon: FileText, label: 'Question Generator', path: '/question-generator' },
    { icon: BookOpen, label: 'Answer Analyzer', path: '/answer-analyzer' },
    { icon: HelpCircle, label: 'Doubt Solver', path: '/doubt-solver' },
    { icon: CheckSquare, label: 'To Do List', path: '/todo' },
    { icon: Layout, label: 'Kanban Board', path: '/kanban' },
    { icon: Timer, label: 'Focus Mode', path: '/focus' },
  ];

  const userName = "John Doe"; // This will come from user context later
  const userInitials = userName.split(' ').map(name => name[0]).join('').slice(0, 2);

  return (
    <div className={`bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'} h-screen flex flex-col`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <span className="font-bold text-xl text-gray-900 dark:text-white">SolvynAI</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            {isCollapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link key={item.path} to={item.path}>
              <div className={`flex items-center space-x-3 p-3 rounded-lg transition-colors duration-200 ${
                isActive 
                  ? 'bg-green-500 text-white' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}>
                <Icon className="h-5 w-5" />
                {!isCollapsed && <span className="font-medium">{item.label}</span>}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className={`w-full ${isCollapsed ? 'px-2' : 'justify-start'} text-gray-700 dark:text-gray-300`}
        >
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          {!isCollapsed && <span className="ml-3">Toggle Theme</span>}
        </Button>

        {/* Profile */}
        <Link to="/profile">
          <Button
            variant="ghost"
            size="sm"
            className={`w-full ${isCollapsed ? 'px-2' : 'justify-start'} text-gray-700 dark:text-gray-300`}
          >
            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
              {userInitials}
            </div>
            {!isCollapsed && <span className="ml-3">Profile</span>}
          </Button>
        </Link>

        {/* Logout */}
        <Button
          variant="ghost"
          size="sm"
          className={`w-full ${isCollapsed ? 'px-2' : 'justify-start'} text-gray-700 dark:text-gray-300 hover:text-red-500`}
        >
          <LogOut className="h-5 w-5" />
          {!isCollapsed && <span className="ml-3">Logout</span>}
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
