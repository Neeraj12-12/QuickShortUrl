import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import getMongoClientPromise from '@/app/others/lib/mongodb';

interface iRequest {
  userName: string;
  email: string;
  password: string;
}

export async function POST(req: Request) {
  try {
    const { userName, email, password }: iRequest = await req.json();

    // Check if the name, email, and password are provided
    if (!userName || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
    }

    // Check email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    // Check if password is strong enough (minimum length of 8 and includes a number and a letter)
    const passwordStrengthRegex = /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/;
    if (!passwordStrengthRegex.test(password)) {
      return NextResponse.json({ error: 'Password must be at least 8 characters long and contain both letters and numbers' }, { status: 400 });
    }

    // Get MongoDB client
    const client = await getMongoClientPromise();
    const db = client.db('urlShortener');
    const usersCollection = db.collection('usersData');

    // Check if the email already exists in the database
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    const result = await usersCollection.insertOne({
      userName,
      email,
      password: hashedPassword,
      createdAt: new Date(),
    });

    // Check if insertion was successful
    if (!result.acknowledged) {
      return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
    }

    // Return a success message
    return NextResponse.json({ message: 'User created successfully' });

  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'An error occurred', details: error.message }, { status: 500 });
  }
}
