// models/Url.ts
import { MongoClient, Db } from "mongodb";
import clientPromise from "../lib/mongodb";

export interface Url {
  originalUrl: string;
  shortCode: string;
  createdAt: Date;
}

export async function getDb(): Promise<Db> {
    const client = new MongoClient(process.env.MONGODB_URI!);
    await client.connect();
    const db = client.db('urlShortener'); 
  return db // Change "urlShortener" to your database name
}

export async function createUrl(url: Url) {
  const db = await getDb();
  const collection = db.collection<Url>("urls");
  return collection.insertOne(url);
}

export async function findUrlByShortCode(shortCode: string) {
  const db = await getDb();
  const collection = db.collection<Url>("urls");
  return collection.findOne({ shortCode });
}
