# Contributing to AI Factory

Thank you for your interest in contributing to AI Factory! We welcome contributions from the community.

## Getting Started

1. Fork the repository
2. Clone your fork locally
3. Create a branch for your changes
4. Make your changes
5. Test your changes
6. Submit a pull request

## Development Setup

### Prerequisites
- Node.js 18+
- npm 9+
- Anthropic API key

### Installation

```bash
# Install dependencies
npm run install:all

# Set up environment
cp .env.example .env
# Add your ANTHROPIC_API_KEY to .env

# Run CLI mode
npm run cli

# Run web app mode
npm run dev
```

## How to Contribute

### Areas for Contribution
- Bug fixes
- New features
- Documentation improvements
- Test coverage
- Performance optimizations
- UI/UX enhancements

### Code Style
- Use ES6+ features
- Follow existing code patterns
- Add comments for complex logic
- Write meaningful commit messages

### Commit Message Format

```
type: brief description

feat: Add new feature
fix: Fix bug
docs: Update documentation
refactor: Refactor code
test: Add tests
```

## Adding New AI Agents

1. Create prompt file in `src/prompts/your-agent.js`
2. Export from `src/prompts/index.js`
3. Add to wizard steps configuration
4. Update documentation

## Pull Request Process

1. Update your branch with latest changes
2. Ensure all tests pass
3. Update documentation if needed
4. Create pull request with clear description
5. Address review feedback

## Reporting Issues

When reporting bugs, please include:
- Description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, Node version, etc.)

## Questions and Support

- Check existing documentation in `docs/`
- Search existing issues
- Open a new issue for questions

## License

By contributing, you agree that your contributions will be licensed under the GNU General Public License v3.0.

Thank you for contributing! 🚀