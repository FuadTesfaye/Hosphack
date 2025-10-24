# Database Setup Guide

## Prerequisites

1. **PostgreSQL Database**: You need a PostgreSQL database. You can use:
   - Local PostgreSQL installation
   - Cloud services like Supabase, Railway, or Neon
   - Docker container

## Setup Steps

### 1. Configure Database Connection

Update the `.env` file with your database connection string:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/pharmacyecon?schema=public"
```

**For Supabase (Recommended for quick setup):**
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings > Database
4. Copy the connection string and replace in `.env`

### 2. Run Database Migration

```bash
npm run db:migrate
```

This will create all the necessary tables in your database.

### 3. Seed the Database

```bash
npm run db:seed
```

This will populate your database with initial data (medicines, pharmacies, orders).

### 4. Start the Application

```bash
npm run dev
```

## Database Management Commands

- `npm run db:migrate` - Run database migrations
- `npm run db:generate` - Generate Prisma client
- `npm run db:seed` - Seed database with initial data
- `npm run db:studio` - Open Prisma Studio (database GUI)

## Features Added

✅ **PostgreSQL Database Integration**
- Full CRUD operations for all entities
- Data persistence across page refreshes
- Proper relationships between tables

✅ **Admin Panel Enhancements**
- **Medicines**: Add, edit, delete medicines with real database persistence
- **Pharmacies**: Add, edit, delete pharmacies with real database persistence  
- **Orders**: View, update status, delete orders with real database persistence
- **Prescriptions**: Full CRUD operations (ready for implementation)

✅ **Database Schema**
- Medicines table with pharmacy relationships
- Pharmacies table with medicine relationships
- Orders table with order items
- Prescriptions table for prescription management
- Proper foreign key constraints and cascading deletes

## Troubleshooting

1. **Connection Issues**: Make sure your DATABASE_URL is correct
2. **Migration Errors**: Ensure PostgreSQL is running and accessible
3. **Seed Errors**: Run migrations first before seeding

## Next Steps

The database is now fully integrated! All admin panel operations will persist data and survive page refreshes. You can:

1. Add new medicines and they'll be saved to the database
2. Edit existing medicines and changes will persist
3. Delete medicines and they'll be removed from the database
4. Same functionality for pharmacies and orders
5. All data will be available after page refresh or app restart