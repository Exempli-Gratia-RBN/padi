import { MongoClient } from "mongodb";
import "dotenv/config";

const client = new MongoClient(process.env.MONGODB_URI);
const dbName = "padi";

export async function connect() {
  await client.connect();
  console.log("Connected to MongoDB");
}

export function getDb() {
  return client.db(dbName);
}
