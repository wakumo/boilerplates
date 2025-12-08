const getAppConfig = () => {
  const configs = {
    development: {
      name: "React Native Expo Dev",
      slug: "react-native-expo",
      version: "1.0.0",
      buildNumber: "1",
      icon: "./assets/images/icon.png",
      scheme: "reactnativeexpo-development",
      bundleIdentifier: "com.reactnativeexpo"
    },
    production: {
      name: "React Native Expo",
      slug: "react-native-expo",
      version: "1.0.0",
      buildNumber: "1",
      icon: "./assets/images/icon.png",
      scheme: "reactnativeexpo",
      bundleIdentifier: "com.reactnativeexpo"
    }
  };
  const environment = process.env.APP_ENV || 'development';
  const config = configs[environment] || configs.development;

  return {
    expo: {
      name: config.name,
      slug: config.slug,
      version: config.version,
      orientation: "portrait",
      icon: config.icon,
      scheme: config.scheme,
      schemes: [
        config.bundleIdentifier
      ],
      userInterfaceStyle: "automatic",
      newArchEnabled: true,
      ios: {
        bundleIdentifier: config.bundleIdentifier,
        version: config.version,
        buildNumber: config.buildNumber,
        supportsTablet: true,
      },
      android: {
        package: config.bundleIdentifier,
        version: config.version,
        versionCode: config.buildNumber,
        adaptiveIcon: {
          backgroundColor: "#E6F4FE",
          foregroundImage: "./assets/images/android-icon-foreground.png",
          backgroundImage: "./assets/images/android-icon-background.png",
          monochromeImage: "./assets/images/android-icon-monochrome.png"
        },
        edgeToEdgeEnabled: true,
        predictiveBackGestureEnabled: false,
        blockedPermissions: ["android.permission.RECORD_AUDIO", "android.permission.READ_MEDIA_IMAGES", "android.permission.READ_MEDIA_VIDEO", "com.google.android.gms.permission.AD_ID"],
        permissions: [],
      },
      web: {
        website: config.website,
        version: config.version,
        buildNumber: config.buildNumber,
        bundler: "metro",
        output: "static",
        favicon: config.favicon
      },
      plugins: [
        "expo-router",
        [
          "expo-splash-screen",
          {
            "image": "./assets/images/splash-icon.png",
            "imageWidth": 200,
            "resizeMode": "contain",
            "backgroundColor": "#ffffff",
            "dark": {
              "backgroundColor": "#000000"
            }
          }
        ],
        [
          "expo-dev-client",
          {
            "launchMode": "most-recent"
          }
        ],
        [
          "expo-build-properties",
          {
            "ios": {
              "useFrameworks": "static",
            }
          }
        ],
        "expo-web-browser",
        "expo-font",
        [
          "expo-localization",
          {
            "supportedLocales": {
              "ios": ["en", "ja"],
              "android": ["en", "ja"]
            }
          }
        ],
      ],
      experiments: {
        typedRoutes: true,
        reactCompiler: true
      },
      extra: {
        environment: environment,
      },
      fonts: [
        "assets/fonts/NotoSansJP-Regular.ttf",
      ],
    }
  };
}
module.exports = getAppConfig();

