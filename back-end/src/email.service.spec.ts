import { Test, TestingModule } from "@nestjs/testing";
import { EmailService } from "./email/email.service";
import { ConfigModule } from "@nestjs/config";

const sendMailMock = jest.fn();

jest.mock("nodemailer", () => ({
  createTransport: () => ({
    sendMail: sendMailMock,
  }),
}));

describe("EmailService", () => {
  let emailService: EmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
      ],
      providers: [EmailService],
    }).compile();

    emailService = module.get<EmailService>(EmailService);
  });
  afterEach(() => {
    sendMailMock.mockClear();
  });

  it("should be defined", () => {
    expect(emailService).toBeDefined();
  });

  it("should send password recovery email", async () => {
    const to = "user@example.com";
    const token = "password-recovery-token";

    await emailService.sendPasswordRecoveryEmail(to, token);
    expect(sendMailMock).toHaveBeenCalled();
  });

  it("should send 2FA email", async () => {
    const to = "user@example.com";
    const code = "123456";

    await emailService.send2FAEmail(to, code);
    expect(sendMailMock).toHaveBeenCalled();
  });

  it("should send email verification", async () => {
    const to = "user@example.com";
    const token = "email-verification-token";

    await emailService.sendEmailVerification(to, token);
    expect(sendMailMock).toHaveBeenCalled();
  });
});
