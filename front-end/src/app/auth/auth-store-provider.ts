import {FactoryProvider} from '@angular/core';
import {AuthStoreService} from "./auth-store.service";

export function AuthStoreServiceFactory(): AuthStoreService {
  return AuthStoreService.getInstance();
}

export const AuthStoreServiceProvider: FactoryProvider = {
  provide: AuthStoreService,
  useFactory: AuthStoreServiceFactory,
};
