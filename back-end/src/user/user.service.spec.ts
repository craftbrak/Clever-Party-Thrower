import { ModuleMocker, MockFunctionMetadata } from "jest-mock";
import { EventToUser } from "../event-to-user/entities/event-to-user.entity";
import { Event } from "../event/entities/event.entity";
import { Address } from "../address/entities/address.entity";
import { Country } from "../address/entities/country.entity";
import { string } from "joi";
import { UserService } from "./user.service";
import { Repository } from "typeorm";
import { UserEntity } from "./entities/user.entity";
import { getRepositoryToken, TypeOrmModule } from "@nestjs/typeorm";
import { Test, TestingModule } from "@nestjs/testing";
const moduleMocker = new ModuleMocker(global);
describe("UserService", () => {
  let service: UserService;
  let userRepo: Repository<UserEntity>;

  const USER_REPO_TOKEN = getRepositoryToken(UserEntity);

  // const mockAddressService = {
  //   create: jest.fn((dto) => {
  //     return {
  //       id: string(),
  //       ...dto,
  //     };
  //   }),
  // };
  const mockUserRepository = {
    create: jest.fn((dto) => {
      return {
        id: string(),
        ...dto,
      };
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: "postgres",
          url: "postgres://user:psw@serverdocker:5432/test", // read this from env
          autoLoadEntities: true,
          synchronize: true,
          dropSchema: true,
          entities: [UserEntity, EventToUser, Event, Address, Country],
        }),
        TypeOrmModule.forFeature([UserEntity]),
      ],
      providers: [
        UserService,
        { provide: USER_REPO_TOKEN, useValue: mockUserRepository },
      ],
    })
      .useMocker((token) => {
        const results = ["test1", "test2"];
        if (token === UserService) {
          return { findAll: jest.fn().mockResolvedValue(results) };
        }
        if (typeof token === "function") {
          const mockMetadata = moduleMocker.getMetadata(
            token,
          ) as MockFunctionMetadata<any, any>;
          const Mock = moduleMocker.generateFromMetadata(mockMetadata);
          return new Mock();
        }
      })
      .compile();

    service = module.get<UserService>(UserService);
    userRepo = module.get<Repository<UserEntity>>(USER_REPO_TOKEN);
  });

  it("UserService should be defined", () => {
    expect(service).toBeDefined();
  });

  it("UserRepo should be defined", () => {
    expect(userRepo).toBeDefined();
  });
});
