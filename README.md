# CleverPartyThrower

A web app designed to help organise events with your friends

Can be self hosted with a simple docker compose or on kubernetes.
For more info on the kubernetes hosting see https://github.com/craftbrak/Clever-party-thrower-infrastructure

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

1. Clone the repository containing the `docker-compose.yml` file.

2. Create a `.env` file in the same directory as the `docker-compose.yml` file with the following variables:

```
CPT_API_DOMAIN=api.yourdomain.com
CPT_WEB_DOMAIN=web.yourdomain.com
ACME_EMAIL=your_email@example.com
API_URL=https://api.yourdomain.com
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_postgres_password
```

Replace `yourdomain.com` with your actual domain, and set the `POSTGRES_PASSWORD` to a secure password.

3. Create the following secret files with your sensitive information:

- `db_password.txt`: Contains the PostgreSQL password
- `jwt_secret.txt`: Contains the JWT secret
- `jwt_refresh_secret.txt`: Contains the JWT refresh secret
- `email_password.txt`: Contains the email password
- `cf_api_key.txt`: Contains the Cloudflare API key

Place these files in the same directory as the `docker-compose.yml` file.

4. Run `docker-compose up -d` to start the containers with the new configuration. The services will be accessible at the
   following URLs:

- CPT-API: `https://api.yourdomain.com`
- CPT-Web: `https://web.yourdomain.com`

## Customization

The following environment variables can be customized in the `.env` file:

- `CPT_API_DOMAIN`: Domain name for the CPT-API service
- `CPT_WEB_DOMAIN`: Domain name for the CPT-Web service
- `ACME_EMAIL`: Email address used for Let's Encrypt certificate registration
- `API_URL`: API URL for the CPT-Web service
- `POSTGRES_USER`: PostgreSQL user (default: `postgres`)
- `POSTGRES_PASSWORD`: PostgreSQL password

The following environment variables can be customized directly in the `docker-compose.yml` file for the CPT-API service:

- `EMAIL_ADDRESS`: Email address used for sending emails
- `TWO_FACTOR_AUTHENTICATION_APP_NAME`: App name displayed for two-factor authentication
- `JWT_REFRESH_TTL`: JWT refresh token time-to-live
- `JWT_AUTH_TTL`: JWT authentication token time-to-live
- `DATABASE_NAME`: Name of the PostgreSQL database
- `DATABASE_USER`: PostgreSQL database user
- `DATABASE_PORT`: PostgreSQL database port
- `DATABASE_HOST`: PostgreSQL database host
- `PORT`: Port for the CPT-API service

## Troubleshooting

If you encounter any issues or need further assistance, consult the official documentation for each service or consult
the project repository for additional support.