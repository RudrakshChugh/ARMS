const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper to handle fetch responses and handle JSON conversion
const request = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    ...options.headers
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Set default body content type if not uploading raw files
  if (options.body && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(options.body);
  }

  const response = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error ${response.status}`);
  }

  return response.json();
};

export const api = {
  // Authentication
  login: (email, password) => request('/auth/login', {
    method: 'POST',
    body: { email, password }
  }),
  
  register: (name, email, password, role) => request('/auth/register', {
    method: 'POST',
    body: { name, email, password, role }
  }),
  
  getCurrentUser: () => request('/auth/me', {
    method: 'GET'
  }),

  exchangeGoogleCode: (code) => request('/auth/google/token', {
    method: 'POST',
    body: { code }
  }),

  // Projects & Grid
  getProjects: () => request('/projects', {
    method: 'GET'
  }),
  
  getMatrix: () => request('/projects/matrix', {
    method: 'GET'
  }),
  
  getTeamMembers: () => request('/projects/team', {
    method: 'GET'
  }),

  // Stages & Journey
  getStages: () => request('/stages', {
    method: 'GET'
  }),
  
  getStage: (id) => request(`/stages/${id}`, {
    method: 'GET'
  }),

  markStageComplete: (id) => request(`/stages/${id}/complete`, {
    method: 'PATCH'
  }),

  // Versions History
  getVersions: () => request('/versions', {
    method: 'GET'
  }),

  // Publications Logs
  getPublications: () => request('/releases', {
    method: 'GET'
  }),

  // Activities Log
  getActivities: () => request('/activities', {
    method: 'GET'
  }),

  // Create Release publication (atomic pg transaction)
  publishRelease: (pubData) => request('/releases', {
    method: 'POST',
    body: pubData
  }),

  // Delete Release publication (atomic pg transaction)
  deletePublication: (id) => request(`/releases/${id}`, {
    method: 'DELETE'
  }),

  // File staging uploads (multer local fallback)
  uploadFile: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return request('/files/upload', {
      method: 'POST',
      body: formData
    });
  }
};
export default api;
