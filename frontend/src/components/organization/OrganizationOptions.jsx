import { useNavigate } from 'react-router-dom';

const OrganizationOptions = () => {
  const navigate = useNavigate();

  const handleCreateOrganization = () => {
    navigate('/create-organization');
  };

  const handleJoinOrganization = () => {
    navigate('/join-organization');
  };

  return (
    <div>
      <h1>Welcome! You are not part of any organization.</h1>
      <p>Would you like to create a new organization or join an existing one?</p>
      <button onClick={handleCreateOrganization}>Create Organization</button>
      <button onClick={handleJoinOrganization}>Join Organization</button>
    </div>
  );
};

export default OrganizationOptions;
