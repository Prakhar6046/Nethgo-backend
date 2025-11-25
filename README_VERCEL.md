# Vercel Deployment Guide

This guide explains how to deploy this backend to Vercel.

## Prerequisites

1. Make sure `serviceAccountKey.json` exists in `src/utils/` directory
2. Set up all required environment variables in Vercel dashboard

## Environment Variables

Make sure to add these environment variables in your Vercel project settings:

- `JWT_SECRET` - Your JWT secret key
- `MONGODB_URI` - Your MongoDB connection string
- `NODE_ENV` - Set to "production"
- Any other environment variables your app requires

## Build Process

The build script (`npm run build`) will:
1. Compile TypeScript to JavaScript in the `build/` folder
2. Automatically copy `serviceAccountKey.json` from `src/utils/` to `build/utils/`

## Deployment Steps

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy to Vercel**:
   ```bash
   vercel
   ```
   
   Or for production:
   ```bash
   vercel --prod
   ```

4. **Add Environment Variables**:
   - Go to your Vercel project dashboard
   - Navigate to Settings → Environment Variables
   - Add all required environment variables

5. **Add serviceAccountKey.json**:
   - Since `serviceAccountKey.json` is in `.gitignore`, you need to add it to Vercel
   - Option 1: Add it as an environment variable (recommended for security)
     - In Vercel dashboard, add a new environment variable named `FIREBASE_SERVICE_ACCOUNT`
     - Set the value to the entire JSON content of your serviceAccountKey.json
   - Option 2: Use Vercel's file system (if supported)
     - Upload the file through Vercel's file system or use Vercel CLI

## Important Notes

- The `serviceAccountKey.json` file is automatically copied to `build/utils/` during the build process
- The build script runs automatically when you deploy to Vercel
- Make sure your MongoDB connection string allows connections from Vercel's IP addresses
- Cron jobs (daily/weekly business data refresh) will run on Vercel's serverless functions, but may have limitations

## Troubleshooting

### serviceAccountKey.json not found
- Make sure the file exists in `src/utils/serviceAccountKey.json`
- Check that the build script completed successfully
- Verify the file is not being ignored by `.gitignore` in a way that prevents deployment

### Build errors
- Check that all TypeScript compilation succeeds
- Verify all dependencies are listed in `package.json`
- Check Vercel build logs for specific errors

### Runtime errors
- Check Vercel function logs
- Verify all environment variables are set correctly
- Ensure MongoDB connection string is correct and accessible from Vercel

