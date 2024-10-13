# GE-Explorer

GE Explorer is a course review platform for CSU students to leave reviews on General Education courses. By providing a central way to find online and transferrable courses, students can save both time and money while earning credits towards graduation.

** Tech Stack **

- Backend - GraphQL, MongoDB, Firebase, Next.js, Python (web scraping)
- Frontend - React, Next.js, Tailwind CSS

## Demo

View on

## Getting Started

1. Create an `.env` file and fill in environmental variables

   ```
   MONGODB_URI=

   NEXT_PUBLIC_FIREBASE_API_KEY=""
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=""
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=""
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=""
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=""
   NEXT_PUBLIC_FIREBASE_APP_ID=""
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=""

   FIREBASE_ADMIN_CONFIG'{}'
   ```

2. Create a MongoDB Database - https://www.mongodb.com/

3. Set up Firebase Auth - https://firebase.google.com/docs/auth

4. Run the scraper in /scraper to populate MongoDB

5. Install dependencies and run the project

   ```
   npm install
   npm run dev
   ```
