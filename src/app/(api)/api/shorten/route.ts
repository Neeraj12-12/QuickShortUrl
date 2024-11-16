import { NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import getMongoClientPromise from '@/app/others/lib/mongodb';

interface iRequest {
  originalUrl: string;
  customSlug?: string;
  expiresAt?: Date | null;
  userId?: string;  // Added userId to differentiate between anonymous and logged-in users
}

export async function POST(req: Request) {
  try {
    const { originalUrl, customSlug, expiresAt, userId }: iRequest = await req.json();

    // Check if the originalUrl is provided
    if (!originalUrl) {
      return NextResponse.json({ error: 'originalUrl is required' }, { status: 400 });
    }

    // Get MongoDB client
    const client = await getMongoClientPromise();
    const db = client.db('urlShortener');
    const urlsCollection = db.collection('urls');

    // Check if the customSlug is already taken for any URL
    if (customSlug) {
      const slugTaken = await urlsCollection.findOne({
        "shortUrls": { 
          $elemMatch: { shortCode: customSlug }
        }
      });

      if (slugTaken) {
        return NextResponse.json({ error: 'Custom slug is already taken' }, { status: 400 });
      }
    }

    // Check if the long URL already exists in the database
    const existingUrl = await urlsCollection.findOne({ originalUrl });

    if(existingUrl && customSlug)
    {
      const newShortCode = customSlug || nanoid(7);
          await urlsCollection.updateOne(
            { originalUrl },
            { $push: { shortUrls: { shortCode: newShortCode, isActive: true, expiresAt, userId,  createdAt: new Date()  } } }
          );
          return NextResponse.json({ shortUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/${newShortCode}` });
    }

    if (existingUrl) {
      // Case 1: Existing long URL, check for anonymous or logged-in user
      if (!userId) {
        // Case 1A: Anonymous user
        const anonymousShortUrl = existingUrl.shortUrls.find((url: any) => !url.userId);
        if (anonymousShortUrl) {
          return NextResponse.json({ shortUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/${anonymousShortUrl.shortCode}` });
        } else {
          // Create new anonymous short URL
          const newShortCode = nanoid(7);
          await urlsCollection.updateOne(
            { originalUrl },
            { $push: { shortUrls: { shortCode: newShortCode, expiresAt, userId: null, createdAt: new Date() } } }
          );
          return NextResponse.json({ shortUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/${newShortCode}` });
        }
      } else {
        // Case 1B: Logged-in user
        const userShortUrl = existingUrl.shortUrls.find((url: any) => url.userId === userId);
        if (userShortUrl) {
          return NextResponse.json({ shortUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/${userShortUrl.shortCode}` });
        } else {
          // Create new short URL for logged-in user
          const newShortCode = customSlug || nanoid(7);
          await urlsCollection.updateOne(
            { originalUrl },
            { $push: { shortUrls: { shortCode: newShortCode,  expiresAt, userId , createdAt: new Date() } } }
          );
          return NextResponse.json({ shortUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/${newShortCode}` });
        }
      }
    } else {
      // Case 2: Long URL does not exist in the database, create a new entry
      const shortCode = customSlug || nanoid(7);

      // Insert new URL with the generated or custom short code
      const newUrl = {
        originalUrl,
        shortUrls: [
          {
            shortCode,
            userId: userId || null,  // Anonymous user won't have a userId
            expiresAt: expiresAt ? new Date(expiresAt) : null,
            createdAt: new Date(),
          }
        ],
      };

      const result = await urlsCollection.insertOne(newUrl);

      // Check if insertion was successful
      if (!result.acknowledged) {
        return NextResponse.json({ error: 'Failed to insert URL into database' }, { status: 500 });
      }

      // Return the newly created short URL
      return NextResponse.json({ shortUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/${shortCode}` });
    }

  } catch (error) {
    console.error('Error creating shortened URL:', error);
    return NextResponse.json({ error: 'An error occurred', details: error.message }, { status: 500 });
  }
}
