# Setup PlanetScale Database (Free)

## Step 1: Create PlanetScale Account
1. Go to https://planetscale.com
2. Click "Get started"
3. Sign up with GitHub

## Step 2: Create Database
1. Click "Create database"
2. Enter database name: `pharmacyecon`
3. Select region closest to you
4. Click "Create database"

## Step 3: Get Connection String
1. Click "Connect"
2. Select "Prisma" from framework dropdown
3. Copy the DATABASE_URL

## Step 4: Update Your .env File
```env
DATABASE_URL="mysql://username:password@aws.connect.psdb.cloud/pharmacyecon?sslaccept=strict"
```

## Step 5: Update Prisma Schema
```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
  relationMode = "prisma"
}
```

## Step 6: Deploy
```bash
npx prisma db push
npm run db:seed
```

### Benefits of PlanetScale:
- ✅ 5GB free storage
- ✅ 1 billion reads/month
- ✅ Branching (like Git for databases)
- ✅ No downtime migrations
- ✅ Built-in analytics