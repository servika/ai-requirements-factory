# AI Factory Web Application Setup

This guide explains how to run AI Factory as a modern web application with React frontend and Express backend.

## Architecture Overview

The web application consists of three parts:

1. **Frontend** (React + Material UI) - User interface
2. **Backend** (Express + Socket.IO) - API server and real-time communication
3. **Shared Core** (src/) - AI agents and wizard logic (used by both CLI and backend)

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│                 │         │                 │         │                 │
│  React Frontend │◄───────►│  Express API    │◄───────►│  Claude API     │
│  (Port 3001)    │ Socket  │  (Port 3000)    │         │                 │
│                 │         │                 │         │                 │
└─────────────────┘         └─────────────────┘         └─────────────────┘
        │                           │
        │                           │
        │                    ┌──────▼──────┐
        │                    │             │
        └───────────────────►│  Shared     │
                             │  Core Logic │
                             │  (src/)     │
                             └─────────────┘
```

## Quick Start

### 1. Install All Dependencies

```bash
npm run install:all
```

This installs dependencies for:
- Root project
- Frontend (React)
- Backend (Express)

### 2. Set Up Environment Variables

Make sure your `.env` file has all required variables:

```env
# Anthropic API Key (Required)
ANTHROPIC_API_KEY=your_api_key_here

# Claude Model (Optional)
CLAUDE_MODEL=claude-sonnet-4-20250514

# Server Configuration
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:3001
```

### 3. Run Development Mode

```bash
npm run dev
```

This starts both frontend and backend concurrently:
- Backend: http://localhost:3000
- Frontend: http://localhost:3001

The frontend will automatically open in your browser.

## Manual Setup

If you prefer to run frontend and backend separately:

### Start Backend

```bash
cd backend
npm install
npm start
```

Backend will run on http://localhost:3000

### Start Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend will run on http://localhost:3001

## Features

### Frontend Features

- **Modern UI**: Built with React and Material UI
- **Real-time Updates**: WebSocket integration for live progress
- **Step-by-Step Wizard**: Visual progress indicator with 6 stages
- **Interactive Review**: Accept or request changes at each step
- **Loading Indicators**: Spinners and overlays show request progress in real-time
- **Smart Navigation**: Automatically navigates to correct step when feedback is applied
- **Markdown Rendering**: Beautiful rendering of agent outputs
- **Download Options**: Download individual steps or complete documentation
- **Session History**: Track all wizard events

### Backend Features

- **RESTful API**: Standard HTTP endpoints for session management
- **WebSocket Support**: Real-time communication with frontend
- **Session Management**: In-memory session storage (can be replaced with database)
- **Error Handling**: Comprehensive error handling and logging
- **CORS Support**: Configured for local development

## API Endpoints

### REST API

- `GET /health` - Health check
- `GET /api/sessions` - Get all sessions
- `GET /api/sessions/:id` - Get session details
- `POST /api/sessions` - Create new session
- `GET /api/sessions/:id/steps/:index` - Get step output
- `GET /api/sessions/:id/download` - Download complete documentation
- `DELETE /api/sessions/:id` - Delete session

### WebSocket Events

**Client → Server:**
- `wizard:start` - Start new wizard session
- `step:execute` - Execute a step
- `step:accept` - Accept step and move to next
- `step:revise` - Request revision with feedback

**Server → Client:**
- `session:created` - Session created successfully
- `step:started` - Step execution started
- `step:navigate` - Navigate to specific step (used for feedback flow)
- `step:completed` - Step execution completed
- `step:error` - Step execution error
- `wizard:completed` - All steps completed

## Project Structure

```
AI-factory/
├── frontend/                     React application
│   ├── public/                  Static files
│   ├── src/
│   │   ├── components/          React components
│   │   │   ├── Layout/          Layout components
│   │   │   └── Wizard/          Wizard components
│   │   ├── pages/               Page components
│   │   ├── context/             React Context (state)
│   │   ├── services/            API services
│   │   ├── theme/               Material UI theme
│   │   ├── App.jsx              Main app component
│   │   └── main.jsx             Entry point
│   ├── vite.config.js           Vite configuration
│   └── package.json
│
├── backend/                      Express API server
│   ├── src/
│   │   ├── controllers/         Socket controllers
│   │   ├── routes/              REST API routes
│   │   ├── services/            Business logic
│   │   │   ├── wizard-service.js    Wizard execution
│   │   │   └── session-manager.js   Session management
│   │   └── server.js            Server entry point
│   └── package.json
│
└── src/                          Shared core logic
    ├── agents/                   AI agents
    ├── prompts/                  Agent prompts
    ├── orchestration/            Wizard logic
    ├── config/                   Configuration
    └── utils/                    Utilities
