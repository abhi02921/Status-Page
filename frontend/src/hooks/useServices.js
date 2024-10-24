import { useState, useEffect } from 'react';
import { useApi } from '../utils/api';

export const useServices = () => {
  const { fetchServices, fetchIncidents } = useApi(); // Use the custom api hook
  const [services, setServices] = useState([]);
  const [incidents, setIncidents] = useState([]);

  const loadServices = async () => {
    const data = await fetchServices();
    setServices(data);
  };

  const loadIncidents = async () => {
    const data = await fetchIncidents();
    setIncidents(data);
  };

  return {
    services,
    incidents,
    fetchServices: loadServices,
    fetchIncidents: loadIncidents,
  };
};
