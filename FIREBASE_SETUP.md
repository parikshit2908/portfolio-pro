# Firebase Setup Guide

This guide will help you set up Firebase Authentication for the PortfolioPro application.

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Follow the setup wizard:
   - Enter your project name (e.g., "PortfolioPro")
   - Choose whether to enable Google Analytics (optional)
   - Click "Create project"

## Step 2: Register Your Web App

1. In your Firebase project, click on the **Web icon** (`</>`)
2. Register your app with a nickname (e.g., "PortfolioPro Web")
3. Copy the Firebase configuration object that appears

## Step 3: Enable Authentication

1. In the Firebase Console, go to **Authentication** in the left sidebar
2. Click "Get started"
3. Click on the **Sign-in method** tab
4. Enable **Email/Password** authentication:
   - Click on "Email/Password"
   - Toggle "Enable" to ON
   - Click "Save"

## Step 4: Set Up Environment Variables

1. In your project root (`client` folder), create a `.env.local` file (if it doesn't exist)
2. Add your Firebase configuration values:

```env
VITE_FIREBASE_API_KEY=your-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

3. Replace the placeholder values with your actual Firebase config values from Step 2

## Step 5: Update Firebase Config File

The Firebase configuration file is already set up at `client/src/firebase/config.js`. 
It will automatically use the environment variables you set in `.env.local`.

## Step 6: Test the Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to the Signup page and create a test account
3. Try logging in with the credentials
4. Check Firebase Console > Authentication > Users to see if your user was created

## Security Rules (Firestore - For Future Use)

When you implement Firestore database, make sure to set up security rules. For now, authentication is set up and ready to use.

## Troubleshooting

### Error: "Firebase: Error (auth/invalid-api-key)"
- Make sure your `.env.local` file exists and contains the correct values
- Ensure the environment variable names start with `VITE_`
- Restart your development server after adding/changing environment variables

### Error: "Firebase: Error (auth/operation-not-allowed)"
- Make sure Email/Password authentication is enabled in Firebase Console
- Go to Authentication > Sign-in method and enable Email/Password

### User not appearing in Firebase Console
- Wait a few seconds and refresh the Authentication > Users page
- Check browser console for any error messages

## Next Steps

After setting up Firebase Authentication:
- Users can now sign up and log in
- Protected routes will automatically redirect unauthenticated users
- User state persists across page refreshes
- You're ready to integrate Firestore for storing user data and portfolios

