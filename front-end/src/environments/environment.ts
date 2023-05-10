// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrl: 'http://localhost:4242/',
  mock_backend: true,
  // mockData: {
  //   events: [{id: "3", name: "test 3", description: "", total: 23}],
  //   users: [],
  //   countries: [],
  //   addesses: [],
  //   cars: [],
  //   depts: [],
  //   carpool: [],
  //   routes: [],
  //   userToEvents: [],
  //   eventDates: [],
  //   datesToUsers: [],
  //   spendings: [],
  //   shoppinglistItems: []
  // }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
