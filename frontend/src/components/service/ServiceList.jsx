import React, { useState, useEffect } from 'react';
import { Box, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ServiceCard from './ServiceCard';
import ServiceModal from './ServiceModal';
import { addService, updateService, deleteService } from '../../utils/api';
import { useAuth, useUser } from '@clerk/clerk-react';
import io from 'socket.io-client';

const ServiceList = ({ services, incidents, onServiceChange }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [serviceList, setServiceList] = useState([]);
  const { getToken } = useAuth();
  const { user } = useUser();

  const isAdmin = user?.organizationMemberships?.some(
    (membership) => membership.role === 'org:admin'
  );

  useEffect(() => {
    setServiceList(Array.isArray(services) ? services : []);
  }, [services]);

  useEffect(() => {
    // Connect to the WebSocket server
    const socket = io(process.env.REACT_APP_WEBSOCKET_URL);

    // Listen for service updates
    socket.on('service', (data) => {
      const { action, service, serviceId } = data;

      setServiceList((prevServices) => {
        if (action === 'create') {
          // Add the new service to the list
          return [...prevServices, service];
        } else if (action === 'update') {
          // Update the service in the list
          return prevServices.map((srv) =>
            srv._id === service._id ? service : srv
          );
        } else if (action === 'delete') {
          // Remove the service from the list
          return prevServices.filter((srv) => srv._id !== serviceId);
        }
        return prevServices;
      });

      // Notify the parent component of service changes
      onServiceChange();
    });

    // Cleanup on component unmount
    return () => {
      socket.disconnect();
    };
  }, [onServiceChange]);

  const handleOpen = () => {
    if (isAdmin) {
      setSelectedService(null); // Clear any selected service for creating a new one
      setModalOpen(true);
    }
  };

  const handleEdit = (service) => {
    if (isAdmin) {
      setSelectedService(service); // Set the selected service for editing
      setModalOpen(true);
    }
  };

  const handleDelete = async (serviceToDelete) => {
    if (!isAdmin) return;

    try {
      const token = await getToken(); // Get the token for authentication
      await deleteService(serviceToDelete._id, token); // Delete the service
      setServiceList((prevServices) =>
        prevServices.filter((service) => service._id !== serviceToDelete._id)
      );
      // The WebSocket will handle the real-time update, so no need to update the state manually
    } catch (error) {
      console.error('Error deleting service:', error);
    }
  };


  const handleSubmit = async (newService) => {
    if (!isAdmin) return;

    try {
      const token = await getToken(); // Get the token for authentication
      if (selectedService) {
        // If a service is selected, update the existing service
        const updatedService = await updateService(selectedService._id, newService, token);
        setServiceList((prevServices) =>
          prevServices.map((service) =>
            service._id === updatedService._id ? updatedService : service
          )
        );
      } else {
        // Otherwise, add a new service
        const addedService = await addService(newService, token);
        setServiceList((prevServices) => [...prevServices, addedService]);
      }
      // The WebSocket will handle the real-time update, so no need to update the state manually
    } catch (error) {
      console.error('Error submitting service:', error);
    }
    setModalOpen(false); // Close the modal after submission
  };

  return (
    <div>
      {isAdmin && (
        <IconButton onClick={handleOpen} color="primary" sx={{ mb: 2 }}>
          <AddIcon /> Add Service
        </IconButton>
      )}

      <ServiceModal
        open={modalOpen}
        handleClose={() => setModalOpen(false)}
        handleSubmit={handleSubmit}
        service={selectedService}
      />

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {Array.isArray(serviceList) && serviceList.length > 0 ? (
          serviceList.map((service) => (
            <ServiceCard
              key={service._id}
              service={service}
              incidents={incidents}
              onEdit={() => handleEdit(service)}
              onDelete={() => handleDelete(service)}
              canEdit={isAdmin}
            />
          ))
        ) : (
          <p>No services available.</p>
        )}
      </Box>
    </div>
  );
};

export default ServiceList;
