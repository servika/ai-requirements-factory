import React from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Chip,
  Divider,
} from '@mui/material';
import { format } from 'date-fns';
import { useWizard } from '../context/WizardContext';

export default function HistoryPage() {
  const { state } = useWizard();

  const getEventColor = (type) => {
    switch (type) {
      case 'step_started':
        return 'info';
      case 'step_completed':
        return 'success';
      case 'error':
        return 'error';
      case 'completed':
        return 'success';
      default:
        return 'default';
    }
  };

  const getEventLabel = (type) => {
    switch (type) {
      case 'step_started':
        return 'Started';
      case 'step_completed':
        return 'Completed';
      case 'error':
        return 'Error';
      case 'completed':
        return 'Wizard Complete';
      default:
        return type;
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Session History
        </Typography>

        <Paper elevation={2}>
          {state.history.length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="body1" color="text.secondary">
                No events yet. Start a wizard session to see history.
              </Typography>
            </Box>
          ) : (
            <List>
              {state.history.map((event, index) => (
                <React.Fragment key={index}>
                  {index > 0 && <Divider />}
                  <ListItem>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Chip
                            label={getEventLabel(event.type)}
                            color={getEventColor(event.type)}
                            size="small"
                          />
                          {event.step && (
                            <Typography variant="body1">
                              {state.steps.find(s => s.id === event.step)?.name}
                            </Typography>
                          )}
                        </Box>
                      }
                      secondary={
                        <>
                          {format(new Date(event.timestamp), 'PPpp')}
                          {event.error && (
                            <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                              {event.error}
                            </Typography>
                          )}
                        </>
                      }
                    />
                  </ListItem>
                </React.Fragment>
              ))}
            </List>
          )}
        </Paper>
      </Box>
    </Container>
  );
}