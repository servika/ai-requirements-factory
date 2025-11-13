# Quick Start Guide

Get up and running with AI Factory in 5 minutes.

## Prerequisites

- Node.js 18+ installed
- Anthropic API key ([Get one here](https://console.anthropic.com/))

## Setup (2 minutes)

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure API key**

   Choose one method:

   **A. Create .env file** (Recommended)
   ```bash
   cp .env.example .env
   # Edit .env and add your API key
   ```

   **B. Export environment variable**
   ```bash
   export ANTHROPIC_API_KEY=sk-ant-...
   ```

   **C. Pass as argument**
   ```bash
   npm start sk-ant-...
   ```

## Run (1 minute)

```bash
npm start
```

## Use (5-15 minutes)

1. **Enter system description** when prompted

   Example:
   ```
   A task management app for teams with real-time collaboration,
   file attachments, and multiple view types (list, board, calendar)
   ```

2. **Review each stage**
   - Read the AI agent's output
   - Choose option 1 to accept and continue
   - Or option 2 to request changes

3. **Access your documentation**
   ```bash
   ls output/
   ```

## Example Session

```bash
$ npm start

# Follow the prompts:
System Description: A recipe sharing platform...

# Stage 1: Review requirements
Your choice (1/2/3): 1

# Stage 2: Review requirements review
Your choice (1/2/3): 1

# Stage 3: Review architecture
Your choice (1/2/3): 1

# Stage 4: Review technical design
Your choice (1/2/3): 1

# Stage 5: Review testing strategy
Your choice (1/2/3): 1

# Done! Check output/ directory
```

## Output Files

After completion, find these in `output/`:

- `1-businessAnalyst.md` - User stories and requirements
- `2-requirementsReviewer.md` - Requirements review
- `3-technicalArchitect.md` - System architecture
- `4-technicalDesigner.md` - Technical design details
- `5-testingStrategist.md` - Testing strategy
- `COMPLETE-DOCUMENTATION.md` - Everything combined

## Tips

- Be specific in your system description
- Include user types, main features, and any integrations
- Don't hesitate to request changes (option 2)
- Each stage takes 1-5 minutes to generate
- You can quit anytime (option 3) - progress is saved

## Need Help?

- See [../README.md](../README.md) for detailed documentation
- See [EXAMPLES.md](EXAMPLES.md) for sample system descriptions
- Check your API key is valid if you get authentication errors

## Common Issues

**"ANTHROPIC_API_KEY is required"**
- Make sure you've set the API key using one of the three methods above

**Long wait times**
- This is normal, complex outputs take 30-60 seconds
- Check your internet connection

**Want to start over?**
- Just run `npm start` again
- Previous outputs remain in `output/` directory (timestamped)

---

**You're ready! Run `npm start` to begin.**