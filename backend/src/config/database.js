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
    await db.collection('analytics').createIndex({ artworkId: 1 });
    
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
