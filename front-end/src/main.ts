import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import {AppModule} from './app/app.module';
import {environment} from './environments/environment';

if (environment.production) {
  enableProdMode();
}

async function fetchApiUrlAndBootstrap() {
  const uri = 'https://cpt.louisdewilde.be/api/config';
  const response = await fetch(uri);
  const data = await response.json();
  localStorage.setItem('apiUrl', data.apiUrl);

  platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .catch((err) => console.error(err));
}

fetchApiUrlAndBootstrap();
