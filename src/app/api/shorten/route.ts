import { NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import getMongoClientPromise from '../../lib/mongodb';

interface iRequest {
  originalUrl: string;
  customSlug?: string;
  expiresAt?: Date | null;
}

export async function POST(req: Request) {
  try {
    const { originalUrl, customSlug, expiresAt }: iRequest = await req.json();

    // Check if the originalUrl is provided
    if (!originalUrl) {
      return NextResponse.json({ error: 'originalUrl is required' }, { status: 400 });
    }

    // Get MongoDB client
    const client = await getMongoClientPromise();
    const db = client.db('urlShortener');
    const urlsCollection = db.collection('urls');

    // Check if the long URL already exists in the database
    const existingUrl = await urlsCollection.findOne({ originalUrl });

    if (existingUrl && !customSlug) {
      // If the URL exists, return the existing short URL
      return NextResponse.json({ shortUrl: `${process.env.BASE_URL}/${existingUrl.shortCode}` });
    }

    // Use customSlug if provided, otherwise generate a new short code
    const shortCode = customSlug || nanoid(7);

    // Check if the customSlug is already taken
    const slugTaken = await urlsCollection.findOne({ shortCode });
    if (slugTaken) {
      return NextResponse.json({ error: 'Custom slug is already taken' }, { status: 400 });
    }

    // Insert the new short URL into the database
    const result = await urlsCollection.insertOne({
      originalUrl,
      shortCode,
      expiresAt: expiresAt ? new Date(expiresAt) : null, // Store the expiration date if provided
      createdAt: new Date(),
    });

    // Check if insertion was successful
    if (!result.acknowledged) {
      return NextResponse.json({ error: 'Failed to insert URL into database' }, { status: 500 });
    }

    // Return the newly created short URL
    return NextResponse.json({ shortUrl: `${process.env.BASE_URL}/${shortCode}` });

  } catch (error) {
    console.error('Error creating shortened URL:', error);
    return NextResponse.json({ error: 'An error occurred', details: error.message }, { status: 500 });
  }
}
