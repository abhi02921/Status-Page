import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Box,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import IncidentHistoryChart from './IncidentHistoryChart';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import HistoryIcon from '@mui/icons-material/History';

const StyledCard = styled(Card)(({ theme }) => ({
  margin: '16px 0',
  padding: '16px',
  boxShadow: theme.shadows[3],
  transition: '0.3s',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  '&:hover': {
    transform: 'scale(1.02)',
    boxShadow: theme.shadows[6],
  },
}));

const StatusTypography = styled(Typography)(({ color }) => ({
  fontWeight: 'bold',
  color,
}));

const ActionContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '8px', // Space between buttons
  marginLeft: 'auto', // Push buttons to the right
  alignItems: 'center', // Align icons and text
}));

const ServiceCard = ({ service, incidents, onEdit, onDelete, canEdit }) => {
  const [latestIncident, setLatestIncident] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (incidents && incidents.length > 0) {
      const filteredIncidents = incidents.filter(
        (incident) => incident.service && incident.service._id === service._id
      );
      const sortedIncidents = filteredIncidents.sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      if (sortedIncidents.length > 0) {
        setLatestIncident(sortedIncidents[0]);
      }
    }
  }, [incidents, service]);

  const getIncidentStatusColor = (status) => {
    switch (status) {
      case 'Degraded Performance':
        return 'red';
      case 'Operational':
        return 'green';
      case 'Partial Outage':
        return 'orange';
      case 'Major Outage':
        return 'red';
      default:
        return 'gray';
    }
  };

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <>
      <StyledCard variant="outlined">
        <CardContent sx={{ display: 'flex', flexDirection: 'row' }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h5" component="div">
              {service.name}
            </Typography>

            {latestIncident ? (
              <>
                <StatusTypography
                  sx={{ mb: 1.5 }}
                  color={getIncidentStatusColor(latestIncident.status)}
                >
                  Latest Incident Status: {latestIncident.status}
                </StatusTypography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {latestIncident.title} - {latestIncident.description}
                </Typography>
              </>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                No incidents reported for this service.
              </Typography>
            )}
          </Box>

          {/* Action Container for actions aligned in a single line */}
          <ActionContainer>
            {canEdit && (
              <>
                <IconButton size="small" onClick={onEdit} aria-label="edit">
                  <EditIcon fontSize="small" />
                  <Typography variant="body2">Edit</Typography>
                </IconButton>
                <IconButton size="small" color="error" onClick={onDelete} aria-label="delete">
                  <DeleteIcon fontSize="small" />
                  <Typography variant="body2">Delete</Typography>
                </IconButton>
              </>
            )}
            <IconButton size="small" onClick={handleOpenModal} aria-label="history">
              <HistoryIcon fontSize="small" />
              <Typography variant="body2">History</Typography>
            </IconButton>
          </ActionContainer>
        </CardContent>
      </StyledCard>

      <IncidentHistoryChart
        open={modalOpen}
        onClose={handleCloseModal}
        incidents={incidents.filter(
          (incident) => incident.service && incident.service._id === service._id
        )}
      />
    </>
  );
};

export default ServiceCard;
