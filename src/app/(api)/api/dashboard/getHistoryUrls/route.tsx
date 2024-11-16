import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import getMongoClientPromise from '@/app/others/lib/mongodb';

export async function GET(req: Request) {
  try {
    // Extract userId from cookies
    const cookieStore = cookies();
    const userId = cookieStore.get('userId')?.value  || "1234";

    // Validate the userId
    if (!userId) {
      return NextResponse.json({ error: 'User ID not found in cookies' }, { status: 400 });
    }

    // Get MongoDB client and connect to the database
    const client = await getMongoClientPromise();
    const db = client.db('urlShortener');
    const urlsCollection = db.collection('urls');

    // Find all documents for the given userId
    const userUrls = await urlsCollection.find({ "shortUrls.userId": userId }).toArray();

    if (userUrls.length === 0) {
      return NextResponse.json({ message: 'No URLs found for this userId' }, { status: 404 });
    }

    // Prepare the response
    const response = userUrls.map((url) => ({
      originalUrl: url.originalUrl,
      shortUrls: url.shortUrls.filter((shortUrl: any) => shortUrl.userId === userId),
    }));

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error fetching history URLs:', error);
    return NextResponse.json({ error: 'An error occurred', details: error.message }, { status: 500 });
  }
}
