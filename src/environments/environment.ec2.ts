// Ambiente EC2 - Apunta a los microservicios via IP publica y puertos 9110-9116
export const environment = {
  cookie: false,
  production: true,
  url: 'http://18.232.27.199:9111/',
  url_MsAuthention: 'http://18.232.27.199:9111/',
  url_MSEntidad: 'http://18.232.27.199:9111/',
  url_MSPermisos: 'http://18.232.27.199:9111/',
  url_Parametricas: 'http://18.232.27.199:9114/',
  url_MSTablasParametricas: 'http://18.232.27.199:9114/',
  url_MsNna: 'http://18.232.27.199:9112/',
  url_MSSeguimiento: 'http://18.232.27.199:9113/',
  url_MSParametricas: 'http://18.232.27.199:9114/',
  url_MSUsuarioyRoles: 'http://18.232.27.199:9111/',
  url_Sispro: 'https://web.sispropreprod.gov.co/'
};
