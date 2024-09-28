const { MongoClient, ObjectId } = require("mongodb");

const client = new MongoClient(process.env.MONGODB_URI);
let clientPromise = client.connect();

const handler = async (event) => {
  const userId = event.queryStringParameters.userId;  // Extract userId from query string

  try {
    const db = (await clientPromise).db(process.env.MONGODB_DATABASE);
    const collection = db.collection(process.env.MONGODB_COLLECTION);

    // Convert userId to ObjectId if it's stored as ObjectId in MongoDB
    const workouts = await collection.find({ user: ObjectId(userId) }).toArray();

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',  // Allow all origins for CORS
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
      },
      body: JSON.stringify(workouts),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',  // Ensure CORS headers are present in error responses too
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
      },
      body: JSON.stringify({ message: error.message }),
    };
  }
};

module.exports = { handler };
