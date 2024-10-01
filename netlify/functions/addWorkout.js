const { MongoClient, ObjectId } = require("mongodb");

const client = new MongoClient(process.env.MONGODB_URI);
let clientPromise = client.connect();

const handler = async (event) => {
  try {
    const db = (await clientPromise).db(process.env.MONGODB_DATABASE);
    const collection = db.collection(process.env.MONGODB_COLLECTION);

    // Parse the incoming request body
    const body = JSON.parse(event.body);
    const { exercise, sets, user } = body;

    // Structure the workout with an array of sets
    const newWorkout = {
      exercise,
      sets: sets.map(set => ({ weight: Number(set.weight), reps: Number(set.reps) })),
      user: new ObjectId(user),
      date: new Date()
    };

    // Insert the workout into the database
    const result = await collection.insertOne(newWorkout);

    return {
      statusCode: 201,
      body: JSON.stringify(result.ops[0]),
    };
  } catch (error) {
    console.error('Error adding workout:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error adding workout', error: error.message }),
    };
  }
};

module.exports = { handler };
