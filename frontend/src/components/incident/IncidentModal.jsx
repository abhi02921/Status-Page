// components/incident/IncidentModal.js
import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, Button, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import IncidentCard from './IncidentCard'; // Assuming this is your incident card component
import { fetchServices } from '../../utils/api'; // Import your API function to fetch services
import { useAuth } from '@clerk/clerk-react';
const IncidentModal = ({ open, handleClose, handleSubmit, incident }) => {
  const [formData, setFormData] = useState({
    title: '',
    status: '',
    description: '',
    service: '', // This will hold the selected service ID
  });

  const [services, setServices] = useState([]); // State to hold services
  const { getToken } = useAuth();
  // Fetch services when the modal is opened
  useEffect(() => {
    const getServices = async () => {
      try {
        const token = await getToken(); 
        const servicesData = await fetchServices(token);
         // Fetch services from your API
        if (Array.isArray(servicesData)) {
          setServices(servicesData); // Set the fetched services
        } else {
          console.error('Services data is not an array:', servicesData);
        }
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };

    if (open) { // Only fetch services if the modal is open
        getServices();
    }

    // Populate form data when editing an existing incident
    if (incident) {
      setFormData({
        title: incident.title || '',
        status: incident.status || '',
        description: incident.description || '',
        service: incident.service || '', // Assume incident object has a service property
      });
    } else {
      // Clear form for new incident
      setFormData({
        title: '',
        status: '',
        description: '',
        service: '',
      });
    }
  }, [incident, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSubmit(formData); // Pass the form data to the parent component
  };

  const statusOptions = [
    'Operational',
    'Degraded Performance',
    'Partial Outage',
    'Major Outage',
  ];

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90%',
          maxWidth: '600px',
          bgcolor: 'background.paper',
          boxShadow: 24,
          borderRadius: 2,
          p: 4,
        }}
      >
        {incident ? (
          <IncidentCard incident={incident} />
        ) : (
          <form onSubmit={handleFormSubmit} style={{ width: '100%' }}>
            <Typography variant="h6" gutterBottom>
              {incident ? 'Edit Incident' : 'Add New Incident'}
            </Typography>
            <TextField
              fullWidth
              name="title"
              label="Title"
              value={formData.title}
              onChange={handleChange}
              required
              sx={{ marginBottom: 2 }}
            />
            <FormControl fullWidth required sx={{ marginBottom: 2 }}>
              <InputLabel>Service</InputLabel>
              <Select
                name="service"
                value={formData.service}
                onChange={handleChange}
              >
                {services && services.length > 0 ? ( // Safeguard here
                  services.map((service) => (
                    <MenuItem key={service._id} value={service._id}>
                      {service.name} {/* Assuming each service has a name property */}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value="">
                    <em>No services available</em>
                  </MenuItem>
                )}
              </Select>
            </FormControl>
            <FormControl fullWidth required sx={{ marginBottom: 2 }}>
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                {statusOptions.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              name="description"
              label="Description"
              value={formData.description}
              onChange={handleChange}
              required
              sx={{ marginBottom: 2 }}
            />
            <Button type="submit" variant="contained" color="primary" fullWidth>
              {incident ? 'Update Incident' : 'Create Incident'}
            </Button>
          </form>
        )}
      </Box>
    </Modal>
  );
};

export default IncidentModal;
