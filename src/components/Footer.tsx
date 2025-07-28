
import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Github, Twitter, Linkedin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <BookOpen className="h-8 w-8 text-blue-400" />
              <span className="text-2xl font-bold text-blue-400">Acadlyst</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Connect, learn, and grow with the ultimate platform for students. 
              Share knowledge, find study materials, and excel in your academic journey.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/notes" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Notes
                </Link>
              </li>
              <li>
                <Link to="/lectures" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Lectures
                </Link>
              </li>
              <li>
                <Link to="/placement" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Placement
                </Link>
              </li>
              <li>
                <Link to="/groups" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Groups
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-300 hover:text-blue-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <a 
                  href="mailto:acadlyst.connect@gmail.com" 
                  className="text-gray-300 hover:text-blue-400 transition-colors"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <Link to="/support-us" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Support Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2025 Acadlyst. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
