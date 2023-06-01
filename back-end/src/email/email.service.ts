import { Injectable, Logger } from "@nestjs/common";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as nodemailer from "nodemailer";
import { Transporter } from "nodemailer";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class EmailService {
  private transporter: Transporter | null;
  private readonly email;
  private readonly password;
  private readonly smtpServer;
  private readonly smtpPort;
  private readonly logger = new Logger(EmailService.name);

  constructor(private configService: ConfigService) {
    this.email = configService.get<string>("EMAIL_ADDRESS");
    this.password = configService.get<string>("EMAIL_PASSWORD");
    this.smtpServer = configService.get<string>("SMTP_SERVER");
    this.smtpPort = configService.get<string>("SMTP_PORT");
    // this.logger.verbose(
    //   this.email,
    //   this.password,
    //   this.smtpPort,
    //   this.smtpServer,
    // );
    this.logger.log(
      `Setting Up EmailService With ${this.smtpServer} as SMTP server`,
    );
    if (process.env.NODE_ENV !== "test") {
      this.transporter = nodemailer.createTransport({
        // service: "gmail",
        host: this.smtpServer,
        port: this.smtpPort,
        secure: true, // upgrade later with STARTTLS
        auth: {
          user: this.email,
          pass: this.password,
        },
      });
    } else this.transporter = null;
    // console.table(this.transporter);
  }

  async sendPasswordRecoveryEmail(to: string, token: string) {
    const mailOptions = {
      from: this.email,
      to: to,
      subject: "Password Recovery",
      html: `
      <h3>Password Recovery</h3>
      <p>To reset your password, please click the following link:</p>
      <a href="${this.configService.get(
        "EMAIL_VERIFICATION_URL",
      )}/reset_password/${token}"">Reset Password</a>
    `,
    };
    this.logger.verbose("Password recovery email sent");
    return this.transporter?.sendMail(mailOptions);
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
    return this.transporter?.sendMail(mailOptions);
  }

  async sendEmailVerification(to: string, token: string) {
    const mailOptions = {
      from: this.email,
      to: to,
      subject: "Email Verification",
      html: `
      <h3>Email Verification</h3>
      <p>To verify your email, please click the following link:</p>
      <a href="${this.configService.get(
        "EMAIL_VERIFICATION_URL",
      )}/verify_email/${token}">Verify Email</a>
    `,
    };
    return this.transporter?.sendMail(mailOptions);
  }

  // Other methods will be added here
}
