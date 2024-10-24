import React, { useEffect, useState, useCallback } from 'react';
import { Container, Typography, Divider, Box } from '@mui/material';
import ServiceList from './service/ServiceList';
import IncidentList from './incident/IncidentList';
import { fetchServices, fetchIncidents } from '../utils/api';
import { useAuth } from '@clerk/clerk-react';

const Dashboard = () => {
  const [services, setServices] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const { getToken } = useAuth();

  // Function to fetch services and incidents, memoized with useCallback
  const loadServicesAndIncidents = useCallback(async () => {
    console.log("Fetching services and incidents..."); // Debug log
    try {
      const token = await getToken();
      const serviceData = await fetchServices(token);
      setServices(serviceData);

      const incidentData = await fetchIncidents(token);
      setIncidents(incidentData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, [getToken]); // Dependencies: any variables or functions used inside the function

  // Use effect to load services and incidents initially
  useEffect(() => {
    loadServicesAndIncidents();
  }, [loadServicesAndIncidents]); // Now the dependency is the memoized function

  return (
    <Container>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h2" align="left" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 1 }}>
          Services
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <ServiceList services={services} incidents={incidents} onServiceChange={loadServicesAndIncidents} />
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h2" align="left" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 1 }}>
          Incidents
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <IncidentList 
          incidents={incidents} 
          onIncidentChange={loadServicesAndIncidents} // Pass the callback
        />
      </Box>
    </Container>
  );
};

export default Dashboard;
