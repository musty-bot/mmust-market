# MMUST Market Project Overview

## 1. Project Summary

MMUST Market is a mobile marketplace for MMUST students to browse products, find housing, and post their own listings. It is built as an Expo React Native application with file-based routing, Supabase for authentication and data, and EAS for mobile builds and over-the-air updates.

The application has three main areas:

- A mobile app for students.
- A Supabase-backed data and authentication layer.
- A separate browser-based admin panel for reviewing listings and changing app settings.

## 2. Technology Stack

### Mobile application

- React Native
- Expo SDK 56
- Expo Router 56
- React 19
- React Native community NetInfo
- Expo SecureStore
- Expo FileSystem
- Expo Image Picker
- Expo Updates

### Backend and data

- Supabase Auth
- Supabase Postgres
- Supabase Row Level Security
- Supabase Storage
- `@supabase/supabase-js`

### Build and distribution

- EAS Build
- EAS Update
- GitHub releases for APK downloads

## 3. Frontend Architecture

### Entry point and routing

The mobile app starts through `expo-router/entry`.

The root layout is `mmust-market/app/_layout.jsx`. It provides:

- An error boundary.
- `AuthProvider` for authentication and PIN state.
- `ListingsProvider` for marketplace data.
- `NetworkProvider` for connectivity state.
- A global offline banner.
- The Expo Router stack.
- Maintenance and route guards.

The main tab layout is `mmust-market/app/(tabs)/_layout.jsx`. It contains four tabs:

| Tab | Route | Purpose |
| --- | --- | --- |
| Home | `app/(tabs)/index.jsx` | Main home screen |
| Market | `app/(tabs)/market.jsx` | Browse approved products and houses |
| Post | `app/(tabs)/post.jsx` | Create a new listing |
| Profile | `app/(tabs)/profile.jsx` | User details, saved links, logout, and app download |

### Main screens

Authentication and onboarding screens are located under `mmust-market/app/`:

- `splash.jsx`: initial landing screen.
- `welcome.jsx`: introduction screen.
- `register.jsx`: creates a Supabase account using a phone-derived email address.
- `login.jsx`: verifies the user's four-digit PIN.
- `set-pin.jsx`: lets a new user create a PIN.
- `confirm-pin.jsx`: confirms the new PIN.
- `forgot-pin.jsx`: PIN recovery flow.
- `my-listings.jsx`: listings created by the signed-in user.
- `listing/[id].jsx`: listing detail screen.

### UI and styling

The app uses a dark visual system defined in `mmust-market/theme.js`.

Shared UI components include:

- `ListingCard.jsx`: displays listing image, title, price, category, and location.
- `PremiumButton.jsx`: primary action button with loading and animation states.
- `FloatingCard.jsx`: elevated form container.
- `PinInput.jsx`: four-digit PIN display.
- `AnimatedKeypad.jsx`: animated PIN keypad.
- `TabIcons.jsx`: tab bar icons.
- `screenStyles.js`: shared screen and card styles.

### Client state

The app uses React Context instead of Redux or another global state library.

#### Authentication context

`mmust-market/context/AuthContext.jsx` manages:

- Supabase session state.
- User profile state.
- PIN state.
- Registration and password login.
- PIN login.
- PIN creation.
- Logout.
- Five-minute inactivity timeout.
- App foreground/background handling.

When a user is inactive for five minutes, the client clears the local user state and requires PIN verification again.

#### Listings context

`mmust-market/context/ListingsContext.jsx` manages:

- Approved listing data.
- Listing creation.
- Listing deletion.
- The user's own listings.
- Listing image uploads.
- The `auto_approve` application setting.

#### Network context

`mmust-market/context/NetworkContext.jsx` uses `@react-native-community/netinfo` to expose connectivity state:

- `true`: internet is reachable.
- `false`: no connection.
- `null`: connectivity is still being checked.

The root layout displays an offline banner when the app is not connected. Login, registration, listing creation, image upload, deletion, and app download are blocked while offline.

## 4. Backend and API Layer

The project does not contain a separate Node, Python, or custom API server. Supabase acts as the backend.

The mobile client connects through `mmust-market/lib/supabaseClient.js`. The client is configured to:

- Persist authentication sessions.
- Automatically refresh tokens.
- Use Expo SecureStore on native platforms.
- Use browser local storage when running on the web.

### Authentication flow

Registration uses a generated email address based on the user's phone number:

```text
<phone>@mmustmarket.local
```

The user's name and phone number are stored as Supabase Auth metadata. A database trigger creates a matching row in `public.profiles` after a new account is created.

The normal login flow is:

1. The user registers or signs in with their phone-derived email and password.
2. Supabase creates or loads the profile.
3. The user creates a four-digit PIN if one is not already set.
4. Later app openings use the PIN for quick local re-authentication.

### Listing flow

When a user creates a listing:

1. The app checks that the device is online.
2. Selected images are converted to binary data.
3. Images are uploaded to Supabase Storage.
4. Public image URLs are stored in the listing record.
5. The listing is inserted with `pending` status unless automatic approval is enabled.
6. The listing becomes visible in the marketplace only after it has `approved` status.

### Admin panel

The admin panel is a separate static browser application in `admin-panel/index.html`. It is not part of the Expo mobile bundle.

It provides:

