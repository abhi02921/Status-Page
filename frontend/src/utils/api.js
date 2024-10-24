// src/serviceApi.js

const BASE_URL = process.env.REACT_APP_BACKEND_URL + "/api";

export const fetchServices = async (token) => {
  const response = await fetch(`${BASE_URL}/services`, {
    headers: {
      'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch services');
  }
  const result = await response.json();
  return result.data;
};

export const addService = async (newService, token) => {
  const response = await fetch(`${BASE_URL}/services`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
    },
    body: JSON.stringify(newService),
  });
  if (!response.ok) {
    throw new Error('Failed to add service');
  }
  const result = await response.json();
  return result.data;
};

export const updateService = async (id, updatedService, token) => {
  const response = await fetch(`${BASE_URL}/services/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
    },
    body: JSON.stringify(updatedService),
  });
  if (!response.ok) {
    throw new Error('Failed to update service');
  }
  const result = await response.json();
  return result.data;
};

export const deleteService = async (id, token) => {
  const response = await fetch(`${BASE_URL}/services/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
    },
  });
  if (!response.ok) {
    throw new Error('Failed to delete service');
  }
};


// Fetch all incidents
export const fetchIncidents = async (token) => {
  const response = await fetch(`${BASE_URL}/incidents`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch incidents');
  }

  const data = await response.json();

  return data.data; // Adjust based on your API response structure
};

// Add a new incident
export const addIncident = async (incidentData, token) => {
  const response = await fetch(`${BASE_URL}/incidents`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(incidentData),
  });

  if (!response.ok) {
    throw new Error('Failed to create incident');
  }

  const data = await response.json();
  return data.data; // Adjust based on your API response structure
};

// Update an existing incident
export const updateIncident = async (id, incidentData, token) => {
  const response = await fetch(`${BASE_URL}/incidents/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(incidentData),
  });

  if (!response.ok) {
    throw new Error('Failed to update incident');
  }

  const data = await response.json();
  return data.data; // Adjust based on your API response structure
};

// Delete an incident
export const deleteIncident = async (id, token) => {
  const response = await fetch(`${BASE_URL}/incidents/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to delete incident');
  }

  return; // No data to return on successful deletion
};
