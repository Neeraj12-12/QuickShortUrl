import { NextResponse } from 'next/server';
import { findUserByVerificationId ,updateUserVerificationStatus} from '@/app/others/model/User';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET(request: Request) {
  try {
    // Extract the token from the query parameters
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
   
    if (!token) {
      return NextResponse.json({ success: false, message: 'Token is missing' }, { status: 400 });
    }

    // Find the user associated with the verification token
    const user = await findUserByVerificationId(token);

    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    if (user.isVerified) {
      return NextResponse.json({ success: true, message: 'Email already verified' }, { status: 200 });
    }

    // Update user's verification status in the database
    await updateUserVerificationStatus(user._id, true);

    // Generate a JWT token for the user
    const jwtToken = jwt.sign(
      {
        id: user._id,
        email: user.email,
        name: user.name,
      },
      JWT_SECRET,
      { expiresIn: '1h' } // Token valid for 1hour
    );

    // Set the JWT token as an HttpOnly cookie
    const response = NextResponse.json({ success: true, message: 'Email successfully verified' }, { status: 200 });
    response.cookies.set('next-auth.session-token', jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'production', // Secure in production
      path: '/',
      maxAge: 1* 24 * 60 * 60, // 1 days
    });
    
    return response;    
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json({ success: false, message: 'Invalid or expired token' }, { status: 400 });
  }
}
