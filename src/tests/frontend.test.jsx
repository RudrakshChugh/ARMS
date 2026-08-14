import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../pages/Login';
import ReleaseControl from '../pages/ReleaseControl';
import JourneyDetails from '../pages/JourneyDetails';
import { Navbar } from '../components/layout/Navbar';
import { ThemeProvider } from '../context/ThemeContext';

let mockParams = {};
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useParams: () => mockParams
  };
});

// Mock the AppContext hooks
const mockLogin = vi.fn();
const mockLogout = vi.fn();
const mockPublishRelease = vi.fn();
const mockMarkStageComplete = vi.fn();

let mockCurrentUser = null;

vi.mock('../context/AppContext', () => ({
  useApp: () => ({
    currentUser: mockCurrentUser,
    login: mockLogin,
    logout: mockLogout,
    publishRelease: mockPublishRelease,
    markStageComplete: mockMarkStageComplete,
    stages: [
      { id: 'stage-1', name: 'Idea Exploration', status: 'Completed', date: 'Aug 10, 2026', owner: 'Manya Kedia', version: 'v0.1', summary: 'Summary details', assets: [] },
      { id: 'stage-4', name: 'Planning V2', status: 'In Progress', date: 'Sep 10, 2026', owner: 'Aarav Sharma', version: 'v1.2', summary: 'Detailed specs', assets: [] }
    ],
    versions: [],
    publications: [],
    teamMembers: []
  })
}));

describe('Frontend React Core User Interface Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCurrentUser = null;
    mockParams = {};
  });

  // 1. Login Page Checks (Google Auth ONLY)
  it('should render the Continue with Google button and trigger redirect on click', () => {
    const originalLocation = window.location;
    delete window.location;
    window.location = { href: '' };

    render(
      <BrowserRouter>
        <ThemeProvider>
          <Login />
        </ThemeProvider>
      </BrowserRouter>
    );

    // Verify Google button renders and no email/password form controls exist
    const googleButton = screen.getByRole('button', { name: /continue with google/i });
    expect(googleButton).toBeInTheDocument();
    
    expect(screen.queryByPlaceholderText(/user@workspace.edu/i)).not.toBeInTheDocument();
    expect(screen.queryByPlaceholderText(/••••••••/i)).not.toBeInTheDocument();

    // Trigger click event
    fireEvent.click(googleButton);
    expect(window.location.href).toContain('/auth/google');

    // Restore location
    window.location = originalLocation;
  });

  // 2. Navbar Account Menu & Logout Checks
  it('should show account menu when logged in and trigger logout', () => {
    mockCurrentUser = { name: 'Manya Kedia', email: 'admin@workspace.edu', role: 'admin' };

    render(
      <BrowserRouter>
        <ThemeProvider>
          <Navbar onSearchClick={() => {}} />
        </ThemeProvider>
      </BrowserRouter>
    );

    // Verified logged-in admin name is displayed
    const userTrigger = screen.getByText('Manya Kedia');
    expect(userTrigger).toBeInTheDocument();

    // Toggle dropdown menu
    fireEvent.click(userTrigger);
    
    // Check logout action button renders
    const logoutBtn = screen.getByRole('button', { name: /logout/i });
    expect(logoutBtn).toBeInTheDocument();

    // Trigger logout
    fireEvent.click(logoutBtn);
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  // 3. Release Control Panel Checks
  it('should render release metadata inputs with read-only logged-in author', () => {
    mockCurrentUser = { name: 'Manya Kedia', email: 'admin@workspace.edu', role: 'admin' };

    render(
      <BrowserRouter>
        <ThemeProvider>
          <ReleaseControl />
        </ThemeProvider>
      </BrowserRouter>
    );

    // Verify Release Title and Version inputs render
    expect(screen.getByPlaceholderText(/planning spec baseline/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/v1\.0/i)).toBeInTheDocument();

    // Verify milestone stage target text input
    const stageInput = screen.getByPlaceholderText(/planning v3/i);
    expect(stageInput).toBeInTheDocument();
    expect(stageInput.tagName).toBe('INPUT'); // Confirms text input, not select dropdown!

    // Verify read-only author corresponds to the logged-in administrator
    const authorVal = screen.getByText('Manya Kedia');
    expect(authorVal).toBeInTheDocument();
  });

  // 4. Project Journey & Milestone Details Checks
  it('should render milestone details status badges and completions trigger for admin', () => {
    mockCurrentUser = { name: 'Manya Kedia', email: 'admin@workspace.edu', role: 'admin' };
    mockParams = { id: 'stage-4' };

    render(
      <BrowserRouter>
        <ThemeProvider>
          <JourneyDetails />
        </ThemeProvider>
      </BrowserRouter>
    );

    // Verify title and author details render correctly
    expect(screen.getByText('Planning V2')).toBeInTheDocument();
    expect(screen.getByText('Aarav Sharma')).toBeInTheDocument();

    // Verify status badge
    expect(screen.getByText('In Progress')).toBeInTheDocument();

    // Verify Mark as Completed button is visible for admin on In Progress stages
    const completeButton = screen.getByRole('button', { name: /mark as completed/i });
    expect(completeButton).toBeInTheDocument();

    // Click button
    fireEvent.click(completeButton);
    expect(mockMarkStageComplete).toHaveBeenCalledWith('stage-4');
  });

  it('should hide completion triggers on In Progress milestones for non-admin roles', () => {
    mockCurrentUser = { name: 'Aarav Sharma', email: 'student@workspace.edu', role: 'student' };
    mockParams = { id: 'stage-4' };

    render(
      <BrowserRouter>
        <ThemeProvider>
          <JourneyDetails />
        </ThemeProvider>
      </BrowserRouter>
    );

    // Mark as Completed button must not render for student roles
    const completeButton = screen.queryByRole('button', { name: /mark as completed/i });
    expect(completeButton).not.toBeInTheDocument();
  });
});
