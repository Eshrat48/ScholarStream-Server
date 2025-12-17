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
    scholarshipName: 'Knight-Hennessy Scholars',
    universityName: 'Stanford University',
    universityCity: 'Palo Alto',
    universityCountry: 'United States',
    universityImage: 'https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=400&h=300&fit=crop',
    scholarshipCategory: 'Merit-based',
    subjectCategory: 'Computer Science',
    applicationFees: 75,
    serviceCharge: 8,
    degree: 'Masters',
    tuitionFees: 55000,
    applicationDeadline: '2025-12-31',
    postDate: new Date(),
    scholarshipDescription: 'Full scholarship for outstanding international students',
  },
  {
    scholarshipName: 'STEM Excellence Award',
    universityName: 'Massachusetts Institute of Technology',
    universityCity: 'Cambridge',
    universityCountry: 'United States',
    universityImage: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&h=300&fit=crop',
    scholarshipCategory: 'Merit-based',
    subjectCategory: 'Engineering',
    applicationFees: 105,
    serviceCharge: 13,
    degree: 'Masters',
    tuitionFees: 60000,
    applicationDeadline: '2026-01-15',
    postDate: new Date(),
    scholarshipDescription: 'Full scholarship for research in advanced engineering',
  },
  {
    scholarshipName: 'Rhodes Scholarship',
    universityName: 'University of Oxford',
    universityCity: 'Oxford',
    universityCountry: 'United Kingdom',
    universityImage: 'https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=400&h=300&fit=crop',
    scholarshipCategory: 'Merit-based',
    subjectCategory: 'Liberal Arts',
    applicationFees: 50,
    serviceCharge: 5,
    degree: 'Masters',
    tuitionFees: 45000,
    applicationDeadline: '2025-10-15',
    postDate: new Date(),
    scholarshipDescription: 'Prestigious international scholarship for exceptional students',
  },
  {
    scholarshipName: 'Cambridge International Scholarship',
    universityName: 'University of Cambridge',
    universityCity: 'Cambridge',
    universityCountry: 'United Kingdom',
    universityImage: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=400&h=300&fit=crop',
    scholarshipCategory: 'Merit-based',
    subjectCategory: 'Research',
    applicationFees: 120,
    serviceCharge: 15,
    degree: 'PhD',
    tuitionFees: 40000,
    applicationDeadline: '2025-11-30',
    postDate: new Date(),
    scholarshipDescription: 'Full doctoral scholarship for research excellence',
  },
  {
    scholarshipName: 'Boustany Foundation Scholarship',
    universityName: 'Harvard University',
    universityCity: 'Cambridge',
    universityCountry: 'United States',
    universityImage: 'https://images.unsplash.com/photo-1562774053-701939374585?w=400&h=300&fit=crop',
    scholarshipCategory: 'Need-based',
    subjectCategory: 'Business',
    applicationFees: 110,
    serviceCharge: 11,
    degree: 'MBA',
    tuitionFees: 50000,
    applicationDeadline: '2025-12-15',
    postDate: new Date(),
    scholarshipDescription: 'Scholarship for talented students from developing countries',
  },
  {
    scholarshipName: 'Yale World Scholars',
    universityName: 'Yale University',
    universityCity: 'New Haven',
    universityCountry: 'United States',
    universityImage: 'https://images.unsplash.com/photo-1568792923760-d70635a89fdc?w=400&h=300&fit=crop',
    scholarshipCategory: 'Merit-based',
    subjectCategory: 'Science',
    applicationFees: 95,
    serviceCharge: 9,
    degree: 'Masters',
    tuitionFees: 52000,
    applicationDeadline: '2025-12-20',
    postDate: new Date(),
    scholarshipDescription: 'Full scholarship for international students with exceptional academic records',
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
