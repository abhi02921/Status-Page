import React from 'react';
import {
  RedirectToSignIn,
  SignedIn,
  SignedOut,
  SignIn,
  SignUp,
  UserButton,
} from '@clerk/clerk-react';
import { Route, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import CheckOrganization from './components/organization/CheckOrganization';
import CreateOrganization from './components/organization/CreateOrganization';
import {
  Box,
  Typography,
  AppBar,
  Toolbar,
  Container,
  Paper,
  ThemeProvider,
} from '@mui/material';
import theme from './styles/theme';

// Header component
const Header = () => (
  <AppBar position="static" sx={{ marginBottom: 3 }}>
    <Toolbar>
      <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
        Status Page
      </Typography>
      <Box sx={{ ml: 2 }}>
        <UserButton />
      </Box>
    </Toolbar>
  </AppBar>
);

// Main content wrapper
const ContentWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Container maxWidth="lg">
    <Paper
      elevation={0}
      sx={{
        p: 3,
        minHeight: '80vh',
        backgroundColor: 'background.default',
      }}
    >
      {children}
    </Paper>
  </Container>
);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Box
        className="App"
        sx={{
          minHeight: '100vh',
          bgcolor: 'grey.50',
        }}
      >
        <SignedIn>
          <Header />
          <ContentWrapper>
            <Routes>
              <Route path="/" element={<CheckOrganization />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/create-organization" element={<CreateOrganization />} />
            </Routes>
          </ContentWrapper>
        </SignedIn>

        <SignedOut>
          <RedirectToSignIn />
        </SignedOut>

        {/* Public Routes for sign-in and sign-up */}
        <Routes>
          <Route
            path="/sign-in/*"
            element={
              <Container maxWidth="sm" sx={{ mt: 4 }}>
                <SignIn />
              </Container>
            }
          />
          <Route
            path="/sign-up/*"
            element={
              <Container maxWidth="sm" sx={{ mt: 4 }}>
                <SignUp />
              </Container>
            }
          />
        </Routes>
      </Box>
    </ThemeProvider>
  );
}

export default App;
