"use client";

import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import { Sun, Moon, Menu, Plus, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

interface TopBarProps {
  isSidebarExpanded: boolean;
  toggleSidebar: () => void;
  onNewRecord: () => void;
}

export function TopBar({ isSidebarExpanded, toggleSidebar, onNewRecord }: TopBarProps) {
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

  // Determinar el estilo de los botones según el tema
  const buttonVariant = theme === 'dark' ? 'outline' : 'secondary';
  // const buttonVariant = 'secondary';

  return (
    <div className="bg-background border-b p-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        {/* Renderizar condicionalmente el botón Plus basado en el estado del sidebar */}
        {!isSidebarExpanded && (
          <Button variant={buttonVariant} size="icon" onClick={onNewRecord} aria-label="Nuevo Registro">
            <Plus className="h-5 w-5" />
          </Button>
        )}
        <Button variant={buttonVariant} size="icon" onClick={toggleSidebar} aria-label="Alternar Sidebar">
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold ml-4">Dashboard</h1>
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant={buttonVariant}
          size="icon"
          onClick={toggleTheme}
          aria-label="Alternar Tema"
        >
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
        <Button variant={buttonVariant} size="icon" onClick={handleLogout} aria-label="Cerrar Sesión">
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
