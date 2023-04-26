# Clever Party Thrower (CPT) Stack Deployment Guide for Kubernetes

This guide will help you set up the CPT stack on Kubernetes. The stack includes the following services:

1. PostgreSQL database
2. CPT-API (backend API)
3. CPT-Web (frontend web application)
4. Traefik (reverse proxy and SSL/TLS certificate management)

## Prerequisites

1. A Kubernetes cluster
2. `kubectl` command-line tool installed and configured
3. A Cloudflare account and API key for managing DNS records
4. Domain names for CPT-API and CPT-Web services

## Deployment Steps

1. Replace the placeholder values in the Kubernetes manifest files for the following:

    - PostgreSQL password
    - CPT-API secrets (database password, JWT secret, JWT refresh secret, email password)
    - Cloudflare API key
    - Domain names for CPT-API and CPT-Web services
    - Email address for Let's Encrypt certificate registration
    - Frontend URL for the CPT-Web service

2. Apply the Kubernetes manifests in the following order:

    - PostgreSQL resources:
      ```
      kubectl apply -f postgres-secret.yaml
      kubectl apply -f postgres-deployment.yaml
      kubectl apply -f postgres-service.yaml
      ```
    - CPT-API resources:
      ```
      kubectl apply -f cpt-api-secrets.yaml
      kubectl apply -f cpt-api-configmap.yaml
      kubectl apply -f cpt-api-deployment.yaml
      kubectl apply -f cpt-api-service.yaml
      ```
    - CPT-Web resources:
      ```
      kubectl apply -f cpt-web-configmap.yaml
      kubectl apply -f cpt-web-deployment.yaml
      kubectl apply -f cpt-web-service.yaml
      ```
    - Traefik resources:
      ```
      kubectl apply -f traefik-cloudflare-api-key.yaml
      kubectl apply -f traefik-configmap.yaml
      kubectl apply -f traefik-deployment.yaml
      kubectl apply -f traefik-service.yaml
      ```

3. Create and apply `IngressRoute` resources for the CPT-API and CPT-Web services, with appropriate domain names and
   certificate resolvers.

4. Verify that the deployments and services are running successfully:

   ```
   kubectl get deployments
   kubectl get services
   ```

5. Access the CPT-API and CPT-Web services using their respective domain names.

## Customization

To customize the deployment, you can edit the environment variables, secrets, and configurations in the Kubernetes
manifest files.

For example, you can modify the following:

- Domain names for the CPT-API and CPT-Web services
- Email address for Let's Encrypt certificate registration
- Frontend URL for the CPT-Web service
- PostgreSQL user and password
- Secrets for the CPT-API service: database password, JWT secret, JWT refresh secret, and email password
- Cloudflare API key

## Troubleshooting

If you encounter any issues, consult the official Kubernetes documentation or check the logs of the respective services
using `kubectl logs` command.