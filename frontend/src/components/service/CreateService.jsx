import React, { useState } from 'react';
import { TextField, Button, Box, CircularProgress, Snackbar, Alert } from '@mui/material';
import { addService } from '../../utils/api'; // Import the addService function
import { useAuth } from '@clerk/clerk-react'; // Import the useAuth hook to get the token

const CreateService = () => {
  const [serviceName, setServiceName] = useState('');
  const [description, setDescription] = useState(''); // State for service description
  const [status, setStatus] = useState('Operational'); // State for service status
  const [errorMessage, setErrorMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const { getToken } = useAuth(); // Get the getToken function from useAuth

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = await getToken(); // Get the token here
      await addService({ name: serviceName, description, status }, token); // Pass token to addService
      setServiceName(''); // Clear the input field
      setDescription(''); // Clear the description field
      setStatus('Operational'); // Reset status to default
    } catch (error) {
      console.error('Error creating service:', error);
      setErrorMessage('Failed to create service. Please try again.'); // Set the error message
      setOpenSnackbar(true); // Open the snackbar for user feedback
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false); // Close the snackbar
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <TextField 
        label="Service Name" 
        value={serviceName} 
        onChange={(e) => setServiceName(e.target.value)} 
        required
        fullWidth
      />
      <TextField 
        label="Description" 
        value={description} 
        onChange={(e) => setDescription(e.target.value)} 
        required
        fullWidth
        sx={{ mt: 2 }} // Add margin to top for spacing
      />
      <TextField 
        label="Status" 
        value={status} 
        onChange={(e) => setStatus(e.target.value)} 
        required
        fullWidth
        sx={{ mt: 2 }} // Add margin to top for spacing
      />
      <Button 
        type="submit" 
        variant="contained" 
        color="primary" 
        sx={{ mt: 2 }} 
        disabled={!serviceName.trim() || !description.trim()} // Disable if input is empty
      > 
        Add Service
      </Button>

      <Snackbar 
        open={openSnackbar} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CreateService;
