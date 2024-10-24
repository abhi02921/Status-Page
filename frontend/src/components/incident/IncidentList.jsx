import React, { useState, useEffect } from 'react';
import { Box, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import IncidentCard from './IncidentCard';
import IncidentModal from './IncidentModal';
import { addIncident, updateIncident, deleteIncident } from '../../utils/api';
import { useAuth, useUser } from '@clerk/clerk-react';
import io from 'socket.io-client';

const IncidentList = ({ incidents, onIncidentChange }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [incidentList, setIncidentList] = useState([]);
  const { getToken } = useAuth();
  const { user } = useUser();

  const isAdmin = user?.organizationMemberships?.some((membership) =>
    membership.role === "org:admin"
  );

  useEffect(() => {
    setIncidentList(Array.isArray(incidents) ? incidents : []);
  }, [incidents]);

  useEffect(() => {
    // Connect to the WebSocket server
    const socket = io(process.env.REACT_APP_WEBSOCKET_URL, {
      reconnectionAttempts: 5, // Number of reconnection attempts
      reconnectionDelay: 1000,
      transports: ['websocket'] // Delay between each attempt (in ms)
    });

    // Listen for incident updates
    socket.on('incident', (data) => {
      const { action, incident, incidentId } = data;

      setIncidentList((prevIncidents) => {
        if (action === 'create') {
          // Add the new incident to the list
          return [...prevIncidents, incident];
        } else if (action === 'update') {
          // Update the incident in the list
          return prevIncidents.map((inc) =>
            inc._id === incident._id ? incident : inc
          );
        } else if (action === 'delete') {
          // Remove the incident from the list
          return prevIncidents.filter((inc) => inc._id !== incidentId);
        }
        return prevIncidents;
      });

      onIncidentChange(); // Refresh the services if necessary
    });

    // Cleanup on component unmount
    return () => {
      socket.disconnect();
    };
  }, [onIncidentChange]);

  // Handle opening the modal for adding a new incident
  const handleOpen = () => {
    if (isAdmin) {
      setSelectedIncident(null); // Clear any selected incident
      setModalOpen(true); // Open the modal for creating a new incident
    }
  };

  // Handle editing an existing incident
  const handleEdit = (incident) => {
    if (isAdmin) {
      setSelectedIncident(incident); // Set the selected incident to edit
      setModalOpen(true); // Open the modal for editing
    }
  };

  // Handle submitting the form (for both add and edit operations)
  const handleSubmit = async (newIncident) => {
    if (!isAdmin) return;

    try {
      const token = await getToken(); // Get the token for authentication
      if (selectedIncident) {
        // If an incident is selected, update the existing incident
        const updatedIncident = await updateIncident(selectedIncident._id, newIncident, token);
        setIncidentList((prevIncidents) =>
          prevIncidents.map((incident) =>
            incident._id === updatedIncident._id ? updatedIncident : incident
          )
        );
      } else {
        // Otherwise, add a new incident
        const addedIncident = await addIncident(newIncident, token);
        setIncidentList((prevIncidents) => [...prevIncidents, addedIncident]);
      }
      onIncidentChange(); // Refresh the services if necessary
    } catch (error) {
      console.error('Error submitting incident:', error);
    }
    setModalOpen(false); // Close the modal after submission
  };

  // Handle deleting an incident
  const handleDelete = async (incidentToDelete) => {
    if (!isAdmin) return;

    try {
      const token = await getToken(); // Get the token for authentication
      await deleteIncident(incidentToDelete._id, token); // Delete the incident
      setIncidentList((prevIncidents) =>
        prevIncidents.filter((incident) => incident._id !== incidentToDelete._id)
      );
      onIncidentChange(); // Refresh the services if necessary
    } catch (error) {
      console.error('Error deleting incident:', error);
    }
  };

  return (
    <div>
      {isAdmin && (
        <IconButton onClick={handleOpen} color="primary" sx={{ mb: 2 }}>
          <AddIcon /> Add Incident
        </IconButton>
      )}

      <IncidentModal
        open={modalOpen}
        handleClose={() => setModalOpen(false)}
        handleSubmit={handleSubmit}
        incident={selectedIncident}
      />

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {incidentList.length > 0 ? (
          incidentList.map((incident) => (
            <IncidentCard
              key={incident._id}
              incident={incident}
              onEdit={() => handleEdit(incident)}
              onDelete={() => handleDelete(incident)}
              canEdit={isAdmin}
            />
          ))
        ) : (
          <p>No incidents available.</p>
        )}
      </Box>
    </div>
  );
};

export default IncidentList;
