# Zenduty Firebase Crashlytics Integration

The Zenduty Firebase Crashlytics integration lets you receive **real-time alerts** for mobile application crashes, notify the relevant team members, and resolve downtime quickly before it affects users.

## Setting up the Integration

### 1. Create and set up the Firebase Project

* Create a Firebase project using the [Firebase Developer Console](https://console.firebase.google.com).
* Enable **Billing** on your project by switching to the **Blaze** plan. This is required to allow HTTP requests from Cloud Functions to external services.
* Include [Crashlytics in your project](https://firebase.google.com/docs/crashlytics/get-started).

### 2. Configure the Sample

* Clone or download this repository and open the root directory.
* Make sure the Firebase CLI is installed. If not, install it:

```bash
npm install -g firebase-tools
firebase login
```

* Select your project:

```bash
firebase use --add
```

* Install dependencies for Cloud Functions:

```bash
cd functions
npm install
```

### 3. Set the Zenduty Webhook URL (Environment Parameter)

* Go to your Zenduty account, open your team and go to service, and create a Generic Integration.
* Copy the **Integration URL**.
* Configure it in Firebase **using Environment Parameters**:

```bash
firebase functions:parameters:set ZENDUTY_WEBHOOK_URL="<paste-the-url-here>"
firebase deploy --only functions:parameters
```
### 4. Deploy and Test

* Deploy the functions:

```bash
firebase deploy --only functions
```


