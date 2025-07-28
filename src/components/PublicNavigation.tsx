
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'react-router-dom';
import { Upload, User, Menu, X, BookOpen } from 'lucide-react';
import { NotificationsPopover } from './NotificationsPopover';

export const PublicNavigation = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/notes', label: 'Notes' },
    { path: '/lectures', label: 'Lectures' },
    { path: '/placement', label: 'Placement' },
    { path: '/groups', label: 'Groups' },
    { path: '/about', label: 'About' },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8" style={{ color: '#2462EB' }} />
              <span className="text-2xl font-bold text-blue-600">Acadlyst</span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => (
                <Link key={item.path} to={item.path}>
                  <Button 
                    variant={location.pathname === item.path ? "default" : "ghost"}
                    className="text-sm"
                  >
                    {item.label}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <NotificationsPopover />
            <Link to="/profile">
              <Button variant="ghost" className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>Profile</span>
              </Button>
            </Link>
            <Link to="/upload">
              <Button className="flex items-center space-x-2">
                <Upload className="h-4 w-4" />
                <span>Upload</span>
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <NotificationsPopover />
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMobileMenu}
              className="p-2"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <Link key={item.path} to={item.path} onClick={() => setIsMobileMenuOpen(false)}>
                  <Button 
                    variant={location.pathname === item.path ? "default" : "ghost"}
                    className="w-full justify-start text-left"
                  >
                    {item.label}
                  </Button>
                </Link>
              ))}
              <div className="border-t pt-2 space-y-1">
                <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </Button>
                </Link>
                <Link to="/upload" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="w-full justify-start flex items-center space-x-2">
                    <Upload className="h-4 w-4" />
                    <span>Upload</span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
