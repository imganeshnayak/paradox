const { getDatabase } = require('../config/database');

async function seedArtworks() {
  const db = getDatabase();
  
  const artworks = [
    {
      artworkId: 'starry-night',
      title: 'The Starry Night',
      artist: 'Vincent van Gogh',
      yearCreated: 1889,
      type: 'painting',
      description: 'A swirling night sky over a small French village. One of the most recognizable paintings in art history.',
      medium: 'Oil on canvas',
      dimensions: '73.7 cm × 92.1 cm',
      image: {
        url: 'https://res.cloudinary.com/dahotkqpi/image/upload/v1/starry-night.jpg',
        cloudinaryId: 'starry-night'
      },
      model3D: null,
      audioGuide: {
        url: 'https://res.cloudinary.com/dahotkqpi/video/upload/v1/starry-night-audio.m4a',
        transcription: 'This painting depicts a night scene with a crescent moon and stars...',
        duration: 180
      },
      location: {
        exhibit: 'Post-Impressionism',
        coordinates: { x: 10, y: 15 }
      },
      relatedWorks: ['iris-painting', 'sunflowers'],
      period: 'Post-Impressionism',
      createdAt: new Date(),
      updatedAt: new Date(),
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
    },
    {
      artworkId: 'iris-painting',
      title: 'Irises',
      artist: 'Vincent van Gogh',
      yearCreated: 1890,
      type: 'painting',
      description: 'A vibrant painting of purple irises. Created during van Gogh\'s stay in Saint-Paul-de-Mausole asylum.',
      medium: 'Oil on canvas',
      dimensions: '71 cm × 93 cm',
      image: {
        url: 'https://res.cloudinary.com/dahotkqpi/image/upload/v1/irises.jpg',
        cloudinaryId: 'irises'
      },
      model3D: null,
      audioGuide: {
        url: 'https://res.cloudinary.com/dahotkqpi/video/upload/v1/irises-audio.m4a',
        transcription: 'Van Gogh\'s use of color in this painting is extraordinary...',
        duration: 150
      },
      location: {
        exhibit: 'Post-Impressionism',
        coordinates: { x: 12, y: 15 }
      },
      relatedWorks: ['starry-night', 'sunflowers'],
      period: 'Post-Impressionism',
      createdAt: new Date(),
      updatedAt: new Date(),
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
    },
    {
      artworkId: 'sunflowers',
      title: 'Sunflowers',
      artist: 'Vincent van Gogh',
      yearCreated: 1888,
      type: 'painting',
      description: 'A series of still life paintings depicting sunflowers in a vase. A symbol of joy and hope.',
      medium: 'Oil on canvas',
      dimensions: '92 cm × 73 cm',
      image: {
        url: 'https://res.cloudinary.com/dahotkqpi/image/upload/v1/sunflowers.jpg',
        cloudinaryId: 'sunflowers'
      },
      model3D: null,
      audioGuide: {
        url: 'https://res.cloudinary.com/dahotkqpi/video/upload/v1/sunflowers-audio.m4a',
        transcription: 'These sunflowers represent gratitude and loyalty in the language of flowers...',
        duration: 160
      },
      location: {
        exhibit: 'Post-Impressionism',
        coordinates: { x: 14, y: 15 }
      },
      relatedWorks: ['starry-night', 'iris-painting'],
      period: 'Post-Impressionism',
      createdAt: new Date(),
      updatedAt: new Date(),
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
    },
    {
      artworkId: 'persistence-of-memory',
      title: 'The Persistence of Memory',
      artist: 'Salvador Dalí',
      yearCreated: 1931,
      type: 'painting',
      description: 'Surrealist masterpiece featuring melting clocks. Questions the nature of time itself.',
      medium: 'Oil on canvas',
      dimensions: '24 cm × 33 cm',
      image: {
        url: 'https://res.cloudinary.com/dahotkqpi/image/upload/v1/persistence-memory.jpg',
        cloudinaryId: 'persistence-memory'
      },
      model3D: null,
      audioGuide: {
        url: 'https://res.cloudinary.com/dahotkqpi/video/upload/v1/persistence-audio.m4a',
        transcription: 'Dalí\'s exploration of time, dreams, and the subconscious mind...',
        duration: 200
      },
      location: {
        exhibit: 'Surrealism',
        coordinates: { x: 20, y: 20 }
      },
      relatedWorks: ['elephants-on-spindly-legs'],
      period: 'Surrealism',
      createdAt: new Date(),
      updatedAt: new Date(),
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
    }
  ];

  try {
    // Clear existing artworks
    await db.collection('artworks').deleteMany({});
    
    // Insert new artworks
    const result = await db.collection('artworks').insertMany(artworks);
    
    console.log(`✅ Seeded ${result.insertedCount} artworks`);
    return result;
  } catch (error) {
    console.error('❌ Seed error:', error);
    throw error;
  }
}

