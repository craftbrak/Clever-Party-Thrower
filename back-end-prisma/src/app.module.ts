import {Module} from '@nestjs/common';
import {DbModule} from './db/db.module';
import {ApolloDriver, ApolloDriverConfig} from "@nestjs/apollo";
import {GraphQLModule} from "@nestjs/graphql";
import {join} from 'path';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { UserModule } from './user/user.module';
import { EventModule } from './event/event.module';
import { CarModule } from './car/car.module';
import { AddressModule } from './address/address.module';

@Module({
    imports: [DbModule, GraphQLModule.forRoot<ApolloDriverConfig>({
        driver: ApolloDriver,
        playground: false,
        plugins: [ApolloServerPluginLandingPageLocalDefault()],
        typePaths: ['./**/*.graphql'],
        definitions: {
            path: join(process.cwd(), 'src/graphql.ts'), outputAs: 'class',
        },
    }), UserModule, EventModule, CarModule, AddressModule,], controllers: [], providers: [],
})
export class AppModule {
}
