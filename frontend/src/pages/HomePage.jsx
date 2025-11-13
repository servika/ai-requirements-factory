import React, { useState } from 'react';
import {
  Container,
  Box,
  Grid,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SystemDescriptionForm from '../components/Wizard/SystemDescriptionForm';
import { useWizard } from '../context/WizardContext';

export default function HomePage() {
  const navigate = useNavigate();
  const { actions, state } = useWizard();
  const [error, setError] = useState('');

  const handleStart = (description) => {
    try {
      actions.startWizard(description);
      navigate('/wizard');
    } catch (err) {
      setError(err.message || 'Failed to start wizard');
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {!state.isConnected && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            Not connected to server. Please make sure the backend is running.
          </Alert>
        )}

        <SystemDescriptionForm onStart={handleStart} />
      </Box>
    </Container>
  );
}