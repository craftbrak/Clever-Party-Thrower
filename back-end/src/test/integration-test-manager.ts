import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "../app.module";
import { INestApplication } from "@nestjs/common";
import { AuthService } from "../auth/auth.service";
import { DataSource } from "typeorm";
import { User } from "../user/entities/user.entity";
import { AuthLoginOutput } from "../auth/dto/auth-login.dto";
import { testUser } from "./mock/user.mock";
import { AddressService } from "../address/address.service";
import { addressMock } from "./mock/address.mock";
import { UserService } from "../user/user.service";
import { Address } from "../address/entities/address.entity";
import { Country } from "../address/entities/country.entity";

export class IntegrationTestManager {
  private app: INestApplication;
  private _moduleRef: TestingModule;

  private _testCountry: Country;

  get testCountry(): Country {
    return this._testCountry;
  }

  private _testAddress: Address;

  get testAddress(): Address {
    return this._testAddress;
  }

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
    this._moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    this.app = this._moduleRef.createNestApplication();
    await this.app.init();
    await this.setup();
    this._httpServer = this.app.getHttpServer();

    const authService = this.app.get<AuthService>(AuthService);
    this._dataSource = this._moduleRef.get(DataSource);
    const userRepo = this._dataSource.getRepository<User>(User);
    const user = await userRepo.findOneByOrFail({ email: testUser.email });
    this._accessToken = await authService.login(user);
  }

  async afterAll() {
    await this.teardown();
    await this.app.close();
  }

  async setup(): Promise<void> {
    const addressService = this._moduleRef.get<AddressService>(AddressService);
    await addressService.onApplicationBootstrap();
    this._testCountry = await addressService.findOneCountryByCode("BEL");
    this._testAddress = await addressService.create({
      ...addressMock,
      countryId: this._testCountry.id,
    });
    const userService = this._moduleRef.get<UserService>(UserService);
    await userService.create({ ...testUser, addressId: this._testAddress.id });
    console.log("setup finished");
  }

  async teardown(): Promise<void> {
    await this.dataSource.dropDatabase();
    console.log("teared down");
  }
}
