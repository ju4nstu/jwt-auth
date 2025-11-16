# Overview

This repository contains the backend code for a simple e-commerce system.

## Features
* User authentication (JWT-based)
Secure login and protected routes using JSON Web Tokens.

* Payment processing with Stripe
Backend-only integration. The API creates payment intents and returns the client_secret to the frontend.

* Product management (read-only)
Endpoints to list and view available products.

* User order management
Endpoints to retrieve orders associated with the authenticated user.
