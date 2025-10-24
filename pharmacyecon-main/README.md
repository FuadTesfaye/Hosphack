# Pharmacy Econ - Admin Panel with PostgreSQL

A NextJS pharmacy management system with a complete admin panel and PostgreSQL database integration.

## Features

- 🏥 **Pharmacy Management**: Add, edit, delete pharmacies
- 💊 **Medicine Inventory**: Complete CRUD operations for medicines
- 📦 **Order Management**: View, update status, and delete orders
- 📋 **Prescription Handling**: Manage prescription uploads and approvals
- 🗄️ **PostgreSQL Database**: Full data persistence with proper relationships
- 🎨 **Modern UI**: Built with Tailwind CSS and Radix UI components

## Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Setup database** (see DATABASE_SETUP.md for detailed instructions):
   ```bash
   # Configure your DATABASE_URL in .env
   npm run db:migrate
   npm run db:seed
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Access the admin panel**: Navigate to `/admin` to manage your pharmacy data

## Database Setup

See [DATABASE_SETUP.md](./DATABASE_SETUP.md) for complete database setup instructions.

## Project Structure

- `/src/app/admin/` - Admin panel pages
- `/src/components/admin/` - Admin-specific components
- `/src/lib/database.ts` - Database operations
- `/prisma/schema.prisma` - Database schema
- `/scripts/seed.ts` - Database seeding script
