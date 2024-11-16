// models/User.ts
import { MongoClient, Db } from "mongodb";

export interface User {
  username: string;
  email: string;
  phone?: string;
  password?: string;
  createdAt: Date;
  referBy: "emailPass" | "google";
}

export async function getDb(): Promise<Db> {
  const client = new MongoClient(process.env.REACT_APP_MONGODB_URI!);
  await client.connect();
  const db = client.db('urlShortener');
  return db;
}

export async function createUser(user: User) {
  const db = await getDb();
 
    const collection = db.collection<User>("usersData");
    return collection.insertOne(user);
  
  }
  

export async function findUserByEmail(email: string) {
  const db = await getDb();
  const collection = db.collection<User>("usersData");
  return collection.findOne({ email });
}

export async function findUserById(userId: string) {
  const db = await getDb();
  const collection = db.collection<User>("users");
  return collection.findOne({ _id: new MongoClient.ObjectID(userId) });
}
