import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';

const CheckOrganization = () => {
  const { user } = useUser(); // Get the current user
  console.log(user,"user");
  
  const navigate = useNavigate();
  
  useEffect(() => {
    if (user) {
      // Check if the user belongs to any organization
      if (user.organizationMemberships && user.organizationMemberships.length > 0) {
        // If the user belongs to an organization, redirect to the dashboard
        navigate('/dashboard');
      } else {
        // If not, redirect to the "Create Organization" page
        navigate('/create-organization');
      }
    }
  }, [user, navigate]);

  // Optionally, you can show a loading spinner while checking
  return (
    <div>
      {!user ? <p>Loading...</p> : null}
    </div>
  );
};

export default CheckOrganization;
