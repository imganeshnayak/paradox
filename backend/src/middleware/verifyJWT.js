const jwt = require('jsonwebtoken');
const config = require('../config/env');

function verifyJWT(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid authorization header' });
    }

    const token = authHeader.substring(7);

    jwt.verify(token, config.jwt.secret, (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Invalid token', details: err.message });
      }

      req.admin = decoded;
      next();
    });
  } catch (error) {
    console.error('JWT verification error:', error);
    res.status(500).json({ error: 'Token verification failed' });
  }
}

module.exports = verifyJWT;
