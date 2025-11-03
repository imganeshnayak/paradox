const { connect, disconnect } = require('./src/config/database');
const { seedArtworks, seedSessions, seedAnalytics } = require('./src/seeds/index');

async function runSeeds() {
  try {
    console.log('🌱 Starting database seeds...');
    
    await connect();
    
    await seedArtworks();
    await seedSessions();
    await seedAnalytics();
    
    console.log('✅ All seeds completed successfully!');
    await disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

runSeeds();
