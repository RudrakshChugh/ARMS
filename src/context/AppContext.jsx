import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import {
  NOVA_STAGES,
  NOVA_VERSIONS,
  NOVA_ACTIVITIES,
  NOVA_BID_CANDIDATES,
  NOVA_TEAM_MEMBERS
} from '../data/novaData';

const AppContext = createContext();

const isLegacySeedRecords = ({ vList, sList, iList }) => {
  const hasLegacyProject = Array.isArray(iList) && iList.some(
    (p) => p?.title === 'CollabSync' || p?.title === 'LabLock' || p?.title === 'PeerCode'
  );
  const hasLegacyStage = Array.isArray(sList) && sList.some(
    (s) => s?.owner === 'Aarav Sharma' || s?.summary?.includes('CollabSync')
  );
  const hasLegacyVersion = Array.isArray(vList) && vList.some(
    (v) => v?.author === 'Aarav Sharma' || v?.changeSummary?.includes('CollabSync')
  );
  return hasLegacyProject || hasLegacyStage || hasLegacyVersion;
};

export const AppProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Core application states (backed by database persistence)
  const [versions, setVersions] = useState([]);
  const [publications, setPublications] = useState([]);
  const [activities, setActivities] = useState([]);
  const [stages, setStages] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [responsibilityMatrix, setResponsibilityMatrix] = useState([]);
  const [projectIdeas, setProjectIdeas] = useState([]);
  const [primaryProject, setPrimaryProject] = useState(null);

  // Load all public database tables
  const loadDatabaseRecords = async () => {
    try {
      const [vList, pList, aList, sList, tList, mList, iList] = await Promise.all([
        api.getVersions().catch(() => []),
        api.getPublications().catch(() => []),
        api.getActivities().catch(() => []),
        api.getStages().catch(() => []),
        api.getTeamMembers().catch(() => []),
        api.getMatrix().catch(() => []),
        api.getProjects().catch(() => [])
      ]);

      const useNovaFallback = isLegacySeedRecords({ vList, sList, iList });

      const resolvedVersions = useNovaFallback || !vList?.length ? NOVA_VERSIONS : vList;
      const resolvedActivities = useNovaFallback || !aList?.length ? NOVA_ACTIVITIES : aList;
      const resolvedStages = useNovaFallback || !sList?.length ? NOVA_STAGES : sList;
      const resolvedIdeas = useNovaFallback || !iList?.length ? NOVA_BID_CANDIDATES : iList;
      const resolvedTeam = Array.isArray(tList) && tList.length > 0
        ? tList.map((member) => {
            const firstWord = (member.name || '').toLowerCase().split(' ')[0];
            const enrichment = NOVA_TEAM_MEMBERS.find(
              (n) => n.id === member.id || n.name.toLowerCase().startsWith(firstWord)
            );
            return enrichment
              ? {
                  ...enrichment,
                  ...member,
                  name: enrichment.name,
                  rollNumber: enrichment.rollNumber,
                  role: enrichment.role,
                  contribution: enrichment.contribution
                }
              : member;
          })
        : NOVA_TEAM_MEMBERS;

      setVersions(resolvedVersions);
      setPublications(useNovaFallback ? [] : pList);
      setActivities(resolvedActivities);
      setStages(resolvedStages);
      // Sort here rather than in each page so the Team page, the homepage roster and
      // the global search all agree, whatever order the backend happens to return.
      setTeamMembers(
        [...resolvedTeam].sort((a, b) => (a.name || '').localeCompare(b.name || ''))
      );
      setResponsibilityMatrix(mList);
      setProjectIdeas(resolvedIdeas);

      const primary = resolvedIdeas.find(p => p.is_primary) || resolvedIdeas[0];
      setPrimaryProject(primary);
    } catch (err) {
      console.error('Failed to sync databases records from backend:', err);
    }
  };

  // Restore session token on app mount
  useEffect(() => {
    const checkUserSession = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const userRes = await api.getCurrentUser();
          setCurrentUser(userRes.user);
        } catch (err) {
          console.warn('Session expired or invalid token:', err);
          localStorage.removeItem('token');
          setCurrentUser(null);
        }
      }
      setIsAuthLoading(false);
      // Load tables regardless of auth state (since read operations are public)
      await loadDatabaseRecords();
    };

    checkUserSession();
  }, []);

  // Login handler
  const login = async (email, password) => {
    try {
      const data = await api.login(email, password);
      localStorage.setItem('token', data.token);
      setCurrentUser(data.user);
      await loadDatabaseRecords(); // Refresh tables with private credentials if role updates
      return data.user;
    } catch (err) {
      throw new Error(err.message || 'Login failed.');
    }
  };

  // Google OAuth Login handler
  const loginWithOAuth = async (token) => {
    localStorage.setItem('token', token);
    try {
      const data = await api.getCurrentUser();
      setCurrentUser(data.user);
      await loadDatabaseRecords();
      return data.user;
    } catch (err) {
      localStorage.removeItem('token');
      setCurrentUser(null);
      throw new Error(err.message || 'OAuth verification failed.');
    }
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
  };

  // Publish release trigger
  const publishRelease = async (releaseData) => {
    try {
      const res = await api.publishRelease(releaseData);
      // Synchronize frontend states with database immediately
      await loadDatabaseRecords();
      return res;
    } catch (err) {
      throw new Error(err.message || 'Publication failed.');
    }
  };

  // Edit an existing release trigger
  const updateRelease = async (id, releaseData) => {
    try {
      const cleanId = id.toString().replace('pub-', '');
      const res = await api.updateRelease(cleanId, releaseData);
      await loadDatabaseRecords();
      return res;
    } catch (err) {
      throw new Error(err.message || 'Update failed.');
    }
  };

  // Delete release trigger
  const deletePublication = async (id) => {
    try {
      // Wipes 'pub-xxxx' string prefixes if present
      const cleanId = id.toString().replace('pub-', '');
      const res = await api.deletePublication(cleanId);
      await loadDatabaseRecords();
      return res;
    } catch (err) {
      throw new Error(err.message || 'Deletion failed.');
    }
  };

  // Mark stage completed via backend database transaction
  const markStageComplete = async (stageId) => {
    try {
      await api.markStageComplete(stageId);
      await loadDatabaseRecords();
    } catch (err) {
      throw new Error(err.message || 'Failed to update stage status.');
    }
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      isAuthLoading,
      versions,
      publications,
      activities,
      stages,
      teamMembers,
      responsibilityMatrix,
      projectIdeas,
      primaryProject,
      setPrimaryProject,
      login,
      loginWithOAuth,
      logout,
      publishRelease,
      updateRelease,
      deletePublication,
      markStageComplete,
      refreshData: loadDatabaseRecords
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
