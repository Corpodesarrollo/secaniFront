// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// RUTAS DE DESARROLLO


export const environment = {
  cookie : false,
  production: false,
  url: 'http://localhost:9111/',
  url_MsAuthention: 'http://localhost:9111/',
  url_MSEntidad: 'http://localhost:9111/',
  url_MSPermisos: 'http://localhost:9111/',
  url_Parametricas: 'http://localhost:9114/',
  url_MSTablasParametricas: 'http://localhost:9114/',
  url_MsNna: 'http://localhost:9112/',
  url_MSSeguimiento: 'http://localhost:9113/',
  url_MSParametricas: 'http://localhost:9114/',
  url_MSUsuarioyRoles: 'http://localhost:9111/',
  url_Sispro: 'https://web.sispropreprod.gov.co/'
};

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
//const baseUrl = 'https://nna.sispropreprod.gov.co/';
// const baseUrl = 'https://nna.sisprodesa.local/';
// const baseUrl = 'http://192.168.110.12/';


// export const environment = {
//   cookie: true,
//   url: `https://secani.sispropreprod.gov.co`,
//   url_MsAuthention: `${baseUrl}auth/`,
//   url_MSEntidad: `${baseUrl}auth/`,
//   url_MSPermisos: `${baseUrl}auth/`,
//   url_Parametricas: `${baseUrl}tablas/`,
//   url_MSTablasParametricas: `${baseUrl}tablas/`,
//   url_MsNna: `${baseUrl}nna/`,
//   url_MSSeguimiento: `${baseUrl}seguimiento/`,
//   url_MSParametricas: `${baseUrl}tablas/`,
//   url_MSUsuarioyRoles: `${baseUrl}auth/`,
//   url_Sispro: 'https://web.sispropreprod.gov.co/'
// };