import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { AppService } from "./app.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { ApolloServerPluginLandingPageLocalDefault } from "apollo-server-core";
import { join } from "path";
import { AppResolver } from "./app.resolver";
import { EventModule } from "./event/event.module";
import { PaginationModule } from "./pagination/pagination.module";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { AddressModule } from "./address/address.module";
import { EventToUserModule } from "./event-to-user/event-to-user.module";
import { CarModule } from "./car/car.module";
import * as Joi from "joi";
// import { LoggerMiddleware } from "./logs/logger.middleware";
import { CarpoolModule } from "./carpool/carpool.module";
import { SpendingModule } from "./spending/spending.module";
import { ShoppingListItemsModule } from "./shopping-list-items/shopping-list-items.module";
import { randomUUID } from "crypto";
import { DeptModule } from "./dept/dept.module";
import { Country } from "./address/entities/country.entity";
import { Address } from "./address/entities/address.entity";
import { UserEntity } from "./user/entities/user.entity";
import { Event } from "./event/entities/event.entity";
import { EventToUser } from "./event-to-user/entities/event-to-user.entity";
import { Car } from "./car/entities/car.entity";
import { Carpool } from "./carpool/entities/carpool.entity";
import { RouteEntity } from "./carpool/entities/Route.entity";
import { Spending } from "./spending/entities/spending.entity";
import { Dept } from "./dept/entities/dept.entity";
import { ShoppingListItem } from "./shopping-list-items/entities/shopping-list-item.entity";
import { EventDatesModule } from "./event-dates/event-dates.module";
import { EventDate } from "./event-dates/entities/event-date.entity";
import { DatesToUserModule } from "./dates-to-user/dates-to-user.module";
import { DatesToUser } from "./dates-to-user/entities/dates-to-user.entity";
import { EmailService } from "./email.service";

//TODO: adapt to use DB URL if host is null
@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid("development", "production", "test", "provision")
          .default("development"),
        PORT: Joi.number().default(3000),
        DATABASE_HOST: Joi.string().required(),
        DATABASE_PORT: Joi.string().required(),
        DATABASE_USER: Joi.string().required(),
        DATABASE_PSW: Joi.string().required(),
        DATABASE_NAME: Joi.string().required(),
        TEST_DATABASE_NAME: Joi.string().required(),
        JWT_SECRET: Joi.string().default(randomUUID()),
        JWT_AUTH_TTL: Joi.string().required().default("5m"),
        JWT_REFRESH_SECRET: Joi.string().default(randomUUID()),
        JWT_REFRESH_TTL: Joi.string().required().default("5h"),
        EMAIL_ADDRESS: Joi.string()
          .required()
          .email()
          .default("cleverpartythrowe@gmail.com"),
        EMAIL_PASSWORD: Joi.string().required(),
        EMAIL_VERIFICATION_URL: Joi.string().required(),
      }),
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      autoSchemaFile: "schema.gql",
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: "postgres",
        host: configService.get("DATABASE_HOST"),
        port: parseInt(configService.get("DATABASE_PORT")),
        username: configService.get("DATABASE_USER"),
        password: configService.get("DATABASE_PSW"),
        database:
          configService.get("NODE_ENV") === "test"
            ? configService.get("TEST_DATABASE_NAME")
            : configService.get("DATABASE_NAME"),
        entities: [
          join(__dirname, "**", "*.entity.{ts,js}"),
          Country,
          Address,
          UserEntity,
          Event,
          EventToUser,
          Car,
          Carpool,
          RouteEntity,
          Spending,
          Dept,
          ShoppingListItem,
          EventDate,
          DatesToUser,
        ],
        synchronize: configService.get("NODE_ENV") !== "production",
        dropSchema: false,
        logging: false,
      }),
    }),
    EventModule,
    PaginationModule,
    AuthModule,
    UserModule,
    AddressModule,
    EventToUserModule,
    CarModule,
    CarpoolModule,
    SpendingModule,
    ShoppingListItemsModule,
    DeptModule,
    EventDatesModule,
    DatesToUserModule,
  ],
  providers: [AppService, AppResolver, EmailService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply().forRoutes("*");
  }
}
