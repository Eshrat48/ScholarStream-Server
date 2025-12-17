require('dotenv').config();
const { MongoClient } = require('mongodb');

(async () => {
  const client = new MongoClient(process.env.MONGODB_URI);
  try {
    await client.connect();
    const db = client.db('scholarStreamDB');
    
    const existing = await db.collection('users').findOne({ email: 'admin@scholarstream.com' });
    
    if (!existing) {
      const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const randomNum = Math.floor(10000 + Math.random() * 90000);
      
      await db.collection('users').insertOne({
        name: 'Admin User',
        email: 'admin@scholarstream.com',
        role: 'Admin',
        university: 'ScholarStream Admin',
        createdAt: new Date(),
        studentId: `SS-${dateStr}-${randomNum}`
      });
      
      console.log('✅ Created admin@scholarstream.com with Admin role');
      console.log('📧 Email: admin@scholarstream.com');
      console.log('🔐 Set password by registering with this email');
    } else {
      await db.collection('users').updateOne(
        { email: 'admin@scholarstream.com' },
        { $set: { role: 'Admin' } }
      );
      console.log('✅ Updated admin@scholarstream.com to Admin role');
    }
  } finally {
    await client.close();
  }
})();
