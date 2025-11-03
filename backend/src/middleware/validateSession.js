const { getDatabase } = require('../config/database');
const { ObjectId } = require('mongodb');

async function validateSession(req, res, next) {
  try {
    const sessionId = req.headers['x-session-id'];
    const anonymousId = req.headers['x-anonymous-id'];

    if (!sessionId || !anonymousId) {
      return res.status(401).json({ 
        error: 'Missing session headers',
        required: ['X-Session-Id', 'X-Anonymous-Id']
      });
    }

    const db = getDatabase();
    const session = await db.collection('sessions').findOne({ sessionId });

    if (!session) {
      return res.status(401).json({ error: 'Session not found' });
    }

    // Check expiration
    if (new Date() > new Date(session.expiresAt)) {
      return res.status(401).json({ error: 'Session expired' });
    }

    // Update lastActivity
    await db.collection('sessions').updateOne(
      { sessionId },
      { 
        $set: { lastActivity: new Date() }
      }
    );

    // Attach to request
    req.session = session;
    req.sessionId = sessionId;
    req.anonymousId = anonymousId;

    next();
  } catch (error) {
    console.error('Session validation error:', error);
    res.status(500).json({ error: 'Session validation failed' });
  }
}

module.exports = validateSession;
