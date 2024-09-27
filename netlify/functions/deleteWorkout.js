const { MongoClient, ObjectId } = require("mongodb");

const client = new MongoClient(process.env.MONGODB_URI);
let clientPromise = client.connect();

const handler = async (event) => {
  const { id } = event.queryStringParameters;

  try {
    const db = (await clientPromise).db(process.env.MONGODB_DATABASE);
    const collection = db.collection(process.env.MONGODB_COLLECTION);

    await collection.deleteOne({ _id: ObjectId(id) });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Workout deleted" }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
    };
  }
};

module.exports = { handler };
