// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // api: 'http://api.ecommercesy.com/api',
  // api: 'http://127.0.0.1:8000/api',
  api: 'http://api.ecommerce.devel/api',
  mapbox: {
    apiKey: 'pk.eyJ1IjoibWF0aWFzYmFlejI1IiwiYSI6ImNrODd0aW1tODAwMWEzbGtmb2t0amNnMzYifQ.TGRXCPLfAzvmp0-cEpeiDA',
    defaultCoords: {
      lat: '-25.4036867',
      lng: '-57.2865209'
    }
  }
};

  /*
   * For easier debugging in development mode, you can import the following file
   * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
   *
   * This import should be commented out in production mode because it will have a negative impact
   * on performance if an error is thrown.
   */
  // import 'zone.js/dist/zone-error';  // Included with Angular CLI.