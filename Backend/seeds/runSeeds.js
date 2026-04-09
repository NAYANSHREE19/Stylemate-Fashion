import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { seedStyleGuide } from './styleGuideSeed.js';

// Load environment variables
dotenv.config();

const runSeeder = async () => {
  try {
    // Connect to MongoDB
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/stylemate', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Run seeders
    console.log('\n📦 Running seeders...\n');

    // Seed Style Guide
    const styleResult = await seedStyleGuide();
    console.log(`\n✨ Seeded ${styleResult.count} styles`);

    console.log('\n🎉 All seeders completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error running seeders:', error);
    process.exit(1);
  }
};

// Run the seeder
runSeeder();
