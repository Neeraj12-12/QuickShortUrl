// models/User.ts
import { object } from "framer-motion/client";
import { MongoClient, Db, ObjectId } from "mongodb";

export interface User {
  username: string;
  email: string;
  phone?: string;
  password?: string;
  createdAt: Date;
  isVerified: boolean,
  image?: string | null,
  referBy?: "emailPass" | "google";
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
  const collection = db.collection<User>("usersData");
  return collection.findOne({ _id: new ObjectId(userId) });
}


export async function findUserByVerificationId(verificationToken: string) {
  const db = await getDb();
  const collection = db.collection<User>("usersData");
  return collection.findOne({ verificationToken });
}

export async function updateUserVerificationStatus(userId: ObjectId, isVerified: boolean) {
  const db = await getDb();
  const collection = db.collection<User>("usersData");
  
  return collection.updateOne(
    { _id: new ObjectId(userId) }, // Match the user by ID
    { $set: { isVerified: isVerified } } // Update the "verified" field
  );
}