# USSD Manager - Android App with API

This app provides a complete USSD code management system with API endpoints for adding and executing USSD codes on Android devices.

## Features

- ✅ Database-backed USSD code storage
- ✅ API endpoints for adding and executing codes
- ✅ Android app with Capacitor
- ✅ Separate Activation and Top-up code management
- ✅ Real-time execution results

## API Endpoints

### 1. Add USSD Code
**Endpoint:** `POST /functions/v1/add-ussd-code`

**Authentication:** Required (Bearer token)

**Request Body:**
```json
{
  "name": "Check Balance",
  "code": "*100#",
  "type": "ACTIVATION", // or "TOPUP"
  "description": "Check account balance",
  "category": "Balance Check",
  "sim": 1, // 1 or 2
  "operator": "INWI", // "INWI", "ORANGE", or "IAM"
  "device": "Samsung Galaxy S21"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Check Balance",
    "code": "*100#",
    "type": "ACTIVATION",
    "status": "pending",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

### 2. Execute USSD Code
**Endpoint:** `POST /functions/v1/execute-ussd-code`

**Authentication:** Required (Bearer token)

**Request Body:**
```json
{
  "code_id": "uuid-of-code",
  "ussd_code": "*100#"
}
```

**Response:**
```json
{
  "success": true,
  "result": "Your balance is 25.50 MAD. Valid until 2024-12-31.",
  "code": "*100#"
}
```

## Android App Setup

### Prerequisites
- Node.js 18+
- Android Studio
- Git

### Step 1: Export to GitHub
1. Click the **GitHub** button in Lovable
2. Connect and create a repository

### Step 2: Clone and Install
```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo
npm install
```

### Step 3: Add Android Platform
```bash
npx cap add android
```

### Step 4: Build and Sync
```bash
npm run build
npx cap sync android
```

### Step 5: Run on Device/Emulator
```bash
npx cap run android
```

Or open in Android Studio:
```bash
npx cap open android
```

## Using the App

### Web Version
- Works in any modern browser
- Uses simulated USSD responses
- Full UI functionality

### Android Version
- Runs natively on Android devices
- Can execute real USSD codes (requires phone permissions)
- Dual SIM support

## Database Structure

The app uses a `ussd_codes` table with:
- `id` (UUID, primary key)
- `user_id` (UUID, foreign key to auth.users)
- `name` (text)
- `code` (text)
- `type` ('ACTIVATION' or 'TOPUP')
- `description` (text, optional)
- `category` (text, optional)
- `sim` (integer 1-2, optional)
- `operator` (text, optional)
- `device` (text, optional)
- `status` ('pending', 'done', or 'failed')
- `result` (text, execution result)
- `created_at`, `updated_at` (timestamps)

## Security

- Row Level Security (RLS) enabled
- Users can only view/edit their own codes
- API endpoints require authentication
- Input validation with Zod schema

## Development

### Local Development
```bash
npm run dev
```

### Building for Production
```bash
npm run build
```

### Syncing Changes to Android
After any code changes:
```bash
npm run build
npx cap sync android
```

## Troubleshooting

### Android Build Errors
- Ensure Android SDK is properly installed
- Check Java version (JDK 11+ required)
- Run `npx cap doctor` to diagnose issues

### Permission Issues
The app requires these permissions:
- `CALL_PHONE` - To execute USSD codes
- `READ_PHONE_STATE` - To read SIM information
- `ACCESS_NETWORK_STATE` - To check network connectivity

### API Errors
- Ensure user is authenticated
- Check Supabase URL configuration
- Verify edge functions are deployed

## Support

For issues or questions:
1. Check the Supabase dashboard for logs
2. Review edge function logs for API errors
3. Check browser console for client-side errors
