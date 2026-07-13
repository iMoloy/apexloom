# ApexLoom 🏠✨

**ApexLoom** is a premium, high-end booking web application designed for curated travel stays and boutique hotel experiences. Built using Next.js, MongoDB, and Firebase Auth, it features a state-of-the-art dark theme, glassmorphic UI components, smooth micro-animations, and interactive dashboards.

---

## 🚀 Key Features

* **Curated Stays Marketplace**: Browse and discover premium listings with location, price, and category filters.
* **Firebase & Google Authentication**: Seamless integration for secure user sign-in via Google Social Login.
* **Host Analytics Dashboard**: Interactive graphs and metrics (powered by Recharts) showing booking trends, revenue, occupancy rates, and listing statistics.
* **Interactive Booking Widget**: Built-in stay reservation flow with automated cost calculations, guest selectors, and calendar tools.
* **Stays CRUD Management**: Split-pane creation and management panel allowing hosts to publish, update, and monitor their listings.
* **Mongoose & MongoDB Integration**: Dynamic persistence for listings, booking histories, user sessions, and reviews.
* **Live Chat Widget**: Elegant, expandable floating widget to support user queries.
* **Responsive, Premium UI**: Curated CSS styling with glassmorphism, glowing input states, and custom layout systems (Bento grids).

---

## 🛠️ Tech Stack

* **Frontend Framework**: Next.js (App Router, Turbopack) & React
* **Database & ORM**: MongoDB Atlas & Mongoose
* **Authentication**: Firebase Client SDK (Google Auth) & Custom JWT Cookies
* **Styling**: Vanilla CSS, Tailwind CSS, & DaisyUI
* **Data Visualization**: Recharts (for host dashboard statistics)
* **Iconography**: Lucide React

---

## ⚙️ Setup & Installation

### 1. Prerequisites
Ensure you have **Node.js (v18+)** and **npm** installed on your system.

### 2. Installation
Clone the repository and install all dependencies:
```bash
git clone https://github.com/iMoloy/apexloom.git
cd apexloom
npm install
```

### 3. Environment Variables Config
Create a `.env.local` file in the root directory (based on `.env.example`) and fill in your MongoDB and Firebase keys:
```env
# Database URI
MONGODB_URI="your-mongodb-atlas-connection-string"
JWT_SECRET="your-jwt-cookie-signing-secret"

# Firebase Config (Get these from your Firebase Console under Project Settings)
NEXT_PUBLIC_FIREBASE_API_KEY="your-api-key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-project.firebasestorage.app"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
NEXT_PUBLIC_FIREBASE_APP_ID="your-app-id"
```

### 4. Verify Database Connection
To test if your MongoDB connection string is working properly, run the database test script:
```bash
node test-db.js
```

### 5. Running the Development Server
Start the Next.js local server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 📁 Project Structure

```
apexloom/
├── src/
│   ├── app/             # Next.js App Router pages & API routes
│   │   ├── api/         # Auth, bookings, and stays API handlers
│   │   ├── login/       # Login portal with Firebase integration
│   │   ├── stays/       # Dynamic stay detail pages, listing add & manage
│   │   └── globals.css  # Curated style variables and global layouts
│   ├── components/      # Reusable client/server UI components
│   │   ├── brand/       # Brand logo SVGs
│   │   ├── home/        # Landing page sections & Bento grids
│   │   ├── layout/      # Navbar, Footer, and App Wrappers
│   │   └── stays/       # Explore filters, BookingWidget, and StayCard
│   ├── data/            # Static datasets and mocks
│   ├── lib/             # Shared libraries (Mongoose client, Auth JWT helpers, Firebase client)
│   └── models/          # Mongoose schemas (Stay, Booking)
├── public/              # Static assets and icons
├── .env.local           # Local environment configs (git ignored)
└── package.json         # Scripts and project dependencies
```
