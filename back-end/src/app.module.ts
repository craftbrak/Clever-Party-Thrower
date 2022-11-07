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
// import { LoggerMStringdleware } from "./logs/logger.mStringdleware";
import { CarpoolModule } from "./carpool/carpool.module";
import { SpendingModule } from "./spending/spending.module";
import { ShoppingListItemsModule } from "./shopping-list-items/shopping-list-items.module";

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
        entities: [join(__dirname, "**", "*.entity.{ts,js}")],
        synchronize: configService.get("NODE_ENV") !== "production",
        dropSchema: configService.get("NODE_ENV") === "test",
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
  ],
  providers: [AppService, AppResolver],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply().forRoutes("*");
  }
}
