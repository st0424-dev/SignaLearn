import { MongoClient, ServerApiVersion } from "mongodb";

const client = new MongoClient("mongodb://localhost:27017", {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

export const database = client.db("dev");

export async function connectToMongodb() {
  try {
    await client.connect();
    return true;
  }
  catch {
    return false;
  }
}
