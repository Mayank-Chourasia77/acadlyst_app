import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from './AuthProvider';
import { Upload, Trophy, Search, User, LogOut, Menu, X, ShieldCheck, ChevronDown, FileText, PlayCircle, Briefcase, Users, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAdmin } from '@/hooks/useAdmin';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NotificationsPopover } from './NotificationsPopover';

export const Navigation = () => {
  const { user, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAdmin } = useAdmin();

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
            
            <div className="hidden lg:flex items-center space-x-6">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <Search className="h-4 w-4" />
                    <span>Explore</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem asChild>
                    <Link to="/notes">
                      <FileText className="mr-2 h-4 w-4" />
                      <span>Notes</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/lectures">
                      <PlayCircle className="mr-2 h-4 w-4" />
                      <span>Lectures</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/placement">
                      <Briefcase className="mr-2 h-4 w-4" />
                      <span>Placement</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/groups">
                      <Users className="mr-2 h-4 w-4" />
                      <span>Groups</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Link to="/upload">
                <Button variant="ghost" className="flex items-center space-x-2">
                  <Upload className="h-4 w-4" />
                  <span>Upload</span>
                </Button>
              </Link>
              <Link to="/leaderboard">
                <Button variant="ghost" className="flex items-center space-x-2">
                  <Trophy className="h-4 w-4" />
                  <span>Leaderboard</span>
                </Button>
              </Link>
              {isAdmin && (
                <Link to="/admin">
                  <Button variant="ghost" className="flex items-center space-x-2 text-green-600 hover:text-green-700">
                    <ShieldCheck className="h-4 w-4" />
                    <span>Admin</span>
                  </Button>
                </Link>
              )}
            </div>
          </div>

          <div className="hidden lg:flex items-center space-x-4">
            {user && (
              <>
                <NotificationsPopover />
                <Link to="/profile">
                  <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">Profile</span>
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={signOut}
                  className="flex items-center space-x-2 text-red-600 hover:text-red-700"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center space-x-2">
            {user && <NotificationsPopover />}
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
          <div className="lg:hidden border-t bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link to="/notes" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start flex items-center space-x-2">
                  <FileText className="h-4 w-4" />
                  <span>Notes</span>
                </Button>
              </Link>
              <Link to="/lectures" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start flex items-center space-x-2">
                  <PlayCircle className="h-4 w-4" />
                  <span>Lectures</span>
                </Button>
              </Link>
              <Link to="/placement" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start flex items-center space-x-2">
                  <Briefcase className="h-4 w-4" />
                  <span>Placement</span>
                </Button>
              </Link>
              <Link to="/groups" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>Groups</span>
                </Button>
              </Link>

              <Link to="/upload" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start flex items-center space-x-2">
                  <Upload className="h-4 w-4" />
                  <span>Upload</span>
                </Button>
              </Link>
              <Link to="/leaderboard" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start flex items-center space-x-2">
                  <Trophy className="h-4 w-4" />
                  <span>Leaderboard</span>
                </Button>
              </Link>
              
              {user && (
                <div className="border-t pt-2 space-y-1">
                  {isAdmin && (
                    <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start flex items-center space-x-2 text-green-600 hover:text-green-700">
                        <ShieldCheck className="h-4 w-4" />
                        <span>Admin</span>
                      </Button>
                    </Link>
                  )}
                  <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>Profile</span>
                    </Button>
                  </Link>
                  <Button 
                    variant="ghost" 
                    onClick={() => {
                      signOut();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full justify-start flex items-center space-x-2 text-red-600 hover:text-red-700"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
