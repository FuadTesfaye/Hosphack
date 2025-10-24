# Setup Supabase Database (Free)

## Step 1: Create Supabase Account
1. Go to https://supabase.com
2. Click "Start your project"
3. Sign up with GitHub (recommended)

## Step 2: Create New Project
1. Click "New Project"
2. Choose your organization
3. Enter project details:
   - **Name**: `pharmacyecon`
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to you
4. Click "Create new project"

## Step 3: Get Database URL
1. Go to Settings > Database
2. Scroll down to "Connection string"
3. Copy the "URI" connection string
4. It looks like: `postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`

## Step 4: Update Your .env File
Replace the DATABASE_URL in your .env file with the Supabase URL:

```env
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
```

## Step 5: Update Prisma Schema
Update your prisma/schema.prisma:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

## Step 6: Run Migration
```bash
npx prisma db push
npm run db:seed
```

## ✅ Done! Your database is now hosted on Supabase for free!

### Benefits of Supabase:
- ✅ 500MB free storage
- ✅ Real-time subscriptions
- ✅ Built-in authentication
- ✅ Auto-generated APIs
- ✅ Dashboard to view data
- ✅ No credit card required