# Security Policy

## 🔒 Security Overview

The MTC Event Check-In QR Tool takes security seriously. This document outlines our security practices and how to report security vulnerabilities.

## 🛡️ Security Features

### Environment Variable Security
- **Sensitive Data Protection**: API keys and URLs are handled securely
- **Environment Separation**: Different credentials for dev/staging/production
- **Client-Safe Configuration**: Only non-sensitive data exposed to browser
- **Git Protection**: Comprehensive .gitignore prevents data exposure

### Application Security
- **Input Validation**: All user inputs are validated and sanitized
- **XSS Prevention**: Proper data handling prevents cross-site scripting
- **CORS Configuration**: Configurable CORS settings for production
- **Rate Limiting**: Optional rate limiting for production environments

### Data Security
- **No Persistent Storage**: No sensitive data stored in browser
- **Secure Transmission**: HTTPS recommended for production
- **Google Sheets Integration**: Uses official Google APIs securely
- **Session-Based Storage**: Sensitive config stored in sessionStorage only

## 🔍 Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 2.0.x   | ✅ Yes             |
| 1.x.x   | ❌ No              |

## 📢 Reporting a Vulnerability

### How to Report
1. **DO NOT** create a public GitHub issue for security vulnerabilities
2. **Email**: Send details to [your-security-email@domain.com]
3. **Include**:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

### What to Expect
- **Acknowledgment**: Within 48 hours
- **Initial Assessment**: Within 1 week
- **Regular Updates**: Every week until resolved
- **Resolution**: Security fixes prioritized

### Responsible Disclosure
- Allow reasonable time for fixes before public disclosure
- Work with us to understand and resolve the issue
- Avoid accessing or modifying data that doesn't belong to you

## 🔧 Security Configuration

### Production Security Checklist

#### Environment Variables
- [ ] All sensitive data in environment variables
- [ ] No placeholder values (YOUR_SCRIPT_ID, etc.)
- [ ] Production-specific credentials configured
- [ ] Debug mode disabled (`SHOW_DEBUG_INFO=false`)
- [ ] Console logging disabled (`ENABLE_CONSOLE_LOGGING=false`)

#### Network Security
- [ ] HTTPS enabled
- [ ] CORS properly configured (`ALLOWED_ORIGINS`)
- [ ] Rate limiting enabled (`ENABLE_RATE_LIMITING=true`)
- [ ] Request timeouts configured

#### Google Sheets Security
- [ ] Separate Google Apps Script for production
- [ ] Proper Google Sheets permissions
- [ ] Script deployed with minimal access
- [ ] Regular credential rotation

#### Application Security
- [ ] Input validation enabled
- [ ] Email validation active
- [ ] XSS protection in place
- [ ] Error messages don't expose sensitive info

### Security Headers (Recommended)

Add these headers to your web server:

```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline'; connect-src 'self' https://script.google.com;
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
```

## 🚨 Security Incidents

### If You Suspect a Security Issue
1. **Immediately** change any potentially compromised credentials
2. **Review** access logs for unusual activity
3. **Report** the incident following our reporting guidelines
4. **Document** what happened for future prevention

### Common Security Risks

#### Environment Variable Exposure
- **Risk**: Sensitive data committed to Git
- **Prevention**: Use .gitignore, review commits
- **Detection**: Regular repository scans

#### Google Apps Script Compromise
- **Risk**: Unauthorized access to attendance data
- **Prevention**: Regular credential rotation, minimal permissions
- **Detection**: Monitor Google Apps Script execution logs

#### XSS Attacks
- **Risk**: Malicious script injection
- **Prevention**: Input validation, output encoding
- **Detection**: Security testing, user reports

## 🔐 Best Practices for Users

### For Developers
- Keep dependencies updated
- Use environment variables for all configuration
- Never commit sensitive data
- Regular security reviews
- Test in staging before production

### For Administrators
- Use strong, unique passwords
- Enable 2FA on Google accounts
- Regular credential rotation
- Monitor access logs
- Keep backups secure

### For End Users
- Use HTTPS URLs only
- Don't share QR codes containing sensitive data
- Report suspicious activity
- Keep browsers updated

## 📋 Security Audit Checklist

### Code Review
- [ ] No hardcoded credentials
- [ ] Proper input validation
- [ ] Error handling doesn't expose sensitive info
- [ ] Dependencies are up-to-date
- [ ] Security headers implemented

### Configuration Review
- [ ] Environment variables properly configured
- [ ] Production settings optimized for security
- [ ] Debug features disabled in production
- [ ] Logging configured appropriately

### Infrastructure Review
- [ ] HTTPS enabled
- [ ] Proper firewall rules
- [ ] Regular security updates
- [ ] Backup security verified

## 📞 Security Contacts

- **Security Team**: [security@yourdomain.com]
- **Project Maintainer**: [maintainer@yourdomain.com]
- **Emergency Contact**: [emergency@yourdomain.com]

## 📚 Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Google Apps Script Security](https://developers.google.com/apps-script/guides/security)
- [Web Security Guidelines](https://developer.mozilla.org/en-US/docs/Web/Security)

---

**Remember**: Security is everyone's responsibility. When in doubt, ask questions and err on the side of caution.
