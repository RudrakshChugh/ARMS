import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="border-t border-border py-sp-32 px-sp-16 font-sans">
      <div className="max-w-[1280px] mx-auto px-sp-16 sm:px-sp-24 lg:px-sp-48 flex flex-col md:flex-row items-center justify-between gap-sp-16">
        
        {/* Left: Branding */}
        <div className="flex flex-col items-center md:items-start gap-sp-2 text-center md:text-left">
          <span className="font-mono text-meta font-semibold text-text-secondary tracking-wider">
            TEAM ARMS · UCS503
          </span>
          <span className="text-meta text-text-muted">
            Semester Project Portal · Academic Session 2026–27
          </span>
        </div>

        {/* Right: Quick Links */}
        <div className="flex items-center gap-sp-16 text-meta text-text-muted">
          <Link to="/journey" className="hover:text-text-primary transition-colors duration-150">
            Journey
          </Link>
          {/* TEMPORARILY DISABLED: Planning page is hidden — restore alongside the
              route in App.jsx and the nav link in Navbar.jsx.
          <span className="text-border">·</span>
          <Link to="/planning" className="hover:text-text-primary transition-colors duration-150">
            Planning
          </Link>
          */}
          <span className="text-border">·</span>
          <Link to="/team" className="hover:text-text-primary transition-colors duration-150">
            Team
          </Link>
        </div>

      </div>
    </footer>
  );
};