- Admin login.
- Dashboard statistics.
- Listing review by status.
- Listing approval, rejection, and deletion.
- Maintenance mode setting.
- Automatic approval setting.

The admin panel communicates directly with Supabase from the browser.

## 5. Database Design

The database schema is defined in:

- `mmust-market/supabase-schema.sql`
- `supabase_rls_policies.sql`

The main tables are described below.

### `public.profiles`

Stores the public profile associated with a Supabase user.

| Column | Purpose |
| --- | --- |
| `id` | Primary key and foreign key to `auth.users` |
| `phone` | User phone number |
| `name` | Display name |
| `pin_set` | Indicates whether a PIN has been created |
| `pin` | Four-digit login PIN |
| `created_at` | Profile creation timestamp |

A trigger named `on_auth_user_created` automatically creates a profile when a new Supabase user is registered.

### `public.listings`

Stores products and housing listings.

| Column | Purpose |
| --- | --- |
| `id` | Listing identifier |
| `user_id` | Owner's Supabase user ID |
| `type` | `product` or `house` |
| `title` | Listing title |
| `price` | Price |
| `category` | Listing category |
| `location` | Location |
| `phone` | Contact phone number |
| `description` | Listing description |
| `images` | Array of image URLs |
| `status` | `pending`, `approved`, or `rejected` |
| `approved_at` | Approval timestamp |
| `created_at` | Creation timestamp |

Only approved listings are shown in the public marketplace. Users can view and manage their own listings. Administrators can manage all listings.

### `public.app_settings`

Stores application-wide settings as key-value records.

Current settings include:

- `maintenance_mode`
- `auto_approve`
- `app_name`

The mobile app reads these settings to control maintenance mode and listing approval behavior.

### `public.admins`

Maps Supabase user IDs to administrator accounts.

| Column | Purpose |
| --- | --- |
| `id` | Supabase user ID |
| `username` | Administrator username |
| `created_at` | Creation timestamp |

### Storage

Listing images are stored in the Supabase Storage bucket named:

```text
listing-images
```

The bucket is configured for public reads so listing images can be displayed by the mobile app. Authenticated users can upload and delete their own image objects.

## 6. Environment and Configuration

### Expo configuration

`mmust-market/app.json` defines:

- App name: `MMUST Market`
- App slug: `mmust-market`
- App version: `1.0.0`
- Android package: `com.mmust.market`
- iOS bundle identifier: `com.mmust.market`
- Deep-link scheme: `mmustmarket`
- EAS project ID
- Expo Updates URL
- Runtime version policy based on app version

### EAS configuration

`mmust-market/eas.json` defines two Android build profiles:

| Profile | Distribution | Android artifact |
| --- | --- | --- |
| `preview` | Internal | APK |
| `production` | Production | Android App Bundle |

Both profiles use Node.js 20.18.0.

### Package scripts

The available scripts in `mmust-market/package.json` are:

```text
npm start
npm run android
npm run ios
npm run web
npm run export
```

### Updates and releases

The mobile app includes `expo-updates` and is configured to receive EAS Update releases from the production channel.

The Profile screen also includes a manual APK download flow. `mmust-market/lib/download.js` checks the GitHub repository's latest release and downloads an APK or AAB asset when available.

### Environment files

There are currently no `.env`, `.env.local`, or `.env.production` files in the project. Supabase connection values and other runtime configuration are currently stored directly in source files.

## 7. Current Security and Maintenance Notes

The following items should be addressed before treating the project as a production-hardened system:

- The user PIN is stored as plain text in `public.profiles.pin`. It should be hashed using a secure password-hashing algorithm.
- Supabase connection values are hardcoded in source files.
- The admin panel contains hardcoded administrator credentials and should use a proper protected authentication flow.
- The Supabase anon key is safe to be present in a client application, but it should still be managed deliberately and rotated if compromised.
- There is no environment separation for development, staging, and production.
- There are no automated tests or CI/CD workflow files.
- Database changes are represented by SQL files rather than versioned migration tooling.

## 8. Main File Map

```text
mmust-market/
  app/
    _layout.jsx
    splash.jsx
    welcome.jsx
    register.jsx
    login.jsx
    set-pin.jsx
    confirm-pin.jsx
    forgot-pin.jsx
    my-listings.jsx
    listing/[id].jsx
    (tabs)/
      _layout.jsx
      index.jsx
      market.jsx
      post.jsx
      profile.jsx
  components/
    ListingCard.jsx
    PremiumButton.jsx
    FloatingCard.jsx
    PinInput.jsx
    AnimatedKeypad.jsx
    TabIcons.js
    screenStyles.js
  context/
    AuthContext.jsx
    ListingsContext.jsx
    NetworkContext.jsx
  lib/
    supabaseClient.js
    storage.js
    download.js
  data/
    mock.js
  theme.js
  app.json
  eas.json
  package.json
  supabase-schema.sql

admin-panel/
  index.html

supabase_rls_policies.sql
```

## 9. Development and Build Commands

From the `mmust-market` directory:

```bash
npm install
npm start
npm run android
npm run ios
npm run web
npm run export
```

To publish an over-the-air update to the production channel:

```bash
npx eas update --channel production --environment production --message "Update message" --non-interactive
```

To create a production Android build:

```bash
npx eas build --profile production --platform android
```
