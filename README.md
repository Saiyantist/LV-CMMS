# CMMS

**LV CMMS** is a responsive web-based computerized maintenance management system designed for ***La Verdad Christian College - Apalit, Pampanga***. ✨

It provides a centralized platform for coordinating maintenance operations, tracking institutional assets, monitoring safety-related activities, and managing facility and equipment booking requests.

It is built with a **Laravel** backend and a **React** frontend served through Vite.

This served as part of the partial fulfillment for the **Bachelor's Degree in Information Systems**.

## Salient Features

### Centralized work order management
Create, monitor, update, and manage maintenance requests in one place, giving authorized users a clearer view of pending, ongoing, and completed work.

### Asset management with preventive maintenance
Keep track of institutional assets, view maintenance history, and receive automated preventive maintenance notifications to help reduce unexpected equipment issues.

### Compliance and safety monitoring
Support organized monitoring and management of compliance and safety-related records, helping the institution maintain better oversight of important operational requirements.

### Event services and facility booking
Manage facility reservations, equipment booking, and related service requests through a structured workflow for better scheduling and accountability.

### Mobile Responsive Experience
Access the system across desktop, tablet, and mobile screen sizes, making it practical for both office-based users and personnel working around campus.

## Technology Stack 🧰

- Laravel 11
- PHP 8.2+
- MySQL
- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui

## Prerequisites

Before installing the system, make sure you have the following installed:

- PHP 8.2 or higher
- Composer
- Node.js and npm
- MySQL
- Git

## Installation and Setup ⚙️

1. Clone the repository.

   ```bash
   git clone <repository-url>
   cd LV-CMMS
   ```

2. Install PHP dependencies.

   ```bash
   composer install
   ```

3. Install JavaScript dependencies.

   ```bash
   npm install
   ```

4. Configure the environment file.

   Copy `.env.example` to `.env` if an example file is available:

   ```bash
   cp .env.example .env
   ```

   If you do not have the environment variables, request the `.env` file or the correct environment configuration from the repository owners.

5. Update the database settings in `.env`.

   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=<database_name>
   DB_USERNAME=<database_user>
   DB_PASSWORD=<database_password>
   ```

6. Configure the mailer if you want to test emails.

   For local development, a free email testing service such as [Mailtrap](https://mailtrap.io/) is recommended. Create a free account, open your email testing inbox, then copy the SMTP credentials into your `.env` file.

   ```env
   MAIL_MAILER=smtp
   MAIL_HOST=<smtp_host>
   MAIL_PORT=<smtp_port>
   MAIL_USERNAME=<smtp_username>
   MAIL_PASSWORD=<smtp_password>
   MAIL_ENCRYPTION=<tls_or_ssl>
   MAIL_FROM_ADDRESS="noreply@example.com"
   MAIL_FROM_NAME="${APP_NAME}"
   ```

   Use the values provided by your selected development mail service. Do not use personal or production SMTP credentials for local testing unless instructed by the repository owners.

7. Generate the application key.

   ```bash
   php artisan key:generate
   ```

8. Run database migrations and seeders.

   ```bash
   php artisan migrate --seed
   ```

## Running the System 🚀

Start the Laravel backend:

```bash
php artisan serve
```

In another terminal, start the Vite development server:

```bash
npm run dev
```

Then open the Laravel application URL shown in the terminal:

```text
http://127.0.0.1:8000
```

You can also run the combined development command if your local environment supports it:

```bash
composer run dev
```

## Support and Opportunities 🫱🏼‍🫲🏽🤍

For issues encountered while installing, running, or using the system, please reach out to the developers for assistance.

The developers are also open to discussions about possible improvements, collaborations, deployment support, customization, or other project opportunities.

Developer contact details:

### Saiyantist 🚀🪖

[![Gmail](https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:angelo.delossantos000@gmail.com)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/saiyantist/)

### Morrow4 🦾🧰

[![Gmail](https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:jshallador19@gmail.com)