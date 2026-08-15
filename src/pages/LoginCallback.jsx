import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';

export default function LoginCallback() {
  const [searchParams] = useSearchParams();
  const [error, setError] = useState(null);
  const { loginWithOAuth } = useApp();
  const navigate = useNavigate();
  const exchangeAttempted = useRef(false);

  useEffect(() => {
    // Prevent duplicate execution from React re-renders
    if (exchangeAttempted.current) return;
    exchangeAttempted.current = true;

    const handleCallback = async () => {
      const code = searchParams.get('code');
      if (!code) {
        setError('Missing single-use authorization code from server.');
        setTimeout(() => navigate('/admin/login'), 3000);
        return;
      }

      try {
        const res = await api.exchangeGoogleCode(code);
        const user = await loginWithOAuth(res.token);
        
        // Secure authorization redirect rules
        if (user.role === 'admin') {
          navigate('/release-control', { replace: true });
        } else {
          navigate('/', { replace: true });
        }
      } catch (err) {
        console.error('OAuth exchange failed:', err);
        setError(err.message || 'Verification handshake failed.');
        setTimeout(() => navigate('/admin/login', { replace: true }), 3000);
      }
    };

    handleCallback();
  }, [searchParams, loginWithOAuth, navigate]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] font-sans text-meta text-status-error p-sp-32">
        <h3 className="font-semibold text-section">Authentication Failed</h3>
        <p className="mt-sp-8">{error}</p>
        <span className="text-text-muted text-[11px] mt-sp-16 font-medium">Returning to login screen...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] font-sans text-meta text-text-muted">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mb-sp-16"></div>
      <p className="font-medium">Securing authorization session...</p>
    </div>
  );
}
