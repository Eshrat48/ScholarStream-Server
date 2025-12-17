// Update all scholarships to have realistic application fees
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;

async function updateFees() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db('scholarStreamDB');
    const scholarships = db.collection('scholarships');
    
    // Check total count
    const count = await scholarships.countDocuments();
    console.log(`📊 Total scholarships in database: ${count}`);
    
    // Check how many have zero or missing fees
    const zeroFees = await scholarships.countDocuments({
      $or: [
        { applicationFees: { $exists: false } },
        { applicationFees: 0 },
        { applicationFees: null }
      ]
    });
    console.log(`💰 Scholarships with zero/missing fees: ${zeroFees}`);
    
    // Sample one to see current values
    const sample = await scholarships.findOne({});
    console.log('📝 Sample scholarship fees:', {
      applicationFees: sample?.applicationFees,
      serviceCharge: sample?.serviceCharge
    });
    
    // Force update ALL scholarships regardless of current value
    const result = await scholarships.updateMany(
      {}, // Match all documents
      {
        $set: {
          applicationFees: 50,
          serviceCharge: 5
        }
      }
    );
    
    console.log(`✅ Updated ${result.modifiedCount} scholarships with fees`);
    console.log('   Application Fee: $50');
    console.log('   Service Charge: $5');
    console.log('   Total: $55');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

updateFees();
