import mongoose from 'mongoose';

/**
 * Migration Script: Local MongoDB -> MongoDB Atlas
 * Usage:
 *   node migrateToAtlas.js "mongodb+srv://<username>:<password>@cluster0.mongodb.net/mykouch?retryWrites=true&w=majority"
 */

const atlasUri = process.argv[2] || process.env.ATLAS_URI;
const localUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mykouch';

if (!atlasUri) {
  console.error('\n❌ ERROR: Please provide your MongoDB Atlas connection string as an argument.');
  console.log('\nUsage:');
  console.log('  node migrateToAtlas.js "mongodb+srv://<username>:<password>@cluster0.mongodb.net/mykouch?retryWrites=true&w=majority"\n');
  process.exit(1);
}

async function migrate() {
  console.log('\n[1/4] Connecting to Local MongoDB...');
  const localConn = await mongoose.createConnection(localUri).asPromise();
  console.log('  ✓ Connected to Local MongoDB:', localUri);

  console.log('\n[2/4] Connecting to MongoDB Atlas Cloud...');
  const atlasConn = await mongoose.createConnection(atlasUri).asPromise();
  console.log('  ✓ Connected to MongoDB Atlas Cloud successfully!');

  console.log('\n[3/4] Reading all collections from local database...');
  const collections = await localConn.db.listCollections().toArray();

  for (const col of collections) {
    const colName = col.name;
    if (colName.startsWith('system.')) continue;

    const localCol = localConn.db.collection(colName);
    const atlasCol = atlasConn.db.collection(colName);

    const docs = await localCol.find({}).toArray();
    console.log(`\n  Transferring "${colName}" (${docs.length} records)...`);

    if (docs.length > 0) {
      // Clear target collection in Atlas first to prevent duplicate _id conflicts
      await atlasCol.deleteMany({});
      await atlasCol.insertMany(docs);
      console.log(`  ✓ Successfully migrated ${docs.length} records into Atlas "${colName}"`);
    } else {
      console.log(`  - No records found in "${colName}", skipping.`);
    }
  }

  console.log('\n[4/4] Verifying migrated records in MongoDB Atlas:');
  for (const col of collections) {
    const count = await atlasConn.db.collection(col.name).countDocuments();
    console.log(`  - ${col.name}: ${count} records in Atlas`);
  }

  await localConn.close();
  await atlasConn.close();

  console.log('\n🎉 ALL DATA HAS BEEN SUCCESSFULLY MIGRATED TO MONGODB ATLAS!\n');
}

migrate().catch((err) => {
  console.error('\n❌ Migration Failed:', err.message);
  process.exit(1);
});
