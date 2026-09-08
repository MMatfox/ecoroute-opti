// Frontend HTTP API Service

const API_BASE = '/api';

async function request(endpoint, options = {}) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      },
      ...options
    });
    if (!res.ok) {
      throw new Error(`HTTP Error ${res.status}: ${res.statusText}`);
    }
    return await res.json();
  } catch (error) {
    console.error(`API Error on ${endpoint}:`, error);
    throw error;
  }
}

export const api = {
  // Auth & Roles (US1-US4)
  login: (username, role) => request('/auth/login', { method: 'POST', body: JSON.stringify({ username, role }) }),
  register: (data) => request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  updateProfile: (id, data) => request(`/auth/profile/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  getUsers: () => request('/auth/users'),

  // Registration Window & Demands (US5, US6)
  getWindow: () => request('/registrations/window'),
  updateWindow: (data) => request('/registrations/window/update', { method: 'POST', body: JSON.stringify(data) }),
  getRequests: () => request('/registrations/requests'),
  submitRequest: (data) => request('/registrations/requests', { method: 'POST', body: JSON.stringify(data) }),
  updateStopStatus: (id, status) => request(`/registrations/requests/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),

  // Fleet Tracking & Delays (US7, US8, US9)
  getFleet: () => request('/fleet/trucks'),
  updateTruckValidity: (truckId, data) => request(`/fleet/trucks/${truckId}/validity`, { method: 'POST', body: JSON.stringify(data) }),
  trackForCitizen: (lat, lng, requestId) => request(`/fleet/track-for-citizen?lat=${lat}&lng=${lng}&requestId=${requestId || ''}`),
  controlSimulation: (data) => request('/fleet/simulation/control', { method: 'POST', body: JSON.stringify(data) }),

  // VRP Optimization & Manifests (US11, US12, US13)
  optimizeVRP: (data) => request('/vrp/optimize', { method: 'POST', body: JSON.stringify(data || {}) }),
  getCurrentPlan: () => request('/vrp/current-plan'),
  getDriverManifest: (truckId) => request(`/vrp/manifest/${truckId}`),

  // Analytics & Forecasts (US10)
  getWasteSummary: () => request('/analytics/waste-summary')
};
