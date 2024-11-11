// app/api/getUrl/[shortCode]/route.ts
import { NextResponse } from 'next/server';
import { getDb } from '@/app/model/Url'; // Assuming getDb is a helper to retrieve MongoDB connection

export async function GET(req: Request, { params }: { params: { shortCode: string } }) {
  const { shortCode } = params; // Capture the shortCode from the URL

  try {
    const db = await getDb();  // Get the database connection
    const url = await db.collection('urls').findOne({ shortCode });

    if (!url) {
      // If URL doesn't exist, return 404 with an error message
      return NextResponse.json({ error: 'URL not found' }, { status: 404 });
    }

    // Check if the URL has expired
    if (url.expiresAt && new Date(url.expiresAt) < new Date()) {
      return NextResponse.json({ error: 'This URL has expired' }, { status: 410 });
    }

    // Redirect to the original URL if it's valid and not expired
    return NextResponse.redirect(url.originalUrl);
  } catch (error) {
    console.error('Error retrieving URL:', error);
    // Return a generic error message with status 500 for internal errors
    return NextResponse.json({ error: 'Error retrieving URL', details: error.message }, { status: 500 });
  }
}
