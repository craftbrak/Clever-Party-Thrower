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
CPT_API_DOMAIN=api.yourdomain.com
CPT_WEB_DOMAIN=web.yourdomain.com
ACME_EMAIL=your_email@example.com
API_URL=https://api.yourdomain.com
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_postgres_password
EMAIL_ADDRESS=your_email@example.com
TWO_FACTOR_AUTHENTICATION_APP_NAME=YourAppName
JWT_REFRESH_TTL=604800
JWT_AUTH_TTL=86400
```

Replace `yourdomain.com` with your actual domain, and set the `POSTGRES_PASSWORD` to a secure password. Update the other variables as needed.

3. Create the following secret files with your sensitive information:

- `db_password.txt`: Contains the PostgreSQL password
- `jwt_secret.txt`: Contains the JWT secret
- `jwt_refresh_secret.txt`: Contains the JWT refresh secret
- `email_password.txt`: Contains the email password
- `cf_api_key.txt`: Contains the Cloudflare API key

Place these files in the same directory as the `docker-compose.yml` file.

4. Run `docker-compose up -d` to start the containers with the new configuration. The services will be accessible at the following URLs:

- CPT-API: `https://api.yourdomain.com`
- CPT-Web: `https://web.yourdomain.com`

## Example .env file

```
CPT_API_DOMAIN=api.example.com
CPT_WEB_DOMAIN=web.example.com
ACME_EMAIL=you@example.com
API_URL=https://api.example.com
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_postgres_password
EMAIL_ADDRESS=you@example.com
TWO_FACTOR_AUTHENTICATION_APP_NAME=ExampleApp
JWT_REFRESH_TTL=6h
JWT_AUTH_TTL=8m
```

Replace the example values with your actual information.

## Customization

You can customize the environment variables in the `.env` file as needed. See the provided example `.env` file for reference.

## Troubleshooting

If you encounter any issues or need further assistance, consult the official documentation for each service or consult the project repository for additional support.
