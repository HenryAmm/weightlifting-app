const { MongoClient } = require("mongodb");

const client = new MongoClient(process.env.MONGODB_URI);
let clientPromise = client.connect();

const handler = async (event) => {
  const userId = event.queryStringParameters.userId;  // Extract userId from query string

  try {
    const db = (await clientPromise).db(process.env.MONGODB_DATABASE);
    const collection = db.collection(process.env.MONGODB_COLLECTION);

    // Query MongoDB to fetch workouts for the specific user
    const workouts = await collection.find({ user: userId }).toArray();

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
