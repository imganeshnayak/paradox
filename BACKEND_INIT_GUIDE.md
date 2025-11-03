# Backend Setup - Step by Step Guide

## Phase 1: Project Initialization

### Step 1: Create Backend Directory
```powershell
cd c:\Users\User\Desktop\paradox
mkdir backend
cd backend
```

### Step 2: Initialize Node.js Project
```powershell
npm init -y
```

This creates `package.json`. Open it and update:

```json
{
  "name": "realmeta-backend",
  "version": "1.0.0",
  "description": "Museum companion app backend with Express and MongoDB",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "jest --coverage"
  },
  "keywords": ["museum", "mongodb", "express", "nodejs"],
  "author": "",
  "license": "ISC"
}
```

### Step 3: Install Core Dependencies
```powershell
npm install express mongodb dotenv cors morgan joi cloudinary multer axios
npm install --save-dev nodemon jest
```

**Dependency Breakdown:**
- **express**: Web framework
- **mongodb**: Database driver
- **dotenv**: Environment variables
- **cors**: Cross-origin resource sharing
- **morgan**: HTTP request logging
- **joi**: Data validation
- **cloudinary**: 3D model storage
- **multer**: File upload handling
- **axios**: HTTP client for external APIs
- **nodemon**: Auto-restart on file changes
- **jest**: Testing framework

## Phase 2: Project Structure

### Create Folder Structure
```powershell
mkdir src
mkdir src\config
mkdir src\controllers
mkdir src\models
mkdir src\routes
mkdir src\middleware
mkdir src\utils
mkdir src\seeds
```

### Create Key Files
```powershell
# Configuration files
New-Item -Path src\config\database.js
New-Item -Path src\config\cloudinary.js
New-Item -Path src\config\env.js

# Entry point
New-Item -Path server.js

# Environment template
New-Item -Path .env.example
```

## Phase 3: Environment Configuration

### Create `.env` File
```powershell
# Copy template
Copy-Item .env.example -Destination .env
```

### Fill in `.env.example`
```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/realmeta?retryWrites=true&w=majority
DATABASE_NAME=realmeta

# Cloudinary (for 3D models)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# JWT (for admin authentication)
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
JWT_EXPIRE=7d

# Admin
ADMIN_PASSWORD=museum123

# CORS
FRONTEND_URL=http://localhost:3000

# Logging
LOG_LEVEL=info
```

## Phase 4: Create Core Configuration Files

### `src/config/env.js`
```javascript
require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  mongodb: {
    uri: process.env.MONGODB_URI,
    dbName: process.env.DATABASE_NAME || 'realmeta'
  },
  
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET
  },
  
  jwt: {
    secret: process.env.JWT_SECRET,
    expire: process.env.JWT_EXPIRE || '7d'
  },
  
  admin: {
    password: process.env.ADMIN_PASSWORD
  },
  
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000'
  }
};
```

### `src/config/database.js`
```javascript
const { MongoClient } = require('mongodb');
const config = require('./env');

let client = null;
let database = null;

async function connect() {
  try {
    client = new MongoClient(config.mongodb.uri);
    await client.connect();
    database = client.db(config.mongodb.dbName);
    
    console.log('✅ MongoDB connected');
    
    // Create indexes
    await createIndexes(database);
    
    return database;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
}

async function createIndexes(db) {
  try {
    // TTL index for sessions (expire after 24 hours)
    await db.collection('sessions').createIndex(
      { expiresAt: 1 },
      { expireAfterSeconds: 0 }
    );
    
    // TTL index for analytics (expire after 30 days)
    await db.collection('analytics').createIndex(
      { expiresAt: 1 },
      { expireAfterSeconds: 0 }
    );
    
    // Regular indexes for queries
    await db.collection('artworks').createIndex({ title: 'text', description: 'text' });
    await db.collection('artworks').createIndex({ location: 1 });
    await db.collection('analytics').createIndex({ sessionId: 1, timestamp: -1 });
    
    console.log('✅ Database indexes created');
  } catch (error) {
    console.warn('⚠️  Index creation warning:', error.message);
  }
}

function getDatabase() {
  if (!database) {
    throw new Error('Database not connected. Call connect() first.');
  }
  return database;
}

async function disconnect() {
  if (client) {
    await client.close();
    console.log('MongoDB disconnected');
  }
}

module.exports = {
  connect,
  getDatabase,
  disconnect
};
```

