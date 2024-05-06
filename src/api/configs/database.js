import { MongoClient } from 'mongodb';

const client = new MongoClient('mongodb://127.0.0.1:27017');
const dbName = 'padi';

export async function connect() {
  await client.connect();
  console.log('Connected to MongoDB');
}

export function getDb() {
  return client.db(dbName);
}
