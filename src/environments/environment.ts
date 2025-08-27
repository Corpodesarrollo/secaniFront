// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// RUTAS DE DESARROLLO


// export const environment = {
//   cookie : false,
//   production: false,
//   url: 'https://localhost:4200/',
//   url_MsAuthention: 'https://localhost:7084/',
//   url_MSEntidad: 'https://localhost:7084/',
//   url_MSPermisos: 'https://localhost:7084/',
//   url_Parametricas: 'https://localhost:7294/',
//   url_MSTablasParametricas: 'https://localhost:7294/',
//   url_MsNna: 'https://localhost:7291/',
//   url_MSSeguimiento: 'https://localhost:7085/',
//   url_MSParametricas: 'https://localhost:7294/',
//   url_MSUsuarioyRoles: 'https://localhost:7084/',
// };

// RUTAS DE AZURE
// export const environment = {
//   cookie : false,
//   production: false,
//   url: 'https://msauthentication-auc6a9ajccerbndk.eastus2-01.azurewebsites.net/',
//   url_MsAuthention: 'https://msauthentication-auc6a9ajccerbndk.eastus2-01.azurewebsites.net/',
//   url_MSEntidad: 'https://msauthentication-auc6a9ajccerbndk.eastus2-01.azurewebsites.net/',
//   url_MSPermisos: 'https://msauthentication-auc6a9ajccerbndk.eastus2-01.azurewebsites.net/',
//   url_Parametricas: 'https://mstablasparametricas-bdf0a9cza5bucwby.eastus2-01.azurewebsites.net/',
//   url_MSTablasParametricas: 'https://mstablasparametricas-bdf0a9cza5bucwby.eastus2-01.azurewebsites.net/',
//   url_MsNna: 'https://msnna-bjdgg4h5b0duh0gz.eastus-01.azurewebsites.net/',
//   url_MSSeguimiento: 'https://msseguimientov2-byb0d5gwh9c9hufx.westus2-01.azurewebsites.net/',
//   url_MSParametricas: 'https://mstablasparametricas-bdf0a9cza5bucwby.eastus2-01.azurewebsites.net/',
//   url_MSUsuarioyRoles: 'https://msauthentication-auc6a9ajccerbndk.eastus2-01.azurewebsites.net/',
// };

 // RUTAS DE MINISTERIO
const baseUrl = 'https://nna.sispropreprod.gov.co/';
// const baseUrl = 'https://nna.sisprodesa.local/';
// const baseUrl = 'http://192.168.110.12/';


export const environment = {
  cookie: true,
  url: `${baseUrl}auth/`,
  url_MsAuthention: `${baseUrl}auth/`,
  url_MSEntidad: `${baseUrl}auth/`,
  url_MSPermisos: `${baseUrl}auth/`,
  url_Parametricas: `${baseUrl}tablas/`,
  url_MSTablasParametricas: `${baseUrl}tablas/`,
  url_MsNna: `${baseUrl}nna/`,
  url_MSSeguimiento: `${baseUrl}seguimiento/`,
  url_MSParametricas: `${baseUrl}tablas/`,
  url_MSUsuarioyRoles: `${baseUrl}auth/`,
};