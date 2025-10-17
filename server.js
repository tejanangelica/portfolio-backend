const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Rate limiting - prevent spam
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    success: false,
    error: 'Too many contact form submissions, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// CORS configuration - Allow your Vercel domain and local development
const allowedOrigins = [
  'https://portfolio-frontend-tejana.vercel.app',
  'https://tejana-portfolio.vercel.app',
  'http://localhost:3000',
  'http://localhost:5500',
  'http://127.0.0.1:5500',
  'http://127.0.0.1:3000'
];

// Add any custom domain if specified in environment
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(cors({
  origin: function (origin, callback) {
    console.log('CORS check for origin:', origin);

    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      console.log('No origin - allowing request');
      return callback(null, true);
    }

    if (allowedOrigins.indexOf(origin) !== -1) {
      console.log('Origin allowed:', origin);
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      console.log('Allowed origins:', allowedOrigins);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true,
  optionsSuccessStatus: 200 // Some legacy browsers choke on 204
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Handle preflight requests manually
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
    res.header('Access-Control-Allow-Credentials', 'true');
    return res.status(200).end();
  }
  next();
});

// Apply rate limiting to contact form endpoint
app.use('/api/contact', limiter);

// Health check endpoint
app.get('/', (req, res) => {
  console.log('Health check requested from:', req.ip);
  res.status(200).json({
    status: 'OK',
    message: 'Portfolio Backend API is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.get('/api/health', (req, res) => {
  console.log('API health check requested from:', req.ip);
  res.status(200).json({
    status: 'OK',
    message: 'Contact form API is ready',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    emailConfigured: !!(process.env.EMAIL_USER && process.env.EMAIL_PASS)
  });
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  try {
    console.log('Contact form submission received from:', req.ip);
    console.log('Request headers:', req.headers);
    console.log('Request body:', req.body);

    // Check for required environment variables
    const requiredEnvVars = ['EMAIL_USER', 'EMAIL_PASS', 'SITE_NAME', 'EMAIL_FROM'];
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      console.error('Missing environment variables:', missingVars);
      return res.status(500).json({
        success: false,
        error: 'Server configuration error. Please contact the administrator.'
      });
    }

    const { fullname, email, message } = req.body;

    // Validation
    if (!fullname || !email || !message) {
      console.log('Validation failed - missing fields');
      return res.status(400).json({
        success: false,
        error: 'All fields are required'
      });
    }

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('Validation failed - invalid email format');
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid email address'
      });
    }

    // Sanitize inputs
    const sanitizedData = {
      fullname: fullname.trim().substring(0, 100),
      email: email.trim().toLowerCase().substring(0, 100),
      message: message.trim().substring(0, 1000)
    };

    console.log('Creating email transporter...');
    console.log('Email config check:');
    console.log('- EMAIL_USER:', process.env.EMAIL_USER ? 'Set' : 'NOT SET');
    console.log('- EMAIL_PASS:', process.env.EMAIL_PASS ? `Set (${process.env.EMAIL_PASS.length} chars)` : 'NOT SET');
    console.log('- EMAIL_HOST:', process.env.EMAIL_HOST);
    console.log('- EMAIL_PORT:', process.env.EMAIL_PORT);

    // Create nodemailer transporter with explicit configuration
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT) || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // Verify transporter
    try {
      await transporter.verify();
      console.log('Email transporter verified successfully');
    } catch (verifyError) {
      console.error('Email transporter verification failed:');
      console.error('Error code:', verifyError.code);
      console.error('Error message:', verifyError.message);
      console.error('Full error:', verifyError);
      return res.status(500).json({
        success: false,
        error: 'Email service is currently unavailable. Please try again later.'
      });
    }

    // Email content
    const mailOptions = {
      from: `"${process.env.SITE_NAME} Contact Form" <${process.env.EMAIL_FROM}>`,
      to: process.env.EMAIL_USER,
      subject: `New Contact - ${sanitizedData.fullname}`,
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Contact Form Submission</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f7fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6;">
          <div style="max-width: 600px; margin: 32px auto; background-color: #ffffff; border-radius: 16px; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.06), 0 2px 8px rgba(0, 0, 0, 0.04); overflow: hidden; border: 1px solid #e2e8f0;">

            <!-- Header -->
            <div style="background: linear-gradient(135deg, #ffdb70 0%, #ffd93d 100%); padding: 40px; text-align: center; border-left: 6px solid #f59e0b; position: relative;">
              <h1 style="margin: 0; color: #1a202c; font-size: 28px; font-weight: 700; letter-spacing: -0.8px; line-height: 1.2;">
                New Contact
              </h1>
              <p style="margin: 12px 0 0 0; color: #2d3748; font-size: 15px; font-weight: 500; opacity: 0.8;">
                ${process.env.SITE_NAME}
              </p>
            </div>

            <!-- Content -->
            <div style="padding: 40px;">

              <!-- Contact Info Card -->
              <div style="background: linear-gradient(135deg, #fffbf0 0%, #fef7e0 100%); border: 1px solid #fed7aa; border-radius: 16px; padding: 32px; margin-bottom: 32px; border-left: 5px solid #ffdb70; box-shadow: 0 2px 8px rgba(255, 219, 112, 0.1);">
                <table cellpadding="0" cellspacing="0" border="0" style="width: 100%;">
                  <tr>
                    <td style="text-align: left; vertical-align: top;">
                      <h2 style="margin: 0 0 12px 0; color: #1a202c; font-size: 24px; font-weight: 700; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; line-height: 1.2; letter-spacing: -0.5px;">
                        ${sanitizedData.fullname}
                      </h2>
                      <div style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px 16px; display: inline-block; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);">
                        <table cellpadding="0" cellspacing="0" border="0">
                          <tr>
                            <td style="vertical-align: middle; padding-right: 8px;">
                              <div style="width: 16px; height: 16px; background-color: #ffdb70; border-radius: 3px; display: inline-block; text-align: center; line-height: 16px;">
                                <span style="font-size: 10px; color: #1a202c; font-weight: 600;">@</span>
                              </div>
                            </td>
                            <td style="vertical-align: middle;">
                              <a href="mailto:${sanitizedData.email}" style="color: #3182ce; text-decoration: none; font-size: 15px; font-weight: 500; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;">
                                ${sanitizedData.email}
                              </a>
                            </td>
                          </tr>
                        </table>
                      </div>
                    </td>
                  </tr>
                </table>
              </div>

              <!-- Message Content -->
              <div style="margin-bottom: 36px;">
                <div style="margin-bottom: 16px;">
                  <h3 style="margin: 0; color: #1a202c; font-size: 18px; font-weight: 600; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; letter-spacing: -0.3px;">
                    Message
                  </h3>
                </div>
                <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 28px; position: relative;">
                  <div style="position: absolute; top: 0; left: 0; width: 4px; height: 100%; background: linear-gradient(180deg, #ffdb70 0%, #ffd93d 100%); border-radius: 2px 0 0 2px;"></div>
                  <p style="margin: 0; color: #2d3748; font-size: 16px; line-height: 1.7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif; letter-spacing: 0.01em; word-wrap: break-word; white-space: pre-wrap; font-weight: 400;">
                    ${sanitizedData.message}
                  </p>
                </div>
              </div>

              <!-- Quick Actions -->
              <div style="text-align: center; margin-bottom: 32px;">
                <a href="mailto:${sanitizedData.email}?subject=Re: Your message to ${process.env.SITE_NAME}"
                   style="display: inline-block; background: linear-gradient(135deg, #ffdb70 0%, #ffd93d 100%); color: #1a202c; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 15px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; box-shadow: 0 4px 12px rgba(255, 219, 112, 0.3); border: 1px solid #fed7aa;">
                  Reply to ${sanitizedData.fullname.split(' ')[0]}
                </a>
              </div>

            </div>

            <!-- Footer -->
            <div style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); padding: 24px 40px; border-top: 1px solid #e2e8f0;">
              <div style="text-align: center;">
                <div style="display: inline-block; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 6px; padding: 8px 12px; margin-bottom: 8px;">
                  <p style="margin: 0; color: #4a5568; font-size: 13px; font-weight: 500; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;">
                    ${new Date().toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <p style="margin: 0; color: #718096; font-size: 12px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;">
                  Sent via ${process.env.SITE_NAME} Contact Form
                </p>
              </div>
            </div>

          </div>
        </body>
        </html>
      `,
      text: `
New Contact Form Submission

Name: ${sanitizedData.fullname}
Email: ${sanitizedData.email}

Message:
${sanitizedData.message}

Submitted on: ${new Date().toLocaleString()}
      `
    };

    // Send email
    console.log('Sending email...');
    const info = await transporter.sendMail(mailOptions);

    console.log('Email sent successfully:', info.messageId);

    res.status(200).json({
      success: true,
      message: 'Your message has been sent successfully!'
    });

  } catch (error) {
    console.error('Error in contact API:', error);

    // Handle specific error types
    if (error.code === 'EAUTH') {
      return res.status(500).json({
        success: false,
        error: 'Email authentication failed. Please contact the administrator.'
      });
    }

    if (error.code === 'ECONNECTION') {
      return res.status(500).json({
        success: false,
        error: 'Unable to connect to email service. Please try again later.'
      });
    }

    // Generic error response
    res.status(500).json({
      success: false,
      error: 'Failed to send message. Please try again later.'
    });
  }
});

// Handle 404 for unknown routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global error handler:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// Start server - Backend repository sync test
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Portfolio Backend API running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Allowed CORS origins:`, allowedOrigins);

  // Log important environment variables (without sensitive data)
  console.log('Configuration:');
  console.log(`- EMAIL_HOST: ${process.env.EMAIL_HOST || 'Not set'}`);
  console.log(`- EMAIL_PORT: ${process.env.EMAIL_PORT || 'Not set'}`);
  console.log(`- EMAIL_USER: ${process.env.EMAIL_USER ? 'Set' : 'Not set'}`);
  console.log(`- EMAIL_PASS: ${process.env.EMAIL_PASS ? 'Set' : 'Not set'}`);
  console.log(`- SITE_NAME: ${process.env.SITE_NAME || 'Not set'}`);
});

module.exports = app;
