import React, { useState, useEffect, useCallback } from 'react';
import { Modal, Box, Typography, Button, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import IncidentCard from './IncidentCard';
import { fetchServices } from '../../utils/api';
import { useAuth } from '@clerk/clerk-react';

const IncidentModal = ({ open, handleClose, handleSubmit, incident }) => {
  const [formData, setFormData] = useState({
    title: '',
    status: '',
    description: '',
    service: '',
  });

  const [services, setServices] = useState([]);
  const { getToken } = useAuth();

  // Memoized function to fetch services
  const getServices = useCallback(async () => {
    try {
      const token = await getToken();
      const servicesData = await fetchServices(token);
      if (Array.isArray(servicesData)) {
        setServices(servicesData);
      } else {
        console.error('Services data is not an array:', servicesData);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  }, [getToken]);

  // Separate effect for fetching services
  useEffect(() => {
    if (open) {
      getServices();
    }
  }, [open, getServices]);

  // Separate effect for handling incident data
  useEffect(() => {
    if (incident) {
      setFormData({
        title: incident.title || '',
        status: incident.status || '',
        description: incident.description || '',
        service: incident.service.name || '',
      });
    } else if (!incident && open) {
      // Only reset if there's no incident and the modal is being opened
      setFormData({
        title: '',
        status: '',
        description: '',
        service: '',
      });
    }
  }, [incident, open]); // Add open to dependencies to handle both edit and create cases

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSubmit(formData);
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
        <Typography variant="h6" gutterBottom>
          {incident ? 'Edit Incident' : 'Add New Incident'}
        </Typography>
        <form onSubmit={handleFormSubmit} style={{ width: '100%' }}>
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
              {services.length > 0 ? (
                services.map((service) => (
                  <MenuItem key={service._id} value={service._id}>
                    {service.name}
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
      </Box>
    </Modal>
  );
};

export default IncidentModal;