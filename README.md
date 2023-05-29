# Clever Party Thrower (CPT) Stack Deployment Guide

This guide will help you set up the CPT stack using Docker Compose. The stack includes the following services:

1. PostgreSQL database
2. CPT-API (backend API)
3. CPT-Web (frontend web application)
4. Traefik (reverse proxy and SSL/TLS certificate management)

## Prerequisites

1. Docker and Docker Compose installed on your system
2. A Cloudflare account and API key for managing DNS records
3. Domain names for CPT-API and CPT-Web services

## Setup

1. Copy the provided `docker-compose.yml` file to a new directory on your system.

2. Create a `.env` file in the same directory as the `docker-compose.yml` file with the following variables:

```

API_URL=https://api.yourdomain.com
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_postgres_password
TWO_FACTOR_AUTHENTICATION_APP_NAME=YourAppName
JWT_REFRESH_TTL=604800
JWT_AUTH_TTL=86400
JWT_SECRET=yoursupersecret
JWT_REFRESH_SECRET=yourothersupersecret
EMAIL_ADDRESS=your_email@example.com
EMAIL_PASSWORD=your_email_password
SMTP_SERVER=your_smtp_server
SMTP_PORT=your_smtp_server_port
SMTP_SECURE=true/false
```

Replace `yourdomain.com` with your actual domain, update the SMTP vars according to your SMTP server,
and set the `POSTGRES_PASSWORD` to a secure password.
Update the other variables as needed.

Place these files in the same directory as the `docker-compose.yml` file.

4. Run `docker-compose up -d` to start the containers with the new configuration. The services will be accessible at the
   following URLs:

- CPT-API: `http://localhost:8689`
- CPT-Web: `http://localhost:80`

## Example .env file

```
API_URL=https://api.yourdomain.com
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_postgres_password
TWO_FACTOR_AUTHENTICATION_APP_NAME=YourAppName
JWT_REFRESH_TTL=604800
JWT_AUTH_TTL=86400
JWT_SECRET=yoursupersecret
JWT_REFRESH_SECRET=yourothersupersecret
EMAIL_ADDRESS=your_email@example.com
EMAIL_PASSWORD=your_email_password
SMTP_SERVER=your_smtp_server
SMTP_PORT=your_smtp_server_port
SMTP_SECURE=true/false
```

Replace the example values with your actual information.

## Customization

You can customize the environment variables in the `.env` file as needed. See the provided example `.env` file for
reference.

## Troubleshooting

If you encounter any issues or need further assistance, consult the official documentation for each service or consult
the project repository for additional support.
