import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  CircularProgress,
} from '@mui/material';
import { RocketLaunch as RocketLaunchIcon } from '@mui/icons-material';
import { useWizard } from '../../context/WizardContext';

export default function SystemDescriptionForm({ onStart }) {
  const { state, actions } = useWizard();
  const [description, setDescription] = useState(state.systemDescription || '');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!description.trim()) {
      setError('Please provide a system description');
      return;
    }

    if (description.trim().length < 50) {
      setError('Please provide a more detailed description (at least 50 characters)');
      return;
    }

    setError('');
    actions.setSystemDescription(description);
    onStart(description);
  };

  const exampleDescriptions = [
    {
      title: 'E-commerce Platform',
      description: 'A modern e-commerce platform for selling handmade crafts. Users should be able to browse products, add items to cart, checkout securely, and track orders. Sellers should have a dashboard to manage inventory, process orders, and view analytics. The system needs to support multiple payment methods and integrate with shipping providers.',
    },
    {
      title: 'Task Management App',
      description: 'A collaborative task management application for remote teams. Features include project workspaces, task assignment, real-time updates, file attachments, comments, and deadline tracking. Users should be able to view tasks in multiple formats (list, board, calendar). The app needs mobile and web versions with offline support.',
    },
  ];

  return (
    <Paper elevation={2} sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
      <Box sx={{ mb: 3, textAlign: 'center' }}>
        <RocketLaunchIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
        <Typography variant="h4" gutterBottom>
          Start Your Project
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Describe the system you want to build, and our AI agents will guide you through the complete Software Development Lifecycle.
        </Typography>
      </Box>

      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          multiline
          rows={8}
          label="System Description"
          placeholder="Describe your system in detail. Include target users, main features, integrations, and any specific requirements..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={state.isProcessing}
          sx={{ mb: 2 }}
        />

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Button
          type="submit"
          variant="contained"
          size="large"
          fullWidth
          disabled={state.isProcessing || !state.isConnected}
          startIcon={state.isProcessing ? <CircularProgress size={20} /> : <RocketLaunchIcon />}
        >
          {state.isProcessing ? 'Starting...' : 'Start Wizard'}
        </Button>
      </form>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Examples
        </Typography>
        {exampleDescriptions.map((example, index) => (
          <Paper
            key={index}
            variant="outlined"
            sx={{
              p: 2,
              mb: 2,
              cursor: 'pointer',
              '&:hover': { bgcolor: 'action.hover' },
            }}
            onClick={() => setDescription(example.description)}
          >
            <Typography variant="subtitle1" fontWeight={500} gutterBottom>
              {example.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap>
              {example.description.substring(0, 100)}...
            </Typography>
          </Paper>
        ))}
      </Box>
    </Paper>
  );
}