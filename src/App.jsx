import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Button } from './components/ui/Button';
import { Card, CardHeader, CardBody, CardFooter } from './components/ui/Card';
import { Badge } from './components/ui/Badge';
import { Input } from './components/ui/Input';
import { Select } from './components/ui/Select';
import { Modal } from './components/ui/Modal';
import { Search, Eye, Sparkles, Layers, Sliders, Laptop, ChevronRight } from 'lucide-react';

import Home from './pages/Home';
import Journey from './pages/Journey';
import JourneyDetails from './pages/JourneyDetails';
import Planning from './pages/Planning';
import Versions from './pages/Versions';
import Team from './pages/Team';
import ReleaseControl from './pages/ReleaseControl';
import Login from './pages/Login';
import LoginCallback from './pages/LoginCallback';

// A design system showcase container to demonstrate Phase 1 primitives
const Phase1Showcase = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [testInput, setTestInput] = useState('');
  const [testSelect, setTestSelect] = useState('1');

  return (
    <div className="max-w-[1280px] mx-auto px-sp-16 sm:px-sp-32 lg:px-sp-48 py-sp-48 font-sans">
      
      {/* Hero-like Banner */}
      <div className="mb-sp-64 border-b border-border pb-sp-32">
        <span className="font-mono text-meta font-bold text-accent uppercase tracking-widest">
          Phase 1 Complete
        </span>
        <h1 className="text-hero-mobile md:text-hero-tablet lg:text-hero-desktop font-semibold text-text-primary leading-[1.05] tracking-tight mt-sp-8 mb-sp-16 max-w-3xl">
          Visual Foundation &amp; Primitives
        </h1>
        <p className="text-text-secondary text-body md:text-card max-w-2xl leading-relaxed">
          The core architecture, theme variables, structured mock database, shared context, and primitive components are fully operational.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-sp-32">
        
        {/* Left 2 Cols: Component Showcases */}
        <div className="lg:col-span-2 flex flex-col gap-sp-48">
          
          {/* Section: Typography & Colors */}
          <div className="flex flex-col gap-sp-24">
            <h2 className="text-section font-semibold text-text-primary tracking-tight">Typography &amp; Color Palettes</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-sp-16">
              <div className="p-sp-16 rounded-card border border-border bg-bg-main">
                <span className="text-meta font-medium text-text-secondary">Main Background</span>
                <p className="font-mono text-meta font-semibold mt-sp-4">var(--color-bg-main)</p>
              </div>
              <div className="p-sp-16 rounded-card border border-border bg-bg-secondary">
                <span className="text-meta font-medium text-text-secondary">Secondary Bg</span>
                <p className="font-mono text-meta font-semibold mt-sp-4">var(--color-bg-secondary)</p>
              </div>
              <div className="p-sp-16 rounded-card border border-border bg-bg-surface">
                <span className="text-meta font-medium text-text-secondary">Surface Background</span>
                <p className="font-mono text-meta font-semibold mt-sp-4">var(--color-bg-surface)</p>
              </div>
              <div className="p-sp-16 rounded-card border border-border bg-bg-elevated shadow-1">
                <span className="text-meta font-medium text-text-secondary">Elevated Surface</span>
                <p className="font-mono text-meta font-semibold mt-sp-4">var(--color-bg-elevated)</p>
              </div>
              <div className="p-sp-16 rounded-card border border-accent/20 bg-accent-surface text-accent">
                <span className="text-meta font-medium">Primary Accent</span>
                <p className="font-mono text-meta font-semibold mt-sp-4">var(--color-accent)</p>
              </div>
              <div className="p-sp-16 rounded-card border border-status-success/20 bg-status-success-surface text-status-success">
                <span className="text-meta font-medium">Success Color</span>
                <p className="font-mono text-meta font-semibold mt-sp-4">var(--color-status-success)</p>
              </div>
            </div>
          </div>

          {/* Section: Interactive Components */}
          <div className="flex flex-col gap-sp-24">
            <h2 className="text-section font-semibold text-text-primary tracking-tight">Primitive UI Primitives</h2>
            
            {/* Cards and Buttons */}
            <Card className="shadow-1">
              <CardHeader>
                <div className="flex items-center gap-sp-8">
                  <Layers className="w-4 h-4 text-accent" />
                  <h4 className="text-card font-semibold text-text-primary">Custom Card Primitive</h4>
                </div>
                <Badge variant="accent">V1.0 Primitive</Badge>
              </CardHeader>
              <CardBody className="flex flex-col gap-sp-16">
                <p className="text-text-secondary">
                  This card uses our custom spacing tokens and border system variables. It supports header, body, and footer slots, plus state variations.
                </p>
                <div className="flex flex-wrap gap-sp-12">
                  <Button variant="primary">Primary Button</Button>
                  <Button variant="secondary">Secondary Button</Button>
                  <Button variant="outline">Outline Button</Button>
                  <Button variant="ghost">Ghost Button</Button>
                  <Button variant="danger">Danger Style</Button>
                </div>
              </CardBody>
              <CardFooter>
                <Button variant="outline" onClick={() => setModalOpen(true)}>
                  Trigger Interactive Modal
                </Button>
              </CardFooter>
            </Card>

            {/* Inputs & Forms */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-sp-8">
                  <Sliders className="w-4 h-4 text-accent" />
                  <h4 className="text-card font-semibold text-text-primary">Forms &amp; Input Alignment</h4>
                </div>
              </CardHeader>
              <CardBody className="grid grid-cols-1 md:grid-cols-2 gap-sp-16">
                <Input
                  label="Sample Text Input"
                  placeholder="Enter custom configuration metadata..."
                  value={testInput}
                  onChange={(e) => setTestInput(e.target.value)}
                  icon={Sparkles}
                />
                <Select
                  label="Sample Options Select"
                  value={testSelect}
                  onChange={(e) => setTestSelect(e.target.value)}
                  options={[
                    { value: '1', label: 'Primary Option One' },
                    { value: '2', label: 'Secondary Option Two' },
                    { value: '3', label: 'Tertiary Option Three' }
                  ]}
                />
              </CardBody>
            </Card>

          </div>

        </div>

        {/* Right Col: Project Stats & Tokens Metadata */}
        <div className="flex flex-col gap-sp-32">
          
          <Card variant="elevated">
            <CardHeader>
              <h4 className="text-card font-semibold text-text-primary">Verification Details</h4>
            </CardHeader>
            <CardBody className="flex flex-col gap-sp-16 text-meta">
              <div className="flex justify-between py-sp-4 border-b border-border-subtle">
                <span className="text-text-secondary">Geist Font Status</span>
                <span className="font-semibold text-status-success">Connected</span>
              </div>
              <div className="flex justify-between py-sp-4 border-b border-border-subtle">
                <span className="text-text-secondary">Tailwind CSS</span>
                <span className="font-semibold text-text-primary">v4.0.0 Stable</span>
              </div>
              <div className="flex justify-between py-sp-4 border-b border-border-subtle">
                <span className="text-text-secondary">State Synchronization</span>
                <span className="font-semibold text-accent">React Context</span>
              </div>
              <div className="flex justify-between py-sp-4">
                <span className="text-text-secondary">Data Files Count</span>
                <span className="font-semibold text-text-primary">7 Files (Parsed)</span>
              </div>
            </CardBody>
          </Card>

          <Card variant="secondary">
            <CardBody className="flex flex-col gap-sp-12">
              <span className="font-mono text-[11px] text-text-muted font-bold tracking-widest uppercase">Responsive Layout Check</span>
              <div className="flex items-center gap-sp-12 text-text-secondary">
                <Laptop className="w-5 h-5 text-accent shrink-0" />
                <p className="text-meta leading-normal">
                  Resize your browser width. Notice columns reflow and navigation layout wraps to compact drawers below <kbd className="bg-bg-surface px-1 border border-border rounded text-text-primary">1024px</kbd>.
                </p>
              </div>
            </CardBody>
          </Card>

        </div>

      </div>

      {/* Interactive Modal Demo */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Verification Primitive Modal"
        footerActions={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setModalOpen(false)}>
              Confirm State
            </Button>
          </>
        }
      >
        <p className="text-text-secondary">
          This overlay modal features standard spring velocity enter transitions. Background clicks or pressing <kbd className="font-mono bg-bg-secondary px-1 border border-border rounded text-12px text-text-primary">Esc</kbd> will dismiss the modal layer safely.
        </p>
      </Modal>

    </div>
  );
};

