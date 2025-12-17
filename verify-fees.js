require('dotenv').config();
const { MongoClient } = require('mongodb');

const verifyFees = async () => {
  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db('scholarStreamDB');
    const scholarships = await db.collection('scholarships')
      .find({}, { projection: { scholarshipName: 1, applicationFees: 1, serviceCharge: 1 } })
      .toArray();

    console.log('\n📚 Scholarship Fees:');
    console.log('=====================================');
    scholarships.forEach(s => {
      const total = s.applicationFees + s.serviceCharge;
      console.log(`${s.scholarshipName.padEnd(40)} | App Fee: $${s.applicationFees} | Service: $${s.serviceCharge} | Total: $${total}`);
    });
    console.log('=====================================\n');

    // Check if all fees are different
    const fees = scholarships.map(s => s.applicationFees);
    const uniqueFees = new Set(fees);
    if (uniqueFees.size === fees.length) {
      console.log('✅ All scholarship fees are different!');
    } else {
      console.log('⚠️ Some scholarship fees are the same');
    }

  } finally {
    await client.close();
  }
};

if (require.main === module) {
  verifyFees();
}

module.exports = { verifyFees };