```

## Development

### Hot Reload

Both frontend and backend support hot reload:
- **Frontend**: Vite provides instant HMR
- **Backend**: Uses `--watch` flag for auto-restart

### Debugging

**Frontend:**
```bash
cd frontend
npm run dev
# Open browser DevTools
```

**Backend:**
```bash
cd backend
node --inspect src/server.js
# Attach debugger
```

## Building for Production

### Build Frontend

```bash
npm run build:frontend
```

Output: `frontend/dist/`

### Deploy

1. **Backend**: Deploy to any Node.js hosting (Heroku, AWS, DigitalOcean)
2. **Frontend**: Serve static files from `frontend/dist/` (Netlify, Vercel, S3)
3. **Environment**: Update `FRONTEND_URL` in backend `.env`

## CLI Mode (Original)

The original CLI interface is still available:

```bash
npm run cli
```

This runs the terminal-based wizard without the web interface.

## Troubleshooting

### Port Already in Use

If ports 3000 or 3001 are in use, update the ports:

**Backend** (.env):
```
PORT=3002
```

**Frontend** (vite.config.js):
```javascript
server: {
  port: 3003,
}
```

### WebSocket Connection Failed

1. Check backend is running on port 3000
2. Check CORS configuration in `backend/src/server.js`
3. Check frontend API URL in `frontend/src/context/WizardContext.jsx`

### API Key Not Found

Make sure `.env` file exists in the project root with `ANTHROPIC_API_KEY`.

### Dependencies Not Installed

Run:
```bash
npm run install:all
```

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `ANTHROPIC_API_KEY` | Yes | - | Your Anthropic API key |
| `CLAUDE_MODEL` | No | claude-sonnet-4-20250514 | Claude model to use |
| `PORT` | No | 3000 | Backend server port |
| `NODE_ENV` | No | development | Environment mode |
| `FRONTEND_URL` | No | http://localhost:3001 | Frontend URL for CORS |

## Security Considerations

### For Development

- CORS is configured for localhost
- API key is on backend only (never exposed to frontend)
- WebSocket connections are not authenticated

### For Production

Add these security measures:

1. **Authentication**: Implement user authentication
2. **Rate Limiting**: Add rate limiting to API endpoints
3. **HTTPS**: Use HTTPS for all connections
4. **Environment Variables**: Use secure environment variable management
5. **CORS**: Restrict to production frontend URL
6. **WebSocket Auth**: Add WebSocket authentication
7. **Session Storage**: Replace in-memory storage with database

## Performance

### Backend

- In-memory sessions are fast but not persistent
- Consider Redis for session storage in production
- Use PM2 for production process management

### Frontend

- Code splitting with React.lazy()
- Lazy loading for markdown rendering
- Virtualization for large outputs

## Contributing

When adding features:

1. **Frontend**: Add components in `frontend/src/components/`
2. **Backend**: Add routes in `backend/src/routes/`
3. **Core Logic**: Update `src/` for agent changes
4. **Update Both**: Changes to wizard logic affect both CLI and web app

## Support

For issues:
- Backend logs: Check terminal running `npm run backend`
- Frontend errors: Check browser console
- Network: Check browser Network tab for API/WebSocket issues

## Next Steps

- [ ] Add user authentication
- [ ] Add database for persistent storage
- [ ] Add dark mode toggle
- [ ] Add export to PDF/HTML
- [ ] Add project templates
- [ ] Add collaborative features
- [ ] Add API documentation (Swagger)
- [ ] Add unit/integration tests

---

**Enjoy building with AI Factory Web App! 🚀**