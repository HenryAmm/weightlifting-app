const { MongoClient, ObjectId } = require("mongodb");

const client = new MongoClient(process.env.MONGODB_URI);
let clientPromise = client.connect();

const handler = async (event) => {
  if (event.httpMethod === 'DELETE') {
    const workoutId = event.path.split('/').pop();  // Extract the workout ID from the URL

    try {
      const db = (await clientPromise).db(process.env.MONGODB_DATABASE);
      const collection = db.collection(process.env.MONGODB_COLLECTION);  // Workouts collection

      const result = await collection.deleteOne({ _id: new ObjectId(workoutId) });

      if (result.deletedCount === 0) {
        return {
          statusCode: 404,
          body: JSON.stringify({ message: "Workout not found" }),
        };
      }

      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Workout deleted successfully" }),
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ message: error.message }),
      };
    }
  }

  return {
    statusCode: 405,  // Method Not Allowed for non-DELETE methods
    body: JSON.stringify({ message: "Method not allowed" }),
  };
};

module.exports = { handler };
