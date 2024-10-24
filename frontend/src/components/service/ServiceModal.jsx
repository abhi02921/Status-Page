// ServiceModal.js
import React, { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  Button,
  TextField,
  Typography,
} from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const ServiceModal = ({ open, handleClose, handleSubmit, service }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Operational');

  useEffect(() => {
    if (service) {
      setName(service.name);
      setDescription(service.description);
      setStatus(service.status);
    } else {
      // Reset form if adding a new service
      setName('');
      setDescription('');
      setStatus('Operational');
    }
  }, [service, open]);

  const handleFormSubmit = () => {
    const newService = {
      name,
      description,
      status,
    };
    handleSubmit(newService);
    handleClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography variant="h6" component="h2" gutterBottom>
          {service ? 'Edit Service' : 'Add Service'}
        </Typography>
        <TextField
          label="Service Name"
          variant="outlined"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Description"
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Status"
          variant="outlined"
          fullWidth
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button variant="contained" color="primary" onClick={handleFormSubmit}>
          {service ? 'Update' : 'Add'} Service
        </Button>
      </Box>
    </Modal>
  );
};

export default ServiceModal;