// Global Search Component integrated within App
const GlobalSearch = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { versions, teamMembers, stages } = useApp();
  const [query, setQuery] = useState('');

  // Keep search modal keyboard-focused
  useEffect(() => {
    if (isOpen) setQuery('');
  }, [isOpen]);

  if (!isOpen) return null;

  // Filter items across resources
  const getFilteredResults = () => {
    if (!query) return [];
    const q = query.toLowerCase();

    const results = [];
    
    // Search versions
    versions.forEach(v => {
      if (v.version.toLowerCase().includes(q) || v.changeSummary.toLowerCase().includes(q)) {
        results.push({ type: 'Version', name: v.version, path: '/journey', desc: v.changeSummary });
      }
    });

    // Search team
    teamMembers.forEach(t => {
      if (t.name.toLowerCase().includes(q) || t.role.toLowerCase().includes(q)) {
        results.push({ type: 'Team Member', name: t.name, path: '/team', desc: t.role });
      }
    });

    // Search journey stages
    stages.forEach(s => {
      if (s.name.toLowerCase().includes(q) || (s.summary && s.summary.toLowerCase().includes(q))) {
        results.push({ type: 'Journey Milestone', name: s.name, path: `/journey/${s.id}`, desc: s.summary });
      }
    });

    return results.slice(0, 8);
  };

  const results = getFilteredResults();

  const handleItemClick = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-sp-16 font-sans">
      <div className="absolute inset-0 glass backdrop-blur-[4px]" onClick={onClose} />
      
      <div className="relative w-full max-w-lg bg-bg-surface border border-border rounded-container shadow-2 overflow-hidden flex flex-col max-h-[60vh]">
        <div className="flex items-center border-b border-border-subtle px-sp-16 h-sp-button-h bg-bg-secondary">
          <Search className="w-4 h-4 text-text-muted mr-sp-12 shrink-0" />
          <input
            type="text"
            placeholder="Search deliverables, versions, timeline, team..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full text-body text-text-primary bg-transparent outline-none placeholder:text-text-muted"
            autoFocus
          />
          <kbd className="text-[10px] border border-border px-1 bg-bg-surface rounded text-text-muted select-none">ESC</kbd>
        </div>

        <div className="flex-1 overflow-y-auto p-sp-8 bg-bg-main">
          {query === '' ? (
            <div className="py-sp-32 text-center text-text-muted text-meta">
              Type to search the portal repository...
            </div>
          ) : results.length === 0 ? (
            <div className="py-sp-32 text-center text-text-muted text-meta">
              No results found for &ldquo;{query}&rdquo;
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              {results.map((res, i) => (
                <button
                  key={i}
                  onClick={() => handleItemClick(res.path)}
                  className="flex items-center justify-between text-left p-sp-12 hover:bg-bg-secondary rounded-button transition-colors duration-150 cursor-pointer w-full group"
                >
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="text-body font-medium text-text-primary group-hover:text-accent transition-colors duration-150">
                      {res.name}
                    </span>
                    <span className="text-[10px] text-text-muted truncate">
                      {res.type} • {res.desc}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-accent transition-colors duration-150 shrink-0" />
                </button>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

// Route wrapper that provides the search overlay logic
const AppContent = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();

  // Close search on route change
  useEffect(() => {
    setSearchOpen(false);
  }, [location.pathname]);

  // Handle global cmd+k / ctrl+k shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(prev => !prev);
      }
      if (e.key === 'Escape' && searchOpen) {
        setSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchOpen]);

  return (
    <div className="min-h-screen flex flex-col bg-bg-main text-text-primary font-sans transition-colors duration-200">
      <Navbar onSearchClick={() => setSearchOpen(true)} />
      
      <main className="flex-1 w-full relative pb-sp-96 md:pb-sp-128 mt-[73px]">
        <Routes>
          {/* Main Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/journey" element={<Journey />} />
          <Route path="/journey/:id" element={<JourneyDetails />} />
          
          <Route path="/planning" element={<Planning />} />
          <Route path="/versions" element={<Versions />} />
          <Route path="/team" element={<Team />} />

          {/* Dev/Design showcase route */}
          <Route path="/design-system" element={<Phase1Showcase />} />

          {/* Admin Protected Routes */}
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin/callback" element={<LoginCallback />} />
          
          <Route 
            path="/release-control" 
            element={
              <AdminRoute>
                <ReleaseControl />
              </AdminRoute>
            } 
          />

          {/* Fallback Catch-all Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      
      <Footer />

      <GlobalSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
};

// Simple Admin Route Guard component
const AdminRoute = ({ children }) => {
  const { currentUser } = useApp();
  const location = useLocation();

  if (!currentUser) {
    // Redirect to login if unauthenticated
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }
  
  if (currentUser.role !== 'admin') {
    // If authenticated but not admin, prevent access
    return (
      <div className="max-w-[1280px] mx-auto px-sp-16 py-sp-96 text-center font-sans">
        <h2 className="text-section font-semibold text-status-error">Unauthorized Access</h2>
        <p className="text-text-secondary mt-sp-8">You do not have administrative privileges to access the Release Control portal.</p>
        <Link to="/">
          <Button variant="primary" className="mt-sp-24">Return Home</Button>
        </Link>
      </div>
    );
  }

  return children;
};

// Root Component
function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <Router>
          <AppContent />
        </Router>
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;
