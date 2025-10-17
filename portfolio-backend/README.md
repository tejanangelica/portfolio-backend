# Portfolio Backend API

Backend service for Angelica Tejana's portfolio contact form, designed for deployment on Render.

## Features

- Express.js server with security middleware
- Contact form email handling with Nodemailer
- Rate limiting to prevent spam
- CORS configuration for frontend integration
- Professional email templates
- Environment-based configuration

## Environment Variables

Set these in your Render dashboard:

```
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
EMAIL_FROM=your-email@gmail.com
SITE_NAME=Angelica Tejana Portfolio
PORT=3000
NODE_ENV=production
```

## Gmail Setup

1. Enable 2-Factor Authentication on your Gmail account
2. Go to Google Account settings → Security → 2-Step Verification → App passwords
3. Generate an App Password for "Mail"
4. Use this App Password as `EMAIL_PASS` (not your regular Gmail password)

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env` file from `.env.example`:
   ```bash
   cp .env.example .env
   ```

3. Fill in your environment variables in `.env`

4. Start development server:
   ```bash
   npm run dev
   ```

5. Test the API:
   - Health check: `http://localhost:3000/api/health`
   - Contact form: `POST http://localhost:3000/api/contact`

## Deployment on Render

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add environment variables in Render dashboard
6. Deploy!

## API Endpoints

### GET /
Health check for the service

### GET /api/health
Health check for the contact form API

### POST /api/contact
Submit contact form
- Body: `{ fullname, email, message }`
- Returns: `{ success: boolean, message?: string, error?: string }`

## Security Features

- Helmet.js for security headers
- CORS protection
- Rate limiting (5 requests per 15 minutes per IP)
- Input validation and sanitization
- Environment variable validation
