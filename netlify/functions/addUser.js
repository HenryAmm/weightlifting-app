const { MongoClient } = require("mongodb");

const client = new MongoClient(process.env.MONGODB_URI);
let clientPromise = client.connect();

const handler = async (event) => {
  try {
    const { username } = JSON.parse(event.body);  // Parse request body

    const db = (await clientPromise).db(process.env.MONGODB_DATABASE);
    const collection = db.collection(process.env.MONGODB_USERS_COLLECTION);  // Users collection

    // Add a new user
    const newUser = {
      username: username,
      createdAt: new Date(),
    };

    const result = await collection.insertOne(newUser);

    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',  // Allow all origins for CORS
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
      },
      body: JSON.stringify({
        _id: result.insertedId,  // Return the inserted user's ID
        username: newUser.username,
        createdAt: newUser.createdAt
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
      },
      body: JSON.stringify({ message: error.message }),
    };
  }
};

module.exports = { handler };
