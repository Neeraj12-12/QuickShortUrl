import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs'; // To hash passwords
import jwt from 'jsonwebtoken'; // To create JSON Web Token
import { findUserByEmail } from '@/app/others/model/User';

// Your environment variables for JWT secret and database credentials
const JWT_SECRET = process.env.REACT_APP_JWT_SECRET!;
const JWT_EXPIRATION = '1h'; // Adjust token expiration as needed

// The login API route
export async function POST(req) {
  try {
    // Parse the incoming request body
    const { email, password } = await req.json();

    // Validate the request body
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }
    

    const user = await findUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Compare the password with the hashed password stored in the database
    const passwordMatch = await bcrypt.compare(password, user.password);
    
    if (!passwordMatch) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Create a JWT token
    const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: JWT_EXPIRATION,
    });

    // Return the token in the response
    return NextResponse.json(
      { token },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Something went wrong. Please try again later.' },
      { status: 500 }
    );
  }
}
