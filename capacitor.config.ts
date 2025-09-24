import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.7adbdf55d8d848b19754834f480095f7',
  appName: 'A Lovable project',
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
  }
};

export default config;