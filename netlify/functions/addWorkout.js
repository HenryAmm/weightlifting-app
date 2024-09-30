const { MongoClient, ObjectId } = require("mongodb");

const client = new MongoClient(process.env.MONGODB_URI);
let clientPromise = client.connect();

const handler = async (event) => {
  try {
    const { exercise, weight, reps, sets, user } = JSON.parse(event.body);  // Parse the request body

    const db = (await clientPromise).db(process.env.MONGODB_DATABASE);
    const collection = db.collection(process.env.MONGODB_COLLECTION);  // Workouts collection

    const newWorkout = {
      exercise,
      weight: Number(weight),
      reps: Number(reps),
      sets: Number(sets),
      user: new ObjectId(user),  // Ensure userId is saved as ObjectId
      date: new Date(),
    };

    const result = await collection.insertOne(newWorkout);

    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
      },
      body: JSON.stringify({ ...newWorkout, _id: result.insertedId }),  // Return the newly created workout
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
