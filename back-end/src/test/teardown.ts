import { Test } from "@nestjs/testing";
import { AppModule } from "../app.module";
import { DataSource } from "typeorm";

export default async (): Promise<void> => {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();
  const app = moduleRef.createNestApplication();
  await app.init();
  const datasource = moduleRef.get(DataSource);
  await datasource.dropDatabase();
};
