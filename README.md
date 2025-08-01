# Student Check-In App

A React Native mobile app built with Expo for student attendance tracking with biometric verification and GPS location logging.

## Features

- **Multi-Auth Support**: Email/password and Google Sign-In via Firebase Auth
- **Biometric Security**: FaceID/Fingerprint authentication using expo-local-authentication
- **GPS Location Tracking**: Precise location capture using expo-location
- **Photo Upload**: Circular camera interface with Firebase Storage integration
- **Firebase Firestore**: Cloud storage for check-in records
- **Clean UI**: Minimalist black and white design
- **Tab Navigation**: Intuitive user interface with multiple screens

## Tech Stack

- React Native with Expo (Managed Workflow)
- TypeScript
- Firebase (Auth + Firestore)
- expo-local-authentication
- expo-location
- @react-native-google-signin/google-signin
- expo-image-picker & expo-image-manipulator
- react-native-paper
- Lucide React Native (Icons)

## Setup Instructions

### 1. Firebase Configuration

✅ **Firebase configuration is already set up** with your project details:
- Project ID: `studentpunchapp`
- App ID: `1:1097095993421:android:e9b9b4bf38330e5e5ee404`
- Package Name: `com.yourcompany.studentpunch`

**Next steps to complete Firebase setup:**
1. Go to [Firebase Console](https://console.firebase.google.com) → studentpunchapp project
2. Enable **Authentication** with Email/Password and Google providers
3. Create a **Firestore database** in production mode
4. Enable **Firebase Storage** for photo uploads
5. Add the security rules provided below
6. Configure Google Sign-In with your web client ID in AuthService.ts

### 2. Firestore Security Rules

Add these security rules to your Firestore database:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /checkins/{document} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 3. Firebase Storage Security Rules

Add these security rules to your Firebase Storage:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /checkins/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```
### 4. Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Test the app using Expo Go on your mobile device or iOS/Android simulator

### 5. Building for Production

For production builds, you'll need to create development builds with Expo Dev Client since this app uses native modules:

```bash
expo install expo-dev-client
expo run:ios
expo run:android
```

## App Structure

```
app/
├── (tabs)/
│   ├── _layout.tsx          # Tab navigation
│   ├── index.tsx            # Punch-in screen
│   ├── history.tsx          # Check-in history
│   └── profile.tsx          # User profile
├── _layout.tsx              # Root layout
├── login.tsx                # Login screen
├── biometric.tsx            # Biometric authentication
└── +not-found.tsx           # 404 screen

contexts/
└── AuthContext.tsx          # Authentication context

services/
├── firebase.ts              # Firebase configuration
├── AuthService.ts           # Authentication service
├── LocationService.ts       # Location handling
└── FirestoreService.ts      # Database operations

components/
└── LoadingSpinner.tsx       # Reusable loading component
```

## Usage

1. **Login**: Sign in with email/password or Google account
2. **Biometric Auth**: Complete biometric verification (optional)
3. **Check-In**: Take a selfie and record attendance with location
4. **History**: View previous check-ins with photos, timestamps and coordinates
5. **Profile**: Manage account and sign out

## Security Features

- Firebase Authentication for secure login
- Biometric authentication for device-level security
- Firestore security rules to protect user data
- Location permissions requested at runtime
- Encrypted data transmission

## Permissions Required

- **Location**: To capture GPS coordinates during check-in
- **Biometric**: To enable fingerprint/FaceID authentication
- **Internet**: To communicate with Firebase services

## Notes

- Location tracking is only used during active check-in (no background tracking)
- All user data is stored securely in Firebase Firestore
- Biometric authentication can be skipped if not supported/enrolled
- The app works offline for UI navigation but requires internet for data sync

## Support

For issues related to:
- Firebase setup: Check the Firebase Console and configuration
- Location services: Ensure location permissions are granted
- Biometric auth: Verify device support and enrollment
- Build issues: Refer to Expo documentation for native module setup