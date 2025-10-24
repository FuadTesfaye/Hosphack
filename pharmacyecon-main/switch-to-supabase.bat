@echo off
echo Switching to Supabase PostgreSQL...
echo.

echo Step 1: Please create your Supabase project first:
echo 1. Go to https://supabase.com
echo 2. Create account and new project
echo 3. Get your DATABASE_URL from Settings > Database
echo.

echo Step 2: Update your .env file with Supabase URL
echo DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
echo.

pause

echo Step 3: Updating Prisma schema to PostgreSQL...
powershell -Command "(Get-Content prisma\schema.prisma) -replace 'provider = \"sqlite\"', 'provider = \"postgresql\"' | Set-Content prisma\schema.prisma"

echo Step 4: Generating Prisma client...
call npx prisma generate

echo Step 5: Pushing schema to Supabase...
call npx prisma db push

echo Step 6: Seeding database...
call npm run db:seed

echo.
echo ✅ Setup complete! Your app is now using Supabase!
echo You can view your data at: https://app.supabase.com
echo.
pause