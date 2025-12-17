/**
 * Script to upgrade a user to Moderator role
 * Usage: node scripts/createModerator.js <user-email>
 */

require('dotenv').config();
const { MongoClient } = require('mongodb');

const upgradToModerator = async (email) => {
  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db('scholarStreamDB');
    const usersCollection = db.collection('users');

    // Find user
    const user = await usersCollection.findOne({ email });
    
    if (!user) {
      console.log(`❌ User not found with email: ${email}`);
      console.log('Please register this user first, then run this script.');
      return;
    }

    console.log(`\nFound user: ${user.name} (${user.email})`);
    console.log(`Current role: ${user.role || 'Student'}`);

    // Update to Moderator
    const result = await usersCollection.updateOne(
      { email },
      { 
        $set: { 
          role: 'Moderator',
          assignedCategories: ['Merit-based', 'Need-based', 'Research'] // Default categories
        } 
      }
    );

    if (result.modifiedCount > 0) {
      console.log(`\n✅ Successfully upgraded ${email} to Moderator role!`);
      console.log('Assigned categories: Merit-based, Need-based, Research');
      console.log('\nYou can now log in with this account as a Moderator.');
    } else {
      console.log(`ℹ️ User was already a Moderator`);
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
};

// Get email from command line arguments
const email = process.argv[2];

if (!email) {
  console.log('Usage: node scripts/createModerator.js <user-email>');
  console.log('Example: node scripts/createModerator.js john@example.com');
  process.exit(1);
}

upgradToModerator(email);
