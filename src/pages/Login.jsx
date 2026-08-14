import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { Shield, AlertCircle } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useApp();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Default redirect path
  const from = location.state?.from?.pathname || '/release-control';

  // If already logged in, redirect immediately
  React.useEffect(() => {
    if (currentUser) {
      navigate(from, { replace: true });
    }
  }, [currentUser, navigate, from]);

  const handleGoogleLogin = () => {
    setIsLoading(true);
    localStorage.setItem('authRedirectPath', from);
    window.location.href = 'http://localhost:5000/api/auth/google';
  };

  return (
    <div className="max-w-[1280px] mx-auto px-sp-16 sm:px-sp-32 lg:px-sp-48 py-sp-96 font-sans flex flex-col items-center justify-center min-h-[70vh]">
      
      {/* Login Container Block */}
      <div className="w-full max-w-sm border border-border glass rounded-container p-sp-32 shadow-2 flex flex-col gap-sp-24 text-meta text-text-secondary">
        
        {/* Editorial Heading */}
        <div className="flex flex-col gap-sp-4 border-b border-border-subtle pb-sp-16">
          <span className="font-mono text-[10px] font-semibold text-accent uppercase tracking-widest flex items-center gap-sp-8">
            <Shield className="w-3.5 h-3.5" /> Workspace Identity
          </span>
          <h2 className="text-section font-semibold text-text-primary mt-sp-4 tracking-tight">
            Portal Authentication
          </h2>
        </div>

        {error && (
          <div className="flex items-start gap-sp-8 bg-status-error-surface border border-status-error/30 p-sp-12 rounded-card text-status-error">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="leading-snug">{error}</span>
          </div>
        )}

        <div className="flex flex-col gap-sp-16">
          <p className="text-text-secondary text-body leading-relaxed">
            Sign in with your Google account to access the administrative workspace.
          </p>
          
          <div className="pt-sp-8">
            <Button
              onClick={handleGoogleLogin}
              variant="secondary"
              className="w-full !h-sp-button-h flex items-center justify-center gap-sp-8 bg-bg-surface hover:bg-bg-secondary border-border"
              disabled={isLoading}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
              </svg>
              {isLoading ? 'Authenticating...' : 'Continue with Google'}
            </Button>
          </div>
        </div>

      </div>

    </div>
  );
}
