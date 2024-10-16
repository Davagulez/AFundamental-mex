"use client"

import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import { Sun, Moon, ChevronLeft, ChevronRight, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

interface TopBarProps {
  isSidebarExpanded: boolean;
  toggleSidebar: () => void;
}

export function TopBar({ isSidebarExpanded, toggleSidebar }: TopBarProps) {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const { logout } = useAuth();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="flex justify-between items-center p-4 bg-secondary">
      <Button onClick={toggleSidebar} variant="outline" size="icon">
        {isSidebarExpanded ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </Button>
      <div>
        <Button onClick={toggleTheme} variant="outline" size="icon" className="mr-2">
          {theme === 'dark' ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
        </Button>
        <Button onClick={handleLogout} variant="outline" size="icon">
          <LogOut className="h-[1.2rem] w-[1.2rem]" />
        </Button>
      </div>
    </div>
  );
}