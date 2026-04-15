// Ambiente EC2 - Apunta a los microservicios via IP publica y puertos 9110-9116
export const environment = {
  cookie: false,
  production: false,
  url: 'http://54.90.124.49:9111/',
  url_MsAuthention: 'http://54.90.124.49:9111/',
  url_MSEntidad: 'http://54.90.124.49:9111/',
  url_MSPermisos: 'http://54.90.124.49:9111/',
  url_Parametricas: 'http://54.90.124.49:9114/',
  url_MSTablasParametricas: 'http://54.90.124.49:9114/',
  url_MsNna: 'http://54.90.124.49:9112/',
  url_MSSeguimiento: 'http://54.90.124.49:9113/',
  url_MSParametricas: 'http://54.90.124.49:9114/',
  url_MSUsuarioyRoles: 'http://54.90.124.49:9111/',
  url_Sispro: 'https://web.sispropreprod.gov.co/'
};
