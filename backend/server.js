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
