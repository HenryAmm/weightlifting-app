const { MongoClient } = require("mongodb");

const client = new MongoClient(process.env.MONGODB_URI);
let clientPromise = client.connect();

const handler = async (event) => {
  try {
    const db = (await clientPromise).db(process.env.MONGODB_DATABASE);
    // Hardcoding the collection name for debugging
    const collection = db.collection('users');  // Replace with the actual name of your users collection

    // Fetch all users
    const users = await collection.find({}).toArray();

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',  // Allow all origins for CORS
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
      },
      body: JSON.stringify(users),
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
