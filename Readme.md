# CafeFinder

## Project Description

CafeFinder is a full-stack web application designed to help users locate cafes within a specific region using geographical data. It utilizes the MERN stack (MongoDB, Express.js, React, Node.js) and integrates OpenStreetMap (OSM) data via the Overpass API for location services. The application features a comprehensive user authentication system, interactive map interface, and a robust review system that supports text ratings and image uploads via Cloudinary.

## Architecture

The application follows a client-server architecture:

1. **Frontend (Client):** Built with React and Vite. It communicates with the backend API for user data and reviews, and directly interacts with the Overpass API to fetch geographical point-of-interest (POI) data. Maps are rendered using Leaflet.
2. **Backend (Server):** Built with Node.js and Express. It handles business logic, authentication, and database interactions.
3. **Database:** MongoDB (via Mongoose) stores user credentials and review data.
4. **Storage:** Cloudinary is used for storing user-uploaded images associated with reviews.

## Key Features

- **Geospatial Search:** Locates cafes based on map coordinates using the Overpass API.
- **Interactive Map:** Visualizes cafe locations with interactive markers and popups using React-Leaflet.
- **User Authentication:** Secure registration and login functionality using JWT (JSON Web Tokens).
- **Review System:** Allows authenticated users to rate cafes and leave text comments.
- **Image Uploads:** Supports image attachments in reviews using Multer for file handling and Cloudinary for cloud storage.
- **Duplicate Review Prevention:** Prevents users from submitting multiple reviews for the same location.

## Tech Stack

**Frontend:**

- React.js
- Vite
- Axios
- React-Leaflet / Leaflet CSS
- React Icons

**Backend:**

- Node.js
- Express.js
- MongoDB / Mongoose
- JsonWebToken (JWT)
- Bcryptjs
- Multer (File Uploads)
- Cloudinary (Image Storage)
- Cors / Dotenv

## Prerequisites

Ensure the following are installed and configured before running the project:

- **Node.js:** v18.0.0 or higher
- **npm:** v9.0.0 or higher
- **MongoDB Atlas:** A valid connection string for a MongoDB cluster.
- **Cloudinary Account:** API Key, API Secret, and Cloud Name for image storage.

## Installation & Setup

1. **Clone the Repository**

```bash
git clone <repository-url>
cd cafefinder

```

2. **Backend Setup**
   Navigate to the server directory and install dependencies:

```bash
cd server
npm install

```

Create a `.env` file in the `server` directory with the following variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLIENT_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

```

3. **Frontend Setup**
   Navigate to the client directory and install dependencies:

```bash
cd ../client
npm install

```

## Usage

To run the application locally, you must start both the backend server and the frontend client.

**1. Start the Backend Server**
From the `server` directory:

```bash
npm run dev

```

_Output: Server running on port 5000 | MongoDB Connected_

**2. Start the Frontend Client**
From the `client` directory:

```bash
npm run dev

```

_Output: Local: http://localhost:5173/_

Access the application by navigating to `http://localhost:5173` in your browser.

## Project Structure

```text
cafefinder/
├── client/                 # Frontend React Application
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable UI components (Navbar, PlaceDetailsPanel, etc.)
│   │   ├── context/        # React Context for global state (AuthContext)
│   │   ├── App.jsx         # Main application component
│   │   └── main.jsx        # Entry point
│   ├── package.json
│   └── vite.config.js
│
├── server/                 # Backend Node.js Application
│   ├── config/             # Configuration files (DB, Cloudinary)
│   ├── controllers/        # Route logic (Auth, Reviews)
│   ├── middleware/         # Middleware (Auth protection, Multer upload)
│   ├── models/             # Mongoose schemas (User, Review)
│   ├── routes/             # API route definitions
│   ├── server.js           # Server entry point
│   └── package.json
│
└── README.md

```

## API Endpoints

### Authentication

| Method | Endpoint             | Description                 | Access |
| ------ | -------------------- | --------------------------- | ------ |
| POST   | `/api/auth/register` | Register a new user         | Public |
| POST   | `/api/auth/login`    | Authenticate user & get JWT | Public |

### Reviews

| Method | Endpoint           | Description                                      | Access  |
| ------ | ------------------ | ------------------------------------------------ | ------- |
| POST   | `/api/reviews`     | Create a review (supports `multipart/form-data`) | Private |
| GET    | `/api/reviews/:id` | Get all reviews for a specific cafe ID           | Public  |
