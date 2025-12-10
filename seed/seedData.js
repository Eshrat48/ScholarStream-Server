/**
 * Database seeder for sample data
 * Run this file to populate database with initial test data
 * Usage: node seed/seedData.js
 */

require('dotenv').config();
const { MongoClient } = require('mongodb');

const sampleUsers = [
  {
    name: 'Admin User',
    email: 'admin@scholarstream.com',
    role: 'Admin',
    university: 'ScholarStream Admin',
    createdAt: new Date(),
  },
  {
    name: 'John Moderator',
    email: 'moderator@scholarstream.com',
    role: 'Moderator',
    university: 'Harvard University',
    createdAt: new Date(),
  },
  {
    name: 'Alice Student',
    email: 'alice@example.com',
    role: 'Student',
    university: 'MIT',
    createdAt: new Date(),
  },
];

const sampleScholarships = [
  {
    scholarshipName: 'Global Excellence Scholarship',
    universityName: 'Stanford University',
    universityCountry: 'United States',
    scholarshipCategory: 'Merit-based',
    subjectCategory: 'Computer Science',
    applicationFees: 50,
    serviceCharge: 5,
    degree: 'Masters',
    tuitionFees: 45000,
    applicationDeadline: '2025-12-31',
    postDate: new Date(),
    scholarshipDescription: 'Full scholarship for outstanding international students',
  },
  {
    scholarshipName: 'Research Excellence Award',
    universityName: 'Oxford University',
    universityCountry: 'United Kingdom',
    scholarshipCategory: 'Research',
    subjectCategory: 'Engineering',
    applicationFees: 75,
    serviceCharge: 8,
    degree: 'PhD',
    tuitionFees: 35000,
    applicationDeadline: '2026-01-15',
    postDate: new Date(),
    scholarshipDescription: 'PhD scholarship for research in advanced engineering',
  },
];

const seedDatabase = async () => {
  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db('scholarStreamDB');

    // Clear existing data
    await db.collection('users').deleteMany({});
    await db.collection('scholarships').deleteMany({});
    console.log('Cleared existing data');

    // Insert sample data
    await db.collection('users').insertMany(sampleUsers);
    console.log(`Inserted ${sampleUsers.length} users`);

    await db.collection('scholarships').insertMany(sampleScholarships);
    console.log(`Inserted ${sampleScholarships.length} scholarships`);

    console.log('Database seeding completed successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await client.close();
  }
};

// Run seeder if executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };
