# Contributing to MTC Event Check-In QR Tool

Thank you for your interest in contributing to the MTC Event Check-In QR Tool! This document provides guidelines for contributing to this project.

## 🤝 How to Contribute

### Reporting Issues

1. **Check existing issues** first to avoid duplicates
2. **Use the issue template** when creating new issues
3. **Provide detailed information** including:
   - Environment details (browser, OS)
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable

### Submitting Changes

1. **Fork the repository**
2. **Create a feature branch** from `main`
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes** following our coding standards
4. **Test your changes** thoroughly
5. **Update documentation** if needed
6. **Submit a pull request**

## 📋 Development Setup

### Prerequisites
- Modern web browser
- Text editor or IDE
- Basic knowledge of HTML, CSS, JavaScript
- Node.js (for deployment scripts)

### Local Development
```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/mtc-event-checkin-qr-tool.git
cd mtc-event-checkin-qr-tool

# Set up environment
cp .env.example .env.development
# Edit .env.development with your configuration

# Deploy to development
node deploy.js development

# Start local server
python -m http.server 8000
```

## 🎯 Coding Standards

### JavaScript
- Use ES6+ features
- Follow consistent naming conventions
- Add comments for complex logic
- Use environment variables for configuration
- Handle errors gracefully

### CSS
- Follow Microsoft Fluent Design principles
- Use CSS custom properties for theming
- Maintain responsive design
- Keep selectors specific but not overly complex

### HTML
- Use semantic HTML5 elements
- Include proper meta tags
- Ensure accessibility compliance
- Validate markup

### Environment Variables
- Document new environment variables
- Provide safe defaults
- Update all environment files (.env.development, .env.staging, .env.production)
- Update documentation

## 🧪 Testing

### Manual Testing Checklist
- [ ] QR code generation works
- [ ] Form validation functions correctly
- [ ] Responsive design on different screen sizes
- [ ] Google Sheets integration (if configured)
- [ ] Environment variable loading
- [ ] Error handling

### Browser Testing
Test in these browsers:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📖 Documentation

### Required Documentation Updates
- Update README.md if adding new features
- Update ENVIRONMENT_VARIABLES.md for new config options
- Add inline code comments
- Update setup guides if process changes

### Documentation Standards
- Use clear, concise language
- Include code examples
- Provide step-by-step instructions
- Keep documentation up-to-date

## 🔒 Security Guidelines

### Sensitive Data
- Never commit sensitive data (API keys, URLs, etc.)
- Use environment variables for configuration
- Test with placeholder values
- Review .gitignore before committing

### Code Security
- Validate all user inputs
- Sanitize data before processing
- Use HTTPS in production
- Follow security best practices

## 🚀 Pull Request Process

### Before Submitting
1. **Test thoroughly** in multiple browsers
2. **Update documentation** as needed
3. **Check for sensitive data** in commits
4. **Ensure code follows standards**
5. **Verify environment variable system** works

### Pull Request Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Environment configuration change

## Testing
- [ ] Manual testing completed
- [ ] Multiple browsers tested
- [ ] Environment variables tested

## Documentation
- [ ] README updated (if needed)
- [ ] Environment variables documented (if added)
- [ ] Code comments added

## Screenshots
(If applicable)
```

## 🏷️ Versioning

We use [Semantic Versioning](https://semver.org/):
- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

## 📞 Getting Help

- **Issues**: Use GitHub issues for bugs and feature requests
- **Discussions**: Use GitHub discussions for questions
- **Documentation**: Check existing documentation first

## 🎉 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation

Thank you for contributing to the MTC Event Check-In QR Tool! 🚀
