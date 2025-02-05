import { transporter } from '@/lib/nodemailer';
import VerificationEmail from '../../emails/VerificationEmail';
import { render } from '@react-email/render';
import { ApiResponse } from '@/types/ApiResponse';

interface SendVerificationEmailProps {
  email: string;
  username: string;
  otp: string;
}

export async function sendVerificationEmail({
  email,
  username,
  otp,
}: SendVerificationEmailProps): Promise<ApiResponse> {
  try {
    // Render the email template to HTML string
    const emailHtml = await render(
      <VerificationEmail username={username} otp={otp} />
    );

    // const emailHtml = "<html><body><h1>Test Email</h1><p>Your OTP is: 123456</p></body></html>";

    
    // Log the rendered HTML to check for correctness
    console.log("Rendered HTML:", emailHtml);

    // Send the email using Nodemailer
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: email, // Ensure the 'to' field is set correctly
      subject: 'Your Verification Code',
      html: emailHtml, // Pass the rendered HTML string here
    });

    console.log('Verification email sent successfully');
    return { success: true, message: 'Verification email sent successfully.' };
  } catch (error) {
    console.error('Error sending verification email:', error);
    return { success: false, message: 'Failed to send verification email.' };
  }
}
