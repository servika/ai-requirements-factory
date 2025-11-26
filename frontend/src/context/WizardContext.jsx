import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { io } from 'socket.io-client';

const WizardContext = createContext();

const STEPS = [
  {
    id: 'businessAnalyst',
    name: 'Requirements & User Stories',
    description: 'Business Analyst creates comprehensive user stories',
  },
  {
    id: 'requirementsReviewer',
    name: 'Requirements Review',
    description: 'Review and validate requirements completeness',
  },
  {
    id: 'technicalArchitect',
    name: 'Technical Architecture',
    description: 'Design system architecture and tech stack',
  },
  {
    id: 'technicalDesigner',
    name: 'Technical Design',
    description: 'Detailed component and API specifications',
  },
  {
    id: 'testingStrategist',
    name: 'Testing Strategy',
    description: 'Comprehensive testing approach',
  },
  {
    id: 'taskPlanner',
    name: 'Task Planner & Implementation Plan',
    description: 'Prepare tasks for GenAI code generation',
  },
  {
    id: 'sdlcTaskAllocator',
    name: 'SDLC Task Allocation',
    description: 'Create role-specific tasks for SDLC experts',
  },
];

const initialState = {
  sessionId: null,
  systemDescription: '',
  currentStep: 0,
  steps: STEPS,
  outputs: {},
  isProcessing: false,
  isConnected: false,
  error: null,
  history: [],
};

function wizardReducer(state, action) {
  switch (action.type) {
    case 'SET_SESSION_ID':
      return { ...state, sessionId: action.payload };

    case 'SET_SYSTEM_DESCRIPTION':
      return { ...state, systemDescription: action.payload };

    case 'SET_CURRENT_STEP':
      return { ...state, currentStep: action.payload };

    case 'SET_OUTPUT':
      return {
        ...state,
        outputs: {
          ...state.outputs,
          [action.payload.step]: action.payload.output,
        },
      };

    case 'SET_PROCESSING':
      return { ...state, isProcessing: action.payload };

    case 'SET_CONNECTED':
      return { ...state, isConnected: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload, isProcessing: false };

    case 'ADD_TO_HISTORY':
      return {
        ...state,
        history: [...state.history, action.payload],
      };

    case 'NEXT_STEP':
      return {
        ...state,
        currentStep: Math.min(state.currentStep + 1, state.steps.length - 1),
      };

    case 'PREVIOUS_STEP':
      return {
        ...state,
        currentStep: Math.max(state.currentStep - 1, 0),
      };

    case 'RESET':
      return { ...initialState, isConnected: state.isConnected };

    default:
      return state;
  }
}

export function WizardProvider({ children }) {
  const [state, dispatch] = useReducer(wizardReducer, initialState);
  const [socket, setSocket] = React.useState(null);

  useEffect(() => {
    // Initialize socket connection
    // In production, connect to the same host. In development, use localhost:3000
    const apiUrl = import.meta.env.VITE_API_URL || window.location.origin;
    const newSocket = io(apiUrl, {
      transports: ['websocket', 'polling'],
    });

    newSocket.on('connect', () => {
      console.log('Connected to server');
      dispatch({ type: 'SET_CONNECTED', payload: true });
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
      dispatch({ type: 'SET_CONNECTED', payload: false });
    });

    newSocket.on('session:created', ({ sessionId }) => {
      dispatch({ type: 'SET_SESSION_ID', payload: sessionId });
    });

    newSocket.on('step:started', ({ step }) => {
      dispatch({ type: 'SET_PROCESSING', payload: true });
      dispatch({
        type: 'ADD_TO_HISTORY',
        payload: { type: 'step_started', step, timestamp: new Date() },
      });
    });

    newSocket.on('step:navigate', ({ targetStep }) => {
      console.log(`Navigating to step ${targetStep}`);
      dispatch({ type: 'SET_CURRENT_STEP', payload: targetStep });
    });

    newSocket.on('step:cleared', ({ step }) => {
      console.log(`Clearing output for step: ${step}`);
      dispatch({ type: 'SET_OUTPUT', payload: { step, output: null } });
    });

    newSocket.on('step:completed', ({ step, output }) => {
      dispatch({ type: 'SET_OUTPUT', payload: { step, output } });
      dispatch({ type: 'SET_PROCESSING', payload: false });
      dispatch({
        type: 'ADD_TO_HISTORY',
        payload: { type: 'step_completed', step, timestamp: new Date() },
      });
    });

    newSocket.on('step:error', ({ step, error }) => {
      dispatch({ type: 'SET_ERROR', payload: error });
      dispatch({
        type: 'ADD_TO_HISTORY',
        payload: { type: 'error', step, error, timestamp: new Date() },
      });
    });

    newSocket.on('wizard:completed', () => {
      dispatch({
        type: 'ADD_TO_HISTORY',
        payload: { type: 'completed', timestamp: new Date() },
      });
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  const value = {
    state,
    dispatch,
    socket,
    actions: {
      setSystemDescription: (description) =>
        dispatch({ type: 'SET_SYSTEM_DESCRIPTION', payload: description }),

      nextStep: () => dispatch({ type: 'NEXT_STEP' }),

      previousStep: () => dispatch({ type: 'PREVIOUS_STEP' }),

      setCurrentStep: (step) =>
        dispatch({ type: 'SET_CURRENT_STEP', payload: step }),

      reset: () => dispatch({ type: 'RESET' }),

      startWizard: (systemDescription) => {
        if (socket && !state.isProcessing) {
          dispatch({ type: 'SET_PROCESSING', payload: true });
          socket.emit('wizard:start', { systemDescription });
        }
      },

      executeStep: (stepIndex, feedback = null) => {
        if (socket && !state.isProcessing) {
          dispatch({ type: 'SET_PROCESSING', payload: true });
          socket.emit('step:execute', { stepIndex, feedback });
        }
      },

      acceptStep: (stepIndex) => {
        if (socket) {
          socket.emit('step:accept', { stepIndex });
          dispatch({ type: 'NEXT_STEP' });
        }
      },

      requestRevision: (stepIndex, feedback) => {
        if (socket) {
          socket.emit('step:revise', { stepIndex, feedback });
        }
      },
    },
  };

  return (
    <WizardContext.Provider value={value}>{children}</WizardContext.Provider>
  );
}

export function useWizard() {
  const context = useContext(WizardContext);
  if (!context) {
    throw new Error('useWizard must be used within a WizardProvider');
  }
  return context;
}