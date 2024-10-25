# GE-Explorer

GE Explorer is a course review platform for CSU students to browse and review General Education courses. By using this centralized website to find online and transferrable courses, students can save time and money while earning credits towards graduation.

**Tech Stack**

- Backend - JavaScript, GraphQL, MongoDB, Firebase, Python
- Frontend - Next.js, React, Tailwind CSS

## Demo

View on https://ge-explorer.vercel.app/

## Prerequisites

- [Node.js](https://nodejs.org/en)
- [Python](https://www.python.org/downloads/)

## Getting Started

1. Create a MongoDB Database - https://www.mongodb.com/

2. Set up Firebase Auth - https://firebase.google.com/docs/auth

3. Create and fill in a `.env` file

   ```
   MONGODB_URI=

   NEXT_PUBLIC_FIREBASE_API_KEY=""
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=""
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=""
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=""
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=""
   NEXT_PUBLIC_FIREBASE_APP_ID=""
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=""

   FIREBASE_ADMIN_CONFIG='{}'
   ```

4. Run the scraper in `/scraper` to populate MongoDB

5. Install dependencies and run the project

   ```
   npm install
   npm run dev
   ```
