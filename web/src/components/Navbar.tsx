'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import { logout } from '@/services/auth.service';
import { FlaskConical, LogOut, History, PanelLeftClose, Sun, Moon, BrainCircuit, Linkedin, Instagram, Facebook, Youtube } from 'lucide-react';

interface NavbarProps {
  onToggleSidebar: () => void;
}

const socialLinks = [
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Youtube, href: '#', label: 'YouTube' },
];

export function Navbar({ onToggleSidebar }: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, setUser, setAuthenticated } = useAppStore();
  const [dark, setDark] = React.useState(true);

  const toggleTheme = () => {
    setDark(!dark);
    document.documentElement.classList.toggle('dark');
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    setAuthenticated(false);
    router.push('/login');
  };

  const linkClass = (href: string) =>
    `p-2 hover:bg-accent rounded-lg transition-colors ${pathname === href ? 'text-primary bg-accent/50' : ''}`;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/80 backdrop-blur-sm">
      <div className="flex h-14 items-center px-4 gap-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 hover:bg-accent rounded-lg transition-colors"
        >
          <PanelLeftClose className="h-5 w-5" />
        </button>

        <Link href="/dashboard" className="flex items-center gap-2 cursor-pointer">
          <FlaskConical className="h-6 w-6 text-primary" />
          <div className="flex flex-col leading-tight">
            <span className="font-semibold text-lg">Context Engineering Lab</span>
            <span className="text-[10px] text-muted-foreground tracking-wide uppercase">Almahvi coding school</span>
          </div>
        </Link>

        <div className="flex-1" />

        <div className="hidden md:flex items-center gap-1 mr-2">
          {socialLinks.map(({ icon: Icon, href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 hover:bg-accent rounded-lg transition-colors text-muted-foreground hover:text-foreground"
              title={label}
            >
              <Icon className="h-4 w-4" />
            </a>
          ))}
        </div>

        <Link href="/quiz" className={linkClass('/quiz')} title="Quiz">
          <BrainCircuit className="h-5 w-5" />
        </Link>

        <Link href="/history" className={linkClass('/history')} title="History">
          <History className="h-5 w-5" />
        </Link>

        <button
          onClick={toggleTheme}
          className="p-2 hover:bg-accent rounded-lg transition-colors"
          title="Toggle Theme"
        >
          {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        {user && (
          <div className="flex items-center gap-3 ml-2">
            <span className="text-sm text-muted-foreground">{user.name}</span>
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-destructive/10 rounded-lg transition-colors text-destructive"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
