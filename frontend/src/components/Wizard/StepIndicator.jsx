import React from 'react';
import {
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Box,
  Typography,
  Paper,
} from '@mui/material';
import { useWizard } from '../../context/WizardContext';

export default function StepIndicator() {
  const { state } = useWizard();

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Progress
      </Typography>
      <Stepper activeStep={state.currentStep} orientation="vertical">
        {state.steps.map((step, index) => (
          <Step key={step.id}>
            <StepLabel>
              <Typography variant="subtitle1" fontWeight={500}>
                {step.name}
              </Typography>
            </StepLabel>
            <StepContent>
              <Typography variant="body2" color="text.secondary">
                {step.description}
              </Typography>
            </StepContent>
          </Step>
        ))}
      </Stepper>

      {state.currentStep === state.steps.length && (
        <Box sx={{ mt: 2, p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
          <Typography variant="body1" fontWeight={500}>
            Wizard Completed! 🎉
          </Typography>
        </Box>
      )}
    </Paper>
  );
}