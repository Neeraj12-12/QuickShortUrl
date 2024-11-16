import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import EmailProvider from 'next-auth/providers/email';
import nodemailer from 'nodemailer'; // Using import instead of require

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
      sendVerificationRequest: ({ identifier: email, url, provider }) => {
        const { server, from } = provider;

        // Extract the host of the URL for logging purposes or custom logic
        const { host } = new URL(url);
        
        // Set up mail options
        const mailOptions = {
          to: email,
          from: from,
          subject: 'Sign in to our app',
          text: `Sign in to our app using this link: ${url}`,
          html: `<p>Sign in to our app using this <a href="${url}">link</a></p>`,
        };

        // Configure Nodemailer transporter
        const transporter = nodemailer.createTransport({
          host: server.host,
          port: server.port,
          auth: {
            user: server.auth.user,
            pass: server.auth.pass,
          },
        });

        // Send the email
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error("Error sending email:", error);
          } else {
            console.log("Message sent:", info.messageId);
          }
        });
      },
    }),
  ],
  pages: {
    signIn: '/auth/signin', // Custom sign-in page
    error: '/auth/error', // Error page for authentication issues
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
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
