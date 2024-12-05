import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import EmailProvider from 'next-auth/providers/email';
import nodemailer from 'nodemailer'; // Using import instead of require
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import getMongoClientPromise from '@/app/others/lib/mongodb';

const authOptions = {
  session: {
    strategy: 'jwt',
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
      sendVerificationRequest: async ({ identifier: email, url, provider }) => {
        console.log('Sending email verification request:', { email, url, provider });
        const { server, from } = provider;


        const transporter = nodemailer.createTransport({
          host: server.host,
          port: server.port,
          secure: server.port == 465, // True for port 465 (SSL), false for others
          auth: {
            user: server.auth.user,
            pass: server.auth.pass,
          },
        });

        const magicLink = `${url}`;
        const mailOptions = {
          from,
          to: email,
          subject: 'Sign in to our app',
          text: `Sign in to our app using this link: ${magicLink}`,
          html: `<p>Sign in to our app using this <a href="${magicLink}">link</a></p>`
        };

        try {
          const result = await transporter.sendMail(mailOptions);
          console.log('Email sent successfully:', result.messageId);
        } catch (error) {
          console.error('Error sending email:', error);
          throw new Error('Unable to send verification email.');
        }
      }
    }),
  ],
  adapter: MongoDBAdapter(getMongoClientPromise()),
  pages: {
    signIn: "/auth/signin", // Custom sign-in page
    error: "/auth/error", // Error page
  },
  callbacks: {
  
    async jwt({ token, account, user }) {
      if (account && user) {
        token.accessToken = account.access_token;
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.image = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.accessToken = token.accessToken;
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.image = token.image;
      }
      return session;
    },

    // async changeeStatus(){
    //  //write code to change status after magic link verificication 
    //  return true;
    // }
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };


/**
 * Checks if a user exists in the database by their email.
 * @param email - The email to check.
 * @returns A boolean indicating whether the user exists.
 */
export async function userExists(email: string): Promise<boolean> {
  const client = await getMongoClientPromise();
  const db = client.db(); // Adjust this if you need a specific DB name
  const user = await db.collection("users").findOne({ email });
  return !!user; // Returns true if user exists, otherwise false
}

/**
 * Links a new OAuth account to an existing user account.
 * @param email - The email of the user.
 * @param account - The OAuth account data to link.
 */
export async function linkNewAccountToUser(email: string, account: any): Promise<void> {
  const client = await getMongoClientPromise();
  const db = client.db(); // Adjust this if you need a specific DB name

  // Find the user by email
  const user = await db.collection("users").findOne({ email });
  if (!user) {
    throw new Error("User not found");
  }

  // Prepare the account data to insert
  const accountData = {
    userId: user._id,
    provider: account.provider,
    providerAccountId: account.id,
    access_token: account.access_token,
    refresh_token: account.refresh_token,
    createdAt: new Date(), // Optional: Add a creation timestamp
    updatedAt: new Date(), // Optional: Add an update timestamp
  };

  // Insert the account data into the accounts collection
  await db.collection("accounts").insertOne(accountData);
}