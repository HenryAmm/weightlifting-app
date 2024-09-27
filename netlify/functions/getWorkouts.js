const { MongoClient } = require("mongodb");

const client = new MongoClient(process.env.MONGODB_URI);
let clientPromise = client.connect();  // Promised client for reuse

const handler = async (event) => {
  try {
    const db = (await clientPromise).db(process.env.MONGODB_DATABASE);
    const collection = db.collection(process.env.MONGODB_COLLECTION);
    
    const workouts = await collection.find().toArray();  // Example query to get workouts
    
    return {
      statusCode: 200,
      body: JSON.stringify(workouts),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
    };
  }
};

module.exports = { handler };
