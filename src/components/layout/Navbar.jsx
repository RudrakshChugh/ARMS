import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Github, User, Menu, X, ChevronDown, Sun, Moon } from 'lucide-react';
import { Button } from '../ui/Button';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';

export const Navbar = ({ onSearchClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useApp();
  const { theme, toggleTheme, isDark } = useTheme();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { name: 'Overview', path: '/' },
    { name: 'Project Journey', path: '/journey' },
    { name: 'Planning', path: '/planning' },
    { name: 'Team', path: '/team' }
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>

      <nav
        className={`sticky top-0 left-0 right-0 z-40 h-[80px] font-sans transition-all duration-300 ${
          isScrolled
            ? 'glass'
            : 'bg-bg-primary'
        }`}
      >
        <div className="max-w-[1280px] h-full mx-auto px-sp-16 sm:px-sp-24 lg:px-sp-48 flex items-center justify-between">
          
          {/* Left: Wordmark */}
          <Link to="/" className="flex items-center gap-sp-8 group select-none shrink-0">
            <span className="font-serif text-[28px] tracking-widest uppercase font-normal text-text-primary group-hover:text-accent transition-colors duration-300">
              ARMS
            </span>
          </Link>

          {/* Center: Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-[40px]">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative text-[11px] uppercase tracking-[0.15em] font-medium transition-colors duration-300 ${
                  isActive(link.path) 
                    ? 'text-text-primary' 
                    : 'text-text-secondary hover:text-accent'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right: Actions */}
          <div className="hidden sm:flex items-center gap-sp-8">
            {/* Search CMD+K Trigger */}
            <button
              onClick={onSearchClick}
              className="flex items-center gap-sp-8 px-sp-12 py-sp-4 border border-border bg-bg-surface hover:bg-bg-secondary rounded-button text-meta text-text-muted transition-all duration-150 cursor-pointer h-sp-32 select-none"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Search</span>
              <kbd className="hidden md:inline font-mono text-xs border border-border px-1 rounded bg-bg-secondary">⌘K</kbd>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-sp-8 text-text-secondary hover:text-text-primary hover:bg-bg-secondary rounded-button transition-colors duration-150 cursor-pointer"
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Repository */}
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-sp-8 text-text-secondary hover:text-text-primary hover:bg-bg-secondary rounded-button transition-colors duration-150 cursor-pointer"
              title="Repository"
            >
              <Github className="w-4 h-4" />
            </a>

            {/* Admin / User Dropdown */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-sp-8 px-sp-12 py-sp-4 border border-border bg-bg-surface hover:bg-bg-secondary rounded-button text-meta text-text-primary transition-all duration-150 cursor-pointer h-sp-32 font-medium select-none"
                >
                  <User className="w-3.5 h-3.5 text-accent" />
                  <span>{currentUser.name}</span>
                  <ChevronDown className="w-3 h-3 text-text-muted" />
                </button>
                {dropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                    <div className="absolute right-0 mt-sp-4 w-44 bg-bg-surface border border-border rounded-card shadow-2 z-50 py-sp-4 flex flex-col font-sans text-meta overflow-hidden">
                      <Link
                        to="/release-control"
                        onClick={() => setDropdownOpen(false)}
                        className="px-sp-16 py-sp-8 text-left hover:bg-bg-secondary text-text-primary transition-colors duration-150 font-medium"
                      >
                        Release Control
                      </Link>
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          handleLogout();
                        }}
                        className="px-sp-16 py-sp-8 text-left hover:bg-bg-secondary text-status-error transition-colors duration-150 font-semibold border-t border-border-subtle cursor-pointer w-full"
                      >
                        Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link to="/admin/login">
                <Button
                  variant="outline"
                  icon={User}
                  className="!h-sp-32 !px-sp-12 !text-meta"
                >
                  Admin Login
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile: Theme toggle + Menu toggle */}
          <div className="flex lg:hidden items-center gap-sp-8">
            <button
              onClick={toggleTheme}
              className="p-sp-8 text-text-secondary hover:bg-bg-secondary rounded-button cursor-pointer transition-colors duration-150"
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={onSearchClick}
              className="p-sp-8 text-text-secondary hover:bg-bg-secondary rounded-button cursor-pointer transition-colors duration-150"
            >
              <Search className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-sp-8 text-text-secondary hover:bg-bg-secondary rounded-button cursor-pointer transition-colors duration-150"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-sp-nav-h z-30 bg-bg-primary lg:hidden flex flex-col p-sp-24 border-t border-border font-sans overflow-y-auto">
          <div className="flex flex-col gap-sp-4 flex-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`py-sp-12 px-sp-12 text-body font-medium rounded-button transition-colors duration-150 ${
                  isActive(link.path) 
                    ? 'text-text-primary bg-bg-secondary' 
                    : 'text-text-secondary hover:bg-bg-secondary'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
          
          <div className="flex flex-col gap-sp-12 pt-sp-24 border-t border-border-subtle">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-sp-12 border border-border bg-bg-surface rounded-button text-meta text-text-secondary"
            >
              <span>GitHub Repository</span>
              <Github className="w-4 h-4" />
            </a>
            
            {currentUser ? (
              <div className="flex flex-col gap-sp-8">
                <Link to="/release-control" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" icon={User} className="w-full">
                    Admin Dashboard ({currentUser.name})
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  className="w-full !border-status-error hover:!bg-status-error-surface hover:!text-status-error"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <Link to="/admin/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="primary" icon={User} className="w-full">
                  Admin Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
};