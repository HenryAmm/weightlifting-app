const { MongoClient, ObjectId } = require("mongodb");

const client = new MongoClient(process.env.MONGODB_URI);
let clientPromise = client.connect();

const handler = async (event) => {
  const workoutId = event.path.split('/').pop();  // Extract workout ID from the URL

  try {
    const db = (await clientPromise).db(process.env.MONGODB_DATABASE);
    const collection = db.collection(process.env.MONGODB_COLLECTION);  // Workouts collection

    // Delete the workout by ID
    const result = await collection.deleteOne({ _id: new ObjectId(workoutId) });

    if (result.deletedCount === 0) {
      return {
        statusCode: 404,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'GET, POST, DELETE, PUT',
        },
        body: JSON.stringify({ message: "Workout not found" }),
      };
    }

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, DELETE, PUT',
      },
      body: JSON.stringify({ message: "Workout deleted successfully" }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, DELETE, PUT',
      },
      body: JSON.stringify({ message: error.message }),
    };
  }
};

module.exports = { handler };
