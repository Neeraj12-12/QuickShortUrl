// models/History.ts
import { MongoClient, Db } from "mongodb";

export interface History {
  userId: string;
  urlId: string;
  action: string;
  timestamp: Date;
}

export async function getDb(): Promise<Db> {
  const client = new MongoClient(process.env.REACT_APP_MONGODB_URI!);
  await client.connect();
  const db = client.db('url-shortener');
  return db;
}

export async function logHistory(history: History) {
  const db = await getDb();
  const collection = db.collection<History>("history");
  return collection.insertOne(history);
}

export async function getHistoryForUser(userId: string) {
  const db = await getDb();
  const collection = db.collection<History>("history");
  return collection.find({ userId }).toArray();
}
