// models/Url.ts
import { MongoClient, Db } from "mongodb";

export interface Url {
  originalUrl: string;
  shortUrl: string;
  customSlug?: string;     // Optional custom slug
  password?: string;       // Optional password
  expiryDate?: Date;       // Optional expiration date
  createdAt: Date;         // Creation timestamp
  updatedAt: Date;         // Timestamp of last update
  isActive: boolean;       // URL is active or not
  userId: string;
}

export async function getDb(): Promise<Db> {
  const client = new MongoClient(process.env.REACT_APP_MONGODB_URI!);
  await client.connect();
  const db = client.db('url-shortener');
  return db;  // Change "urlShortener" to your database name
}

export async function createUrl(url: Url) {
  const db = await getDb();
  const collection = db.collection<Url>("urls");
  return collection.insertOne({ ...url, createdAt: new Date(), updatedAt: new Date(), isActive: true });
}

export async function findUrlByShortCode(shortCode: string) {
  const db = await getDb();
  const collection = db.collection<Url>("urls");
  return collection.findOne({ shortUrl: shortCode });
}

// Update URL with new data
export async function updateUrl(shortCode: string, data: Partial<Url>) {
  const db = await getDb();
  const collection = db.collection<Url>("urls");
  return collection.updateOne({ shortUrl: shortCode }, { $set: { ...data, updatedAt: new Date() } });
}

// Find active URL by shortCode and expiry check
export async function findActiveUrlByShortCode(shortCode: string) {
  const db = await getDb();
  const collection = db.collection<Url>("urls");
  return collection.findOne({
    shortUrl: shortCode,
    isActive: true,
    $or: [{ expiryDate: { $exists: false } }, { expiryDate: { $gte: new Date() } }],
  });
}
