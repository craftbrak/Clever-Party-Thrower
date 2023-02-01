import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "../app.module";
import { INestApplication } from "@nestjs/common";
import { AuthService } from "../auth/auth.service";
import { DataSource } from "typeorm";
import { User } from "../user/entities/user.entity";
import { AuthOutputDto } from "../auth/dto/auth-output.dto";
import { testUser } from "./mock/user.mock";
import { AddressService } from "../address/address.service";
import { addressMock } from "./mock/address.mock";
import { UserService } from "../user/user.service";
import { Address } from "../address/entities/address.entity";
import { Country } from "../address/entities/country.entity";
import {
  randAddress,
  randBoolean,
  randBrand,
  randDrinks,
  randEmail,
  randFloat,
  randMusicGenre,
  randNumber,
  randSentence,
  randText,
} from "@ngneat/falso";
import { Event } from "../event/entities/event.entity";
import { EventService } from "../event/event.service";
import { CarService } from "../car/car.service";
import { BootSizes, Car, Fuels } from "../car/entities/car.entity";
import { Carpool, Directions } from "../carpool/entities/carpool.entity";
import { CarpoolService } from "../carpool/carpool.service";
import { Spending } from "../spending/entities/spending.entity";
import { ShoppingListItem } from "../shopping-list-items/entities/shopping-list-item.entity";
import { SpendingService } from "../spending/spending.service";
import { ShoppingListItemsService } from "../shopping-list-items/shopping-list-items.service";

export class IntegrationTestManager {
  private app: INestApplication;
  private _moduleRef: TestingModule;

  private _testUser: User;

  get testUser(): User {
    return this._testUser;
  }

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

  private _accessToken: AuthOutputDto;

  get accessToken(): AuthOutputDto {
    return this._accessToken;
  }

  async beforeAll(): Promise<void> {
    this._moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    this._dataSource = this._moduleRef.get(DataSource);
    this.app = this._moduleRef.createNestApplication();
    await this.app.init();
    await this.setup();
    this._httpServer = this.app.getHttpServer();

    const authService = this.app.get<AuthService>(AuthService);
    this._dataSource = this._moduleRef.get(DataSource);
    const userRepo = this._dataSource.getRepository<User>(User);
    this._testUser = await userRepo.findOneByOrFail({ email: testUser.email });
    this._accessToken = await authService.login(this._testUser, "");
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
  }

  async teardown(): Promise<void> {
    await this.dataSource.dropDatabase();
  }

  async getNewUser(): Promise<User> {
    const userService = this._moduleRef.get<UserService>(UserService);
    return await userService.create({
      ...testUser,
      addressId: this._testAddress.id,
      email: randEmail(),
    });
  }

  async getNewAddress(): Promise<Address> {
    const add = randAddress();
    const addressService = this._moduleRef.get<AddressService>(AddressService);
    return await addressService.create({
      countryId: this._testCountry.id,
      streetNumber: "30",
      line1: add.street,
      line2: add.county,
      unitNumber: "",
      postalCode: add.zipCode,
      city: add.city,
    });
  }

  async getNewEvent(): Promise<Event> {
    const address = await this.getNewAddress();
    const eventService = this._moduleRef.get<EventService>(EventService);
    return await eventService.create({
      addressId: address.id,
      name: randSentence(),
      description: randText(),
      total: randNumber(),
    });
  }

  async getNewCar(): Promise<Car> {
    const carService = this._moduleRef.get<CarService>(CarService);
    return await carService.create(
      {
        bootSize: BootSizes.CampingCar,
        brand: randBrand(),
        fuel: Fuels.HYDROGEN,
        consumption: randFloat(),
        manualTransmission: randBoolean(),
        model: randDrinks(),
        maxPassengers: randNumber(),
        range: randNumber(),
      },
      this.testUser,
    );
  }

  async getNewCarpool(): Promise<Carpool> {
    const event = await this.getNewEvent();
    const start = await this.getNewAddress();
    const end = await this.getNewAddress();
    const driver = await this.getNewUser();
    const car = await this.getNewCar();
    const carpoolService = this._moduleRef.get<CarpoolService>(CarpoolService);
    return await carpoolService.create({
      eventId: event.id,
      carId: car.id,
      direction: Directions.back,
      finalDestinationId: end.id,
      startDestinationId: start.id,
      driverId: driver.id,
      totalLength: randNumber(),
      departure: new Date(Date.now()),
      arrival: new Date(Date.now()),
    });
  }

  async getNewSoppingListItem(): Promise<ShoppingListItem> {
    const carpoolService = this._moduleRef.get<ShoppingListItemsService>(
      ShoppingListItemsService,
    );

    const event = await this.getNewEvent();
    const user = await this.getNewUser();
    return await carpoolService.create({
      eventId: event.id,
      name: randMusicGenre(),
      price: randFloat(),
      bought: randBoolean(),
      assignedId: user.id,
    });
  }

  async getNewSpending(): Promise<Spending> {
    const event = await this.getNewEvent();
    const shopIt = await this.getNewSoppingListItem();
    const user = await this.getNewUser();
    const carpoolService =
      this._moduleRef.get<SpendingService>(SpendingService);
    return await carpoolService.create({
      eventId: event.id,
      shoppingListItemId: shopIt.id,
      buyerId: user.id,
      value: randFloat(),
    });
  }
}
