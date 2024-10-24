import React, { useEffect } from 'react';
import { CreateOrganization, useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

const CreateOrganizationPage = () => {
  const { user } = useUser(); // Get the current user
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user exists and has memberships
    if (user && user.organizationMemberships) {
      // If the user belongs to any organization, redirect to the dashboard
      if (user.organizationMemberships.length > 0) {
        navigate('/dashboard');
      }
    }
  }, [user, navigate]);

  return (
    <div>
      <h1>Create an Organization</h1>
      <CreateOrganization
        afterCreateOrganizationUrl="/dashboard" // Redirect after creation
        skipInvitationScreen={true} // Skip sending invitations if applicable
      />
    </div>
  );
};

export default CreateOrganizationPage;