### `src/config/cloudinary.js`
```javascript
const cloudinary = require('cloudinary').v2;
const config = require('./env');

cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret
});

module.exports = cloudinary;
```

## Phase 5: Create Entry Point

### `server.js`
```javascript
const app = require('./src/app');
const { connect } = require('./src/config/database');
const config = require('./src/config/env');

const PORT = config.port;

async function startServer() {
  try {
    // Connect to MongoDB
    await connect();
    
    // Start Express server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📀 Environment: ${config.nodeEnv}`);
      console.log(`🎨 Frontend: ${config.cors.origin}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
```

## Phase 6: Create Express App

### `src/app.js`
```javascript
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const config = require('./config/env');

const app = express();

// Middleware
app.use(cors({
  origin: config.cors.origin,
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes (to be implemented)
// app.use('/api/analytics', require('./routes/analytics'));
// app.use('/api/artworks', require('./routes/artworks'));
// app.use('/api/sessions', require('./routes/sessions'));
// app.use('/api/admin', require('./routes/admin'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal server error',
    message: config.nodeEnv === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

module.exports = app;
```

## Next Steps to Complete Backend

1. **Create Database Models** (MongoDB schemas)
   - Analytics collection schema
   - Artwork collection schema
   - Session collection schema

2. **Create Route Handlers**
   - Analytics routes (POST events, GET summary)
   - Artwork routes (CRUD operations)
   - Session routes (validation, preferences)

3. **Create Middleware**
   - Session validation
   - Admin authentication (JWT)
   - Error handling

4. **Create Controllers**
   - AnalyticsController for event processing
   - ArtworkController for CRUD
   - AdminController for dashboard

5. **Testing**
   - Unit tests for each controller
   - Integration tests for API endpoints
   - Test with frontend app

## Quick Start Dev Server

```powershell
cd backend
npm run dev
```

Server will start on `http://localhost:5000` and auto-reload on file changes.

## MongoDB Setup

### Option 1: MongoDB Atlas (Cloud - Recommended)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create new cluster (M0 free tier)
4. Add database user
5. Whitelist your IP
6. Copy connection string to `.env`

### Option 2: Local MongoDB
1. Download from https://www.mongodb.com/try/download/community
2. Install and start MongoDB service
3. Use `mongodb://localhost:27017/realmeta` as MONGODB_URI

### Cloudinary Setup
1. Sign up at https://cloudinary.com
2. Get API credentials from dashboard
3. Add to `.env` file

## Folder Structure Summary

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js      # MongoDB connection
│   │   ├── cloudinary.js    # Cloudinary setup
│   │   └── env.js           # Environment config
│   ├── controllers/         # (To be created)
│   ├── models/              # (To be created)
│   ├── routes/              # (To be created)
│   ├── middleware/          # (To be created)
│   ├── utils/               # (To be created)
│   └── app.js               # Express app setup
├── server.js                # Entry point
├── package.json
├── .env                     # Secrets (add to .gitignore)
└── .env.example             # Template
```

## Test the Setup

Once everything is set up, test with:

```powershell
npm run dev
```

You should see:
```
✅ MongoDB connected
✅ Database indexes created
🚀 Server running on http://localhost:5000
```

Then test the health endpoint:
```powershell
curl http://localhost:5000/api/health
```

You should get:
```json
{
  "status": "ok",
  "timestamp": "2025-11-03T12:00:00.000Z"
}
```

Ready to proceed! Let me know when you want to:
1. Create database models
2. Build API route handlers
3. Connect frontend to backend
