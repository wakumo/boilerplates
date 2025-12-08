# Sento

React Native and [Expo](https://expo.dev)

## Installation

- Install dependencies

   ```bash
   yarn
   ```

- Create .env.local

- Setup android/ios folder

   ```bash
   npx expo prebuild --clean
   ```

## Run

1. Install app to device (if not exist)

   ```bash
   yarn ios --device
   yarn android --device
   ```

2. Run local server

   ```bash
   yarn start
   ```

## Build

### Build iOS locally

1. Setup

   ```bash
   npx eas env:pull development
   yarn build-ios
   ```

2. Open XCode > Product > Archive > Upload Build

### Build Android locally

1. Setup
   Create `release.jks`
   Copy `release.jks` to `android/app`

   ```bash
   npx eas env:pull development
   yarn build-android
   ```

2. Upload app-release.aab from `android/app/build/outputs/bundle/release/`

## Common

1. Expo doctor

   ```bash
   npx expo-doctor@latest
   ```

2. Clear cache

   ```bash
   yarn clear-bundler-caches
   ```