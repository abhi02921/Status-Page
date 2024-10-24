import React, { useEffect, useState, useCallback } from 'react';
import { Container, Typography, Divider, Box, Button, Modal } from '@mui/material';
import ServiceList from './service/ServiceList';
import IncidentList from './incident/IncidentList';
import { fetchServices, fetchIncidents } from '../utils/api';
import { useAuth, OrganizationProfile } from '@clerk/clerk-react';

const Dashboard = () => {
  const [services, setServices] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const { getToken } = useAuth();

  // State to control modal visibility
  const [open, setOpen] = useState(false);

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
  }, [getToken]);

  // Use effect to load services and incidents initially
  useEffect(() => {
    loadServicesAndIncidents();
  }, [loadServicesAndIncidents]);

  // Handle modal open and close
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Container>
      {/* Navigation Bar */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" align="left" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
          Dashboard
        </Typography>
        {/* Button to open Organization Profile Modal */}
        <Button variant="contained" color="primary" onClick={handleOpen}>
          Open Organization Profile
        </Button>
      </Box>

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
          onIncidentChange={loadServicesAndIncidents}
        />
      </Box>

      {/* Modal for Organization Profile */}
      <Modal
        open={open}
        onClose={handleClose}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
          <OrganizationProfile />

      </Modal>
    </Container>
  );
};

export default Dashboard;
