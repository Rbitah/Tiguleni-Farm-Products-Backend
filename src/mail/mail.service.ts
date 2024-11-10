import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter
  constructor(
    
    private readonly configService: ConfigService,
  ) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('HOST'),
      port: this.configService.get<number>('PORT'),
      secure: false,
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASS'),
      },
    });
  }

  async sendWelcomeEmail(to: string, username: string): Promise<void> {
    const mailOptions: nodemailer.SendMailOptions = {
      from: `"Tiguleni Marketplace" <${this.configService.get('EMAIL_USER')}>`,
      to: to,
      subject: 'Welcome to Tiguleni Marketplace!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; background-color: #f9f9f9; color: #333;">
          <h2 style="color: #007BFF; text-align: center; margin-bottom: 24px;">Welcome to Tiguleni Marketplace, ${username}!</h2>
          <p style="font-size: 16px; line-height: 1.5; color: #555;">
            Hello ${username},
          </p>
          <p style="font-size: 16px; line-height: 1.5; color: #555;">
            Thank you for signing up with Tiguleni Marketplace. We're thrilled to have you on board!
          </p>
          <p style="font-size: 16px; line-height: 1.5; color: #555;">
            Explore our platform and discover a variety of products and services tailored just for you.
          </p>
          <p style="font-size: 14px; color: #999; text-align: center; margin-top: 20px;">
            Happy shopping,<br/>The Tiguleni Team
          </p>
        </div>
      `,
      text: `Welcome to Tiguleni Marketplace, ${username}! Thank you for signing up with us.`,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Welcome email sent successfully');
    } catch (error) {
      console.error('Error sending welcome email:', error);
      throw new Error(`Failed to send welcome email: ${error.message || JSON.stringify(error)}`);
    }
  }

  async sendResetPasswordEmail(to: string, token: string): Promise<void> {
    const mailOptions: nodemailer.SendMailOptions = {
      from: `"Tiguleni Marketplace" <${this.configService.get('EMAIL_USER')}>`,
      to: to,
      subject: 'Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; background-color: #f9f9f9; color: #333;">
          <h2 style="color: #007BFF; text-align: center; margin-bottom: 24px;">Password Reset Request</h2>
          <p style="font-size: 16px; line-height: 1.5; color: #555;">
            Hello,
          </p>
          <p style="font-size: 16px; line-height: 1.5; color: #555;">
            We received a request to reset your password for your Tiguleni account. Please use the following code to reset your password:
          </p>
          <div style="text-align: center; margin: 20px 0;">
            <span style="display: inline-block; font-size: 24px; font-weight: bold; color: #007BFF; padding: 10px 20px; border: 1px solid #007BFF; border-radius: 5px;">${token}</span>
          </div>
          <p style="font-size: 16px; line-height: 1.5; color: #555;">
            This code will expire in 15 minutes. If you did not request this, please ignore this email. Your password will remain unchanged.
          </p>
          <p style="font-size: 14px; color: #999; text-align: center; margin-top: 20px;">
            Thank you,<br/>The Tiguleni Team
          </p>
        </div>
      `,
      text: `Your password reset code is: ${token}`,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Password reset email sent successfully');
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw new Error(`Failed to send email: ${error.message || JSON.stringify(error)}`);
    }
  }  
}
