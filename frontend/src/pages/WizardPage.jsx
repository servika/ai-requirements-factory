import React, { useEffect } from 'react';
import {
  Container,
  Box,
  Grid,
  Typography,
  Paper,
  Button,
  Alert,
  Divider,
} from '@mui/material';
import {
  Download as DownloadIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import StepIndicator from '../components/Wizard/StepIndicator';
import StepOutput from '../components/Wizard/StepOutput';
import { useWizard } from '../context/WizardContext';

export default function WizardPage() {
  const navigate = useNavigate();
  const { state, actions } = useWizard();

  useEffect(() => {
    if (!state.systemDescription) {
      navigate('/');
      return;
    }

    // Note: First step is auto-executed by backend when wizard starts
    // No need to manually execute here
  }, [state.systemDescription, navigate]);

  const handleDownloadAll = () => {
    // Exclude Requirements Review from download
    const allOutputs = state.steps
      .filter(step => step.id !== 'requirementsReviewer')
      .map((step, index) => {
        const output = state.outputs[step.id];
        if (!output) return '';

        return `# ${step.name}\n\n${output}\n\n${'='.repeat(80)}\n\n`;
      })
      .join('');

    const fullDoc = `# Software Development Lifecycle Documentation\n\n` +
      `Generated: ${new Date().toISOString()}\n\n` +
      `## System Description\n\n${state.systemDescription}\n\n` +
      `${'='.repeat(80)}\n\n${allOutputs}`;

    const blob = new Blob([fullDoc], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'COMPLETE-DOCUMENTATION.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to start over? All progress will be lost.')) {
      actions.reset();
      navigate('/');
    }
  };

  const isComplete = state.currentStep === state.steps.length;

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <Grid container spacing={3}>
          {/* Left Sidebar - Progress */}
          <Grid item xs={12} md={3}>
            <StepIndicator />

            {/* System Description Card */}
            <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                System Description
              </Typography>
              <Typography variant="body2" sx={{
                maxHeight: 100,
                overflow: 'auto',
                fontSize: '0.875rem',
              }}>
                {state.systemDescription}
              </Typography>
            </Paper>

            {/* Actions */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={handleDownloadAll}
                disabled={Object.keys(state.outputs).length === 0}
                fullWidth
              >
                Download All
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<RefreshIcon />}
                onClick={handleReset}
                fullWidth
              >
                Start Over
              </Button>
            </Box>
          </Grid>

          {/* Main Content - Step Outputs */}
          <Grid item xs={12} md={9}>
            {state.error && (
              <Alert severity="error" sx={{ mb: 3 }} onClose={() => actions.dispatch({ type: 'SET_ERROR', payload: null })}>
                {state.error}
              </Alert>
            )}

            {isComplete && (
              <Alert severity="success" sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Wizard Completed Successfully! 🎉
                </Typography>
                <Typography variant="body2">
                  All stages have been completed. You can download the complete documentation or review individual sections below.
                </Typography>
              </Alert>
            )}

            {/* Step Outputs */}
            {state.steps.map((step, index) => (
              <StepOutput key={step.id} stepIndex={index} />
            ))}

            {/* Loading Next Step */}
            {state.isProcessing && (
              <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body1" color="text.secondary">
                  Processing step {state.currentStep + 1} of {state.steps.length}...
                </Typography>
              </Paper>
            )}
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}