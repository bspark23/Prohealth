'use client';

import Link from 'next/link';
import { Home, BookText, Smile, Settings } from 'lucide-react';
import { ThemeToggle } from './theme-toggle';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function Header() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/journal', icon: BookText, label: 'Journal' },
    { href: '/mood', icon: Smile, label: 'Mood' },
    { href: '/history', icon: BookText, label: 'History' },
    { href: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-bg-light/90 dark:bg-bg-dark/90 backdrop-blur-sm transition-colors duration-300">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg text-text-light dark:text-text-dark">
          <BookText className="h-6 w-6 text-primary-light dark:text-primary-dark" />
          <span className="hidden sm:inline">PropHealth</span>
        </Link>
        <nav className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary-light dark:hover:text-primary-dark",
                  pathname === item.href ? "text-primary-light dark:text-primary-dark" : "text-text-light/70 dark:text-text-dark/70"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            ))}
          </div>
          <ThemeToggle />
        </nav>
      </div>
      {/* Mobile Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-bg-light dark:bg-bg-dark border-t md:hidden shadow-lg">
        <div className="flex justify-around py-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 text-xs font-medium transition-colors hover:text-primary-light dark:hover:text-primary-dark",
                pathname === item.href ? "text-primary-light dark:text-primary-dark" : "text-text-light/70 dark:text-text-dark/70"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
