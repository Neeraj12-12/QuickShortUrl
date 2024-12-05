import nodemailer from 'nodemailer';

export async function sendVerificationEmail(email, verificationLink) {
  try {
    // Create a transporter object
    const transporter = nodemailer.createTransport({
      service: 'Gmail', // You can use other services like 'SendGrid', 'Mailgun', etc.
      auth: {
        user: process.env.EMAIL_SERVER_USER, // Your email address
        pass: process.env.EMAIL_SERVER_PASSWORD, // Your email password or app-specific password
      },
    });

    // Define the email options
    const mailOptions = {
      from: 'YourAppName <no-reply@yourapp.com>', // Sender name and email
      to: email, // Recipient's email
      subject: 'Verify your email address',
      html: `
        <h1>Welcome to YourAppName!</h1>
        <p>Thank you for registering. Please verify your email address by clicking the link below:</p>
        <a href="${verificationLink}" target="_blank">Verify Email</a>
        <p>If you didn't create an account, you can safely ignore this email.</p>
      `,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);

    console.log('Verification email sent:', info.messageId);
    return true; // Indicate success
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw new Error('Failed to send verification email');
  }
}
