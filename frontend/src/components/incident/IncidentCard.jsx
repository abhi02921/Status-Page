import React from 'react';
import { Card, CardContent, Typography, IconButton, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const StyledCard = styled(Card)(({ theme }) => ({
  margin: '8px 0', // Adjust the margin for better spacing between cards
  padding: '16px',
  width: '100%', // Ensure the card takes full width
  boxShadow: theme.shadows[3],
  transition: '0.3s',
  '&:hover': {
    transform: 'scale(1.02)',
    boxShadow: theme.shadows[6],
  },
}));

const IncidentCard = ({ incident, onEdit, onDelete, canEdit }) => {
  if (!incident) {
    return null; // Handle the case of null incident
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Resolved':
        return 'green';
      case 'Ongoing':
        return 'orange';
      case 'Closed':
        return 'red';
      default:
        return 'gray';
    }
  };

  return (
    <StyledCard variant="outlined">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" component="div" gutterBottom>
          {incident.title || 'Untitled Incident'}
        </Typography>
        <Box>
          {canEdit && ( // Conditional rendering based on canEdit prop
            <>
              <IconButton size="small" onClick={onEdit} aria-label="edit">
                <EditIcon fontSize="small" />
              </IconButton>
              <Typography variant="body2" component="span" sx={{ ml: 0.5 }}>Edit</Typography>
              
              <IconButton size="small" color="error" onClick={onDelete} aria-label="delete" sx={{ ml: 2 }}>
                <DeleteIcon fontSize="small" />
              </IconButton>
              <Typography variant="body2" component="span" sx={{ ml: 0.5 }}>Delete</Typography>
            </>
          )}
        </Box>
      </Box>
      <CardContent>
        <Typography sx={{ mb: 1.5, fontWeight: 'bold', color: getStatusColor(incident.status) }}>
          Status: {incident.status || 'Unknown'}
        </Typography>
        <Typography variant="body2" color="text.secondary" noWrap>
          {incident.description || 'No description available.'}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
          Date: {incident.createdAt || 'N/A'}
        </Typography>
      </CardContent>
    </StyledCard>
  );
};

export default IncidentCard;
