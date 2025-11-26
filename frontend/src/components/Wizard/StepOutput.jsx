import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  ButtonGroup,
  IconButton,
  Collapse,
  Alert,
  CircularProgress,
  Divider,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Edit as EditIcon,
  Download as DownloadIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useWizard } from '../../context/WizardContext';

export default function StepOutput({ stepIndex }) {
  const { state, actions } = useWizard();
  const [feedback, setFeedback] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [expanded, setExpanded] = useState(true);

  const step = state.steps[stepIndex];
  const output = state.outputs[step.id];

  const handleAccept = () => {
    actions.acceptStep(stepIndex);
    setShowFeedback(false);
    setFeedback('');
  };

  const handleRevise = () => {
    if (!feedback.trim()) {
      return;
    }
    actions.requestRevision(stepIndex, feedback);
    setFeedback('');
    setShowFeedback(false);
  };

  const handleDownload = () => {
    const blob = new Blob([output], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${stepIndex + 1}-${step.id}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!output) {
    if (state.isProcessing && state.currentStep === stepIndex) {
      return (
        <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
          <CircularProgress sx={{ mb: 2 }} />
          <Typography variant="h6">
            {step.name} is working...
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This may take 90-120 seconds
          </Typography>
        </Paper>
      );
    }
    return null;
  }

  return (
    <Paper elevation={2} sx={{ mb: 3, position: 'relative' }}>
      {/* Loading Overlay */}
      {state.isProcessing && state.currentStep === stepIndex && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: 'rgba(255, 255, 255, 0.9)',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 1,
          }}
        >
          <CircularProgress size={60} sx={{ mb: 2 }} />
          <Typography variant="h6" sx={{ mb: 1 }}>
            {step.name} is working...
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Processing your request, this may take 90-120 seconds
          </Typography>
        </Box>
      )}

      {/* Header */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          bgcolor: 'primary.main',
          color: 'white',
        }}
      >
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6">
            {step.name}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            {step.description}
          </Typography>
        </Box>

        <IconButton
          color="inherit"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>

      {/* Content */}
      <Collapse in={expanded}>
        <Box sx={{ p: 3 }}>
          {/* Output */}
          <Box
            sx={{
              maxHeight: 500,
              overflow: 'auto',
              bgcolor: 'grey.50',
              p: 2,
              borderRadius: 1,
              mb: 2,
              '& pre': {
                bgcolor: 'grey.200',
                p: 1,
                borderRadius: 1,
                overflow: 'auto',
              },
              '& code': {
                bgcolor: 'grey.200',
                px: 0.5,
                borderRadius: 0.5,
              },
            }}
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {output}
            </ReactMarkdown>
          </Box>

          {/* Actions */}
          {state.currentStep === stepIndex && !state.isProcessing && (
            <>
              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<CheckCircleIcon />}
                  onClick={handleAccept}
                  fullWidth
                >
                  Accept & Continue
                </Button>

                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={() => setShowFeedback(!showFeedback)}
                  fullWidth
                >
                  Request Changes
                </Button>

                <IconButton
                  color="primary"
                  onClick={handleDownload}
                >
                  <DownloadIcon />
                </IconButton>
              </Box>

              {/* Feedback Form */}
              <Collapse in={showFeedback}>
                <Alert severity="info" sx={{ mb: 2 }}>
                  Provide specific feedback about what you'd like to change or improve.
                </Alert>

                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Feedback"
                  placeholder="Please add more details about error handling..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  sx={{ mb: 2 }}
                />

                <ButtonGroup fullWidth>
                  <Button
                    variant="contained"
                    onClick={handleRevise}
                    disabled={!feedback.trim() || state.isProcessing}
                    startIcon={state.isProcessing ? <CircularProgress size={20} color="inherit" /> : null}
                  >
                    {state.isProcessing ? 'Processing...' : 'Submit Feedback'}
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setShowFeedback(false);
                      setFeedback('');
                    }}
                    disabled={state.isProcessing}
                  >
                    Cancel
                  </Button>
                </ButtonGroup>
              </Collapse>
            </>
          )}

          {/* Accepted Badge */}
          {state.currentStep > stepIndex && (
            <Alert severity="success" icon={<CheckCircleIcon />}>
              Step completed and accepted
            </Alert>
          )}
        </Box>
      </Collapse>
    </Paper>
  );
}