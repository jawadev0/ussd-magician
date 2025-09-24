import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.jawadev.com',
  appName: 'ussd-magician',
  webDir: 'dist',
  server: {
    url: 'https://7adbdf55-d8d8-48b1-9754-834f480095f7.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#3b82f6",
      showSpinner: false
    }
  },
  android: {
    permissions: [
      'CALL_PHONE',
      'READ_PHONE_STATE',
      'ACCESS_NETWORK_STATE',
      'ACCESS_WIFI_STATE',
      'READ_SMS',
      'SEND_SMS'
    ]
  }
};

export default config;