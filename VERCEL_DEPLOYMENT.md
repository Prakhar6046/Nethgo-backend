# Vercel Deployment Guide

This guide explains how to deploy the NCC Backend to Vercel.

## Prerequisites

1. A Vercel account (sign up at https://vercel.com)
2. Your project connected to a Git repository (GitHub, GitLab, or Bitbucket)
3. Firebase service account credentials

## Step 1: Set Up Environment Variables in Vercel

Since `serviceAccountKey.json` cannot be committed to Git (and shouldn't be), you need to set Firebase credentials as environment variables in Vercel.

### Required Environment Variables

Go to your Vercel project settings → Environment Variables and add the following:

1. **FIREBASE_TYPE** (optional, defaults to "service_account")
   ```
   service_account
   ```

2. **FIREBASE_PROJECT_ID**
   ```
   orbix-9fb60
   ```

3. **FIREBASE_PRIVATE_KEY_ID**
   ```
   56178fd0a7bcb1c6b1d1b2a20281134c1d7a72a9
   ```

4. **FIREBASE_PRIVATE_KEY** (Important: Copy the entire private key including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`, and replace `\n` with actual newlines or keep `\\n` as the code handles both)
   ```
   -----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDBpEup8wkuGiDT\n...\n-----END PRIVATE KEY-----\n
   ```

5. **FIREBASE_CLIENT_EMAIL**
   ```
   firebase-adminsdk-adcy1@orbix-9fb60.iam.gserviceaccount.com
   ```

6. **FIREBASE_CLIENT_ID**
   ```
   103533993986691258275
   ```

7. **FIREBASE_AUTH_URI** (optional, has default)
   ```
   https://accounts.google.com/o/oauth2/auth
   ```

8. **FIREBASE_TOKEN_URI** (optional, has default)
   ```
   https://oauth2.googleapis.com/token
   ```

9. **FIREBASE_AUTH_PROVIDER_X509_CERT_URL** (optional, has default)
   ```
   https://www.googleapis.com/oauth2/v1/certs
   ```

10. **FIREBASE_CLIENT_X509_CERT_URL**
    ```
    https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-adcy1%40orbix-9fb60.iam.gserviceaccount.com
    ```

11. **FIREBASE_UNIVERSE_DOMAIN** (optional, has default)
    ```
    googleapis.com
    ```

12. **JWT_SECRET** (Your JWT secret key)
    ```
    your-jwt-secret-key-here
    ```

13. **MONGO_USER** (Your MongoDB username)
    ```
    your-mongodb-username
    ```

14. **MONGO_PASSWORD** (Your MongoDB password)
    ```
    your-mongodb-password
    ```

15. **MONGO_CLUSTER** (Your MongoDB cluster address)
    ```
    cluster0.xxxxx.mongodb.net
    ```

16. **MONGO_DBNAME** (Your MongoDB database name)
    ```
    your-database-name
    ```

17. **NODE_ENV** (optional, but recommended)
    ```
    production
    ```

### How to Extract Values from serviceAccountKey.json

You can extract these values from your local `src/utils/serviceAccountKey.json` file:

- `FIREBASE_PROJECT_ID` = `project_id`
- `FIREBASE_PRIVATE_KEY_ID` = `private_key_id`
- `FIREBASE_PRIVATE_KEY` = `private_key` (keep the `\n` characters as they are)
- `FIREBASE_CLIENT_EMAIL` = `client_email`
- `FIREBASE_CLIENT_ID` = `client_id`
- `FIREBASE_CLIENT_X509_CERT_URL` = `client_x509_cert_url`

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard

1. Go to https://vercel.com/new
2. Import your Git repository
3. Configure the project:
   - **Framework Preset**: Other
   - **Root Directory**: `./` (root of your project)
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
   - **Install Command**: `npm install`
4. Add all environment variables (from Step 1)
5. Click "Deploy"

### Option B: Deploy via Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel
   ```

4. For production deployment:
   ```bash
   vercel --prod
   ```

## Step 3: Verify Deployment

After deployment, check:

1. **Build Logs**: Ensure the build completed successfully
2. **Function Logs**: Check for any runtime errors
3. **API Endpoints**: Test your API endpoints to ensure they work

## Important Notes

### Firebase Private Key Format

When setting `FIREBASE_PRIVATE_KEY` in Vercel:
- You can paste the key with `\n` characters as-is (the code will replace them)
- Or paste it with actual newlines
- Make sure the entire key is included from `-----BEGIN PRIVATE KEY-----` to `-----END PRIVATE KEY-----`

### Local Development

For local development, the code will automatically use `serviceAccountKey.json` if environment variables are not set. This means:
- **Local**: Uses `src/utils/serviceAccountKey.json`
- **Vercel/Production**: Uses environment variables

### Build Process

The build process:
1. Runs `npm install` to install dependencies
2. Runs `npm run build` (which runs `tsc`) to compile TypeScript
3. Outputs to `build/` directory
4. Vercel uses `build/index.js` as the entry point

### Troubleshooting

**Issue**: Build fails with "Cannot find module"
- **Solution**: Ensure all dependencies are in `package.json` and `node_modules` is not in `.gitignore` (it shouldn't be, Vercel will install it)

**Issue**: Firebase initialization fails
- **Solution**: Double-check all Firebase environment variables are set correctly, especially `FIREBASE_PRIVATE_KEY`

**Issue**: Routes return 404
- **Solution**: Check that `vercel.json` routes are correctly configured

**Issue**: Environment variables not working
- **Solution**: After adding environment variables, redeploy the project

## Security Best Practices

1. ✅ Never commit `serviceAccountKey.json` to Git (already in `.gitignore`)
2. ✅ Use environment variables for all sensitive data
3. ✅ Rotate Firebase service account keys periodically
4. ✅ Use Vercel's environment variable encryption
5. ✅ Set different environment variables for Production, Preview, and Development if needed

## Additional Configuration

If you need to configure CORS, database connections, or other settings, make sure to:
- Use environment variables for any configuration that differs between environments
- Update `src/index.ts` to read from `process.env` for these values

