const { getDatabase, connect, disconnect } = require('../config/database');

async function seedDatabase() {
  try {
    await connect();
    const db = getDatabase();

    // Clear existing data
    console.log('🗑️  Clearing existing collections...');
    await db.collection('artworks').deleteMany({});
    await db.collection('sessions').deleteMany({});
    await db.collection('analytics').deleteMany({});

    // Seed artworks
    console.log('🎨 Seeding artworks...');
    const artworks = [
      {
        artworkId: 'starry-night',
        title: 'The Starry Night',
        artist: 'Vincent van Gogh',
        yearCreated: 1889,
        description: 'A swirling night sky over a small French village. Oil on canvas.',
        image: {
          url: 'https://via.placeholder.com/400x600?text=Starry+Night',
          cloudinaryId: 'starry-night-img'
        },
        model3D: {
          url: 'https://via.placeholder.com/3d-model',
          cloudinaryId: 'starry-night-3d',
          format: 'glb'
        },
        audioGuide: {
          url: 'https://via.placeholder.com/audio',
          transcription: 'This masterpiece depicts...',
          duration: 180
        },
        location: {
          exhibit: 'Post-Impressionism Hall',
          coordinates: { x: 45, y: 30 }
        },
        relatedWorks: ['persistence-of-memory'],
        metadata: {
          period: 'Post-Impressionism',
          medium: 'Oil on canvas',
          dimensions: '73.7 cm × 92.1 cm'
        },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        artworkId: 'persistence-of-memory',
        title: 'The Persistence of Memory',
        artist: 'Salvador Dalí',
        yearCreated: 1931,
        description: 'Surrealist masterpiece featuring melting clocks in a dreamscape.',
        image: {
          url: 'https://via.placeholder.com/400x600?text=Persistence',
          cloudinaryId: 'persistence-img'
        },
        model3D: {
          url: 'https://via.placeholder.com/3d-model',
          cloudinaryId: 'persistence-3d',
          format: 'glb'
        },
        audioGuide: {
          url: 'https://via.placeholder.com/audio',
          transcription: 'Salvador Dalí creates a world...',
          duration: 200
        },
        location: {
          exhibit: 'Modern Surrealism',
          coordinates: { x: 60, y: 45 }
        },
        relatedWorks: ['starry-night'],
        metadata: {
          period: 'Surrealism',
          medium: 'Oil on canvas',
          dimensions: '24 cm × 33 cm'
        },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        artworkId: 'girl-with-pearl',
        title: 'Girl with a Pearl Earring',
        artist: 'Johannes Vermeer',
        yearCreated: 1665,
        description: 'Iconic portrait with mysterious lighting and exotic turban.',
        image: {
          url: 'https://via.placeholder.com/400x600?text=Pearl+Earring',
          cloudinaryId: 'pearl-img'
        },
        model3D: {
          url: 'https://via.placeholder.com/3d-model',
          cloudinaryId: 'pearl-3d',
          format: 'glb'
        },
        audioGuide: {
          url: 'https://via.placeholder.com/audio',
          transcription: 'Vermeer\'s masterful use of light...',
          duration: 150
        },
        location: {
          exhibit: 'Dutch Golden Age',
          coordinates: { x: 30, y: 60 }
        },
        relatedWorks: [],
        metadata: {
          period: 'Dutch Golden Age',
          medium: 'Oil on canvas',
          dimensions: '44.5 cm × 39 cm'
        },
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    const artworkResult = await db.collection('artworks').insertMany(artworks);
    console.log(`✅ Seeded ${artworkResult.insertedCount} artworks`);

    // Seed sample sessions
    console.log('👤 Seeding sample sessions...');
    const sessions = [
      {
        sessionId: '32charId'.repeat(4).substring(0, 32),
        anonymousId: 'anon-uuid-1',
        visitDate: new Date(),
        lastActivity: new Date(),
        preferences: {
          analyticsEnabled: true,
          marketingEnabled: false
        },
        artworksViewed: ['starry-night', 'persistence-of-memory'],
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
      },
      {
        sessionId: '12charId'.repeat(2) + 'abcdefgh12',
        anonymousId: 'anon-uuid-2',
        visitDate: new Date(),
        lastActivity: new Date(),
        preferences: {
          analyticsEnabled: true,
          marketingEnabled: true
        },
        artworksViewed: ['girl-with-pearl'],
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
      }
    ];

    const sessionResult = await db.collection('sessions').insertMany(sessions);
    console.log(`✅ Seeded ${sessionResult.insertedCount} sessions`);

    // Seed sample analytics events
    console.log('📊 Seeding sample analytics...');
    const analytics = [
      {
        sessionId: sessions[0].sessionId,
        anonymousId: sessions[0].anonymousId,
        eventType: 'artwork_view',
        artworkId: 'starry-night',
        metadata: {
          dwellTime: 45000,
          location: 'Post-Impressionism Hall'
        },
        timestamp: new Date(Date.now() - 3600000),
        userAgent: 'Mozilla/5.0...',
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      },
      {
        sessionId: sessions[0].sessionId,
        anonymousId: sessions[0].anonymousId,
        eventType: 'audio_play',
        artworkId: 'starry-night',
        metadata: {},
        timestamp: new Date(Date.now() - 3500000),
        userAgent: 'Mozilla/5.0...',
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      },
      {
        sessionId: sessions[1].sessionId,
        anonymousId: sessions[1].anonymousId,
        eventType: 'artwork_view',
        artworkId: 'girl-with-pearl',
        metadata: {
          dwellTime: 67000,
          location: 'Dutch Golden Age'
        },
        timestamp: new Date(Date.now() - 1800000),
        userAgent: 'Mozilla/5.0...',
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      }
    ];

    const analyticsResult = await db.collection('analytics').insertMany(analytics);
    console.log(`✅ Seeded ${analyticsResult.insertedCount} analytics events`);

    console.log('✨ Database seeded successfully!');
    await disconnect();
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
}

seedDatabase();
