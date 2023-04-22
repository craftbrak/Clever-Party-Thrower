import { Injectable } from "@nestjs/common";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as nodemailer from "nodemailer";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class EmailService {
  private transporter;
  private email;

  constructor(private configService: ConfigService) {
    this.email = configService.get<string>("EMAIL_ADDRESS");
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: this.email,
        pass: configService.get<string>("EMAIL_PASSWORD"),
      },
    });
  }

  async sendPasswordRecoveryEmail(to: string, token: string) {
    const mailOptions = {
      from: this.email,
      to: to,
      subject: "Password Recovery",
      html: `
      <h3>Password Recovery</h3>
      <p>To reset your password, please click the following link:</p>
      <a href="https://your-app-url.com/reset-password?token=${token}">Reset Password</a>
    `,
    };
    return this.transporter.sendMail(mailOptions);
  }

  async send2FAEmail(to: string, code: string) {
    const mailOptions = {
      from: this.email,
      to: to,
      subject: "Two-Factor Authentication",
      html: `
      <h3>Two-Factor Authentication</h3>
      <p>Your 2FA code is: ${code}</p>
    `,
    };
    return this.transporter.sendMail(mailOptions);
  }

  async sendEmailVerification(to: string, token: string) {
    const mailOptions = {
      from: this.email,
      to: to,
      subject: "Email Verification",
      html: `
      <h3>Email Verification</h3>
      <p>To verify your email, please click the following link:</p>
      <a href="https://${this.configService.get(
        "EMAIL_VERIFICATION_URL",
      )}/auth/${token}">Verify Email</a>
    `,
    };
    return this.transporter.sendMail(mailOptions);
  }

  // Other methods will be added here
}
