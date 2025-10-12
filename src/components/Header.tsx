"use client"

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from './theme-toggle';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <nav className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link
            href="/"
            className="text-xl font-bold text-foreground hover:opacity-80 transition-opacity"
            onClick={closeMenu}
          >
            Modern Blog
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">
                ホーム
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/about">
                About
              </Link>
            </Button>
            <div className="ml-2">
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              className="transition-transform duration-200"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
              <span className="sr-only">メニューを開く</span>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuOpen
              ? 'max-h-48 opacity-100'
              : 'max-h-0 opacity-0'
          }`}
        >
          <div className="py-4 space-y-2 border-t mt-3">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start"
              asChild
            >
              <Link href="/" onClick={closeMenu}>
                ホーム
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start"
              asChild
            >
              <Link href="/about" onClick={closeMenu}>
                About
              </Link>
            </Button>
          </div>
        </div>
      </nav>
    </header>
  );
}
