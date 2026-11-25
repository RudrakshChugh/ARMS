import React from 'react';
import { Link } from 'react-router-dom';
import { NOVA_META } from '../../data/novaData';

export const Footer = () => {
  return (
    <footer className="border-t border-border py-sp-32 px-sp-16 font-sans">
      <div className="max-w-[1280px] mx-auto px-sp-16 sm:px-sp-24 lg:px-sp-48 flex flex-col md:flex-row items-center justify-between gap-sp-16">
        {/* Left: Branding */}
        <div className="flex flex-col items-center md:items-start gap-sp-2 text-center md:text-left">
          <span className="font-mono text-meta font-semibold text-text-secondary tracking-wider">
            {NOVA_META.shortName} · {NOVA_META.teamName.toUpperCase()} (ID: {NOVA_META.teamId}) · UCS503
          </span>
          <span className="text-meta text-text-muted">
            Subgroup {NOVA_META.subgroup} · {NOVA_META.institution} · Instructor: {NOVA_META.instructor}
          </span>
        </div>

        {/* Right: Quick Links */}
        <div className="flex flex-wrap items-center justify-center gap-sp-12 text-meta text-text-muted">
          <Link to="/" className="hover:text-text-primary transition-colors duration-150">
            Overview
          </Link>
          <span className="text-border">·</span>
          <Link to="/architecture" className="hover:text-text-primary transition-colors duration-150">
            Architecture
          </Link>
          <span className="text-border">·</span>
          <Link to="/journey" className="hover:text-text-primary transition-colors duration-150">
            Journey
          </Link>
          <span className="text-border">·</span>
          <Link to="/versions" className="hover:text-text-primary transition-colors duration-150">
            Releases
          </Link>
          <span className="text-border">·</span>
          <Link to="/team" className="hover:text-text-primary transition-colors duration-150">
            Team
          </Link>
          <span className="text-border">·</span>
          <a
            href={NOVA_META.novaLiveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accent transition-colors duration-150 font-medium"
          >
            Live App
          </a>
          <span className="text-border">·</span>
          <a
            href={NOVA_META.novaRepoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accent transition-colors duration-150"
          >
            NOVA GitHub
          </a>
        </div>
      </div>
    </footer>
  );
};
