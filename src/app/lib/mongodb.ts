// lib/mongodb.ts
import { MongoClient, MongoClientOptions } from "mongodb";

const uri = process.env.MONGODB_URI!;

// Define the options for the MongoDB client
const options: MongoClientOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

// Check if the MongoDB URI is provided
if (!process.env.MONGODB_URI) {
  throw new Error("Please add your MongoDB URI to .env.local");
}

// Create a single MongoDB client instance for the application
async function getMongoClient(): Promise<MongoClient> {
  if (!client) {
    client = new MongoClient(uri, options);
    await client.connect();
  }
  return client;
}

// Get the MongoDB client promise
export default async function getMongoClientPromise(): Promise<MongoClient> {
  if (!clientPromise) {
    clientPromise = getMongoClient();
  }
  return clientPromise;
}