const mongoose = require('mongoose');

/**
 * Build a safe, minimal Mongo connection options object.
 * Mongoose v8 uses the new URL parser and unified topology by default.
 */
function buildMongoOptions() {
  return {
    // Keep this intentionally small; add options only when needed.
  };
}

// PUBLIC_INTERFACE
async function connectToDatabase() {
  /**
   * Connects to MongoDB using environment variables.
   *
   * Required env vars:
   * - MONGODB_URL: MongoDB connection URI
   * - MONGODB_DB: Database name
   */
  const mongoUri = process.env.MONGODB_URL;
  const dbName = process.env.MONGODB_DB;

  if (!mongoUri) {
    throw new Error('Missing required environment variable: MONGODB_URL');
  }
  if (!dbName) {
    throw new Error('Missing required environment variable: MONGODB_DB');
  }

  mongoose.set('strictQuery', true);

  await mongoose.connect(mongoUri, {
    dbName,
    ...buildMongoOptions(),
  });

  return mongoose.connection;
}

module.exports = {
  connectToDatabase,
};