async function seedSessions() {
  const db = getDatabase();
  
  const sessions = [
    {
      sessionId: 'session_demo_001',
      anonymousId: 'anon_001_uuid',
      visitDate: new Date(),
      lastActivity: new Date(),
      preferences: {
        analyticsEnabled: true,
        marketingEnabled: false
      },
      artworksViewed: ['starry-night', 'iris-painting'],
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
    },
    {
      sessionId: 'session_demo_002',
      anonymousId: 'anon_002_uuid',
      visitDate: new Date(),
      lastActivity: new Date(),
      preferences: {
        analyticsEnabled: true,
        marketingEnabled: true
      },
      artworksViewed: ['sunflowers', 'persistence-of-memory'],
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
    }
  ];

  try {
    // Clear existing sessions
    await db.collection('sessions').deleteMany({});
    
    // Insert new sessions
    const result = await db.collection('sessions').insertMany(sessions);
    
    console.log(`✅ Seeded ${result.insertedCount} sessions`);
    return result;
  } catch (error) {
    console.error('❌ Seed error:', error);
    throw error;
  }
}

async function seedAnalytics() {
  const db = getDatabase();
  
  const analyticsEvents = [
    {
      sessionId: 'session_demo_001',
      anonymousId: 'anon_001_uuid',
      eventType: 'artwork_view',
      artworkId: 'starry-night',
      metadata: { location: 'Post-Impressionism' },
      timestamp: new Date(Date.now() - 60000),
      userAgent: 'Mozilla/5.0',
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    },
    {
      sessionId: 'session_demo_001',
      anonymousId: 'anon_001_uuid',
      eventType: 'dwell_time',
      artworkId: 'starry-night',
      metadata: { dwellTime: 45000, location: 'Post-Impressionism' },
      timestamp: new Date(Date.now() - 30000),
      userAgent: 'Mozilla/5.0',
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    },
    {
      sessionId: 'session_demo_001',
      anonymousId: 'anon_001_uuid',
      eventType: 'audio_play',
      artworkId: 'starry-night',
      metadata: { duration: 180 },
      timestamp: new Date(Date.now() - 15000),
      userAgent: 'Mozilla/5.0',
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    },
    {
      sessionId: 'session_demo_002',
      anonymousId: 'anon_002_uuid',
      eventType: 'artwork_view',
      artworkId: 'persistence-of-memory',
      metadata: { location: 'Surrealism' },
      timestamp: new Date(Date.now() - 120000),
      userAgent: 'Mozilla/5.0',
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    },
    {
      sessionId: 'session_demo_002',
      anonymousId: 'anon_002_uuid',
      eventType: 'dwell_time',
      artworkId: 'persistence-of-memory',
      metadata: { dwellTime: 120000, location: 'Surrealism' },
      timestamp: new Date(Date.now() - 90000),
      userAgent: 'Mozilla/5.0',
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    }
  ];

  try {
    // Clear existing analytics
    await db.collection('analytics').deleteMany({});
    
    // Insert new events
    const result = await db.collection('analytics').insertMany(analyticsEvents);
    
    console.log(`✅ Seeded ${result.insertedCount} analytics events`);
    return result;
  } catch (error) {
    console.error('❌ Seed error:', error);
    throw error;
  }
}

module.exports = {
  seedArtworks,
  seedSessions,
  seedAnalytics
};
