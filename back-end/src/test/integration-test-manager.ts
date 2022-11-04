import { Test } from "@nestjs/testing";
import { AppModule } from "../app.module";
import { INestApplication } from "@nestjs/common";
import { AuthService } from "../auth/auth.service";
import { DataSource } from "typeorm";
import { User } from "../user/entities/user.entity";
import { testUser } from "./mock/user.mock";
import { AuthLoginOutput } from "../auth/dto/auth-login.dto";

export class IntegrationTestManager {
  private app: INestApplication;
  private _dataSource: DataSource;

  get dataSource(): DataSource {
    return this._dataSource;
  }

  private _httpServer: any;

  get httpServer(): any {
    return this._httpServer;
  }

  private _accessToken: AuthLoginOutput;

  get accessToken(): AuthLoginOutput {
    return this._accessToken;
  }

  async beforeAll(): Promise<void> {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    this.app = moduleRef.createNestApplication();
    await this.app.init();
    this._httpServer = this.app.getHttpServer();
    const authService = this.app.get<AuthService>(AuthService);
    this._dataSource = moduleRef.get(DataSource);
    const userRepo = this._dataSource.getRepository<User>(User);
    const user = await userRepo.findOneByOrFail({ email: testUser.email });
    this._accessToken = await authService.login(user);
  }

  async afterAll() {
    await this.app.close();
  }
}
