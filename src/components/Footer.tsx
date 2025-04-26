import React from 'react';
import { Heart, ExternalLink } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="py-8 bg-slate-900 text-slate-400">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p>&copy; {currentYear} Sudip Niroula. All rights reserved.</p>
          </div>
          
          <div className="flex items-center">
            <p className="flex items-center text-sm">
              Built with <Heart size={14} className="mx-1 text-red-500" /> using React & TailwindCSS
            </p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <a 
              href="#hero" 
              className="inline-block px-4 py-2 text-sm text-indigo-400 hover:text-white transition-colors"
            >
              Back to Top
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;