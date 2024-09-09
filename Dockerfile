# Establecer la imagen base
FROM ubuntu:latest

# Actualizar el sistema y instalar herramientas necesarias
RUN apt-get update && apt-get install -y curl openssl wget

RUN wget https://nodejs.org/dist/v18.19.1/node-v18.19.1-linux-x64.tar.gz && cp node-v18.19.1-linux-x64.tar.gz /tmp/node.tar.gz

# Descomprimir e instalar Node.js
RUN cd /usr/local && tar --strip-components 1 -xzf /tmp/node.tar.gz

# Crea el directorio de trabajo y establece los permisos adecuados
RUN mkdir /app 
WORKDIR /app

# Copiar todos los archivos del proyecto Angular al directorio de trabajo
COPY . /app/

# Instalar las dependencias
RUN npm install -g npm@10.7.0
RUN npm install -g @angular/cli@18.1.0
RUN npm install

# Expone el puerto 4200 para el servidor de desarrollo de Angular
EXPOSE 4200

# Ejecutar el comando para iniciar el servidor de desarrollo en 0.0.0.0
CMD ["ng", "serve", "--host", "0.0.0.0"]
