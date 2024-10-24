import React from 'react';
import { Box, Typography, Modal, Button } from '@mui/material';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend } from 'chart.js';

// Register necessary components
ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

const IncidentHistoryChart = ({ open, onClose, incidents }) => {
  const prepareChartData = () => {
    const labels = incidents.map(incident => new Date(incident.createdAt).toLocaleDateString());
    const dataPoints = incidents.map(incident => {
      switch (incident.status) {
        case 'Operational':
          return 0; // Operational
        case 'Degraded Performance':
          return 1; // Degraded Performance
        case 'Partial Outage':
          return 2; // Partial Outage
        case 'Major Outage':
          return 3; // Major Outage
        default:
          return 0; // Default to Operational
      }
    });

    return {
      labels,
      datasets: [
        {
          label: 'Incident Status Over Time',
          data: dataPoints,
          borderColor: 'rgba(75,192,192,1)',
          backgroundColor: 'rgba(75,192,192,0.2)',
          pointBackgroundColor: 'rgba(75,192,192,1)',
        },
      ],
    };
  };

  const chartData = prepareChartData();

  // Tooltip callback to show status descriptions
  const tooltipOptions = {
    callbacks: {
      label: (tooltipItem) => {
        const index = tooltipItem.dataIndex;
        const status = incidents[index]?.status;
        const description = incidents[index]?.description || "No description available.";
        return [`Status: ${status}`, `Description: ${description}`];
      },
    },
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 600,
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography id="modal-title" variant="h6" component="h2">
          Incident Status History
        </Typography>
        <Line data={chartData} options={{ plugins: { tooltip: tooltipOptions } }} />
        <Button onClick={onClose} sx={{ mt: 2 }}>
          Close
        </Button>
      </Box>
    </Modal>
  );
};

export default IncidentHistoryChart;
