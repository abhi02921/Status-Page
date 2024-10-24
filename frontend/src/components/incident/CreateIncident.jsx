import React, { useEffect, useState } from 'react';
import { TextField, Button, Box, MenuItem, CircularProgress } from '@mui/material';
import { useApi } from '../../utils/api'; // Import the useApi hook
import { useAuth } from '@clerk/clerk-react'; // Import the useAuth hook to get the token

const CreateIncident = () => {
  const [incidentTitle, setIncidentTitle] = useState('');
  const [incidentDescription, setIncidentDescription] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [services, setServices] = useState([]); // State to hold services
  const { fetchServices, createIncident, loading } = useApi(); // Destructure the functions from the useApi hook
  const { getToken } = useAuth(); // Get the getToken function from useAuth

  useEffect(() => {
    const loadServices = async () => {
      const token = await getToken(); // Get the token here
      const fetchedServices = await fetchServices(token); // Fetch services when component mounts
      setServices(fetchedServices); // Set the fetched services in state
    };
    
    loadServices();
  }, [fetchServices, getToken]); // Dependency array

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = await getToken(); // Get the token here
      await createIncident({
        title: incidentTitle,
        description: incidentDescription,
        serviceId: selectedService
      }, token); // Pass token to createIncident
      // Clear the form fields
      setIncidentTitle('');
      setIncidentDescription('');
      setSelectedService('');
      // Optionally, refresh incidents list here or notify user
    } catch (error) {
      console.error('Error creating incident:', error);
      // Optionally, show error message to the user
    }
  };

  if (loading) {
    return <CircularProgress />; // Show loading spinner while waiting for the token
  }

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <TextField
        label="Incident Title"
        value={incidentTitle}
        onChange={(e) => setIncidentTitle(e.target.value)}
        required
        fullWidth
      />
      <TextField
        label="Description"
        value={incidentDescription}
        onChange={(e) => setIncidentDescription(e.target.value)}
        required
        fullWidth
        multiline
        rows={4}
      />
      <TextField
        label="Select Service"
        value={selectedService}
        onChange={(e) => setSelectedService(e.target.value)}
        required
        fullWidth
        select
      >
        {services.map((service) => (
          <MenuItem key={service.id} value={service.id}>
            {service.name}
          </MenuItem>
        ))}
      </TextField>
      <Button type="submit" variant="contained">Create Incident</Button>
    </Box>
  );
};

export default CreateIncident;
