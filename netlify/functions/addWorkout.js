const { MongoClient } = require("mongodb");

const client = new MongoClient(process.env.MONGODB_URI);
let clientPromise = client.connect();

const handler = async (event) => {
  const { exercise, weight, reps, sets, user } = JSON.parse(event.body);

  try {
    const db = (await clientPromise).db(process.env.MONGODB_DATABASE);
    const collection = db.collection(process.env.MONGODB_COLLECTION);

    const newWorkout = {
      exercise,
      weight: Number(weight),
      reps: Number(reps),
      sets: Number(sets),
      user,  // Associate the workout with a user
      date: new Date(),
    };

    await collection.insertOne(newWorkout);

    return {
      statusCode: 201,
      body: JSON.stringify(newWorkout),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
    };
  }
};

module.exports = { handler };
