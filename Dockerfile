# Establecer la imagen base
FROM ubuntu:latest

ENV JAVA_VERSION=17

# Actualizar el sistema y instalar herramientas necesarias
RUN apt-get update && apt-get install -y curl openssl wget unzip zip openjdk-${JAVA_VERSION}-jdk

# Set JAVA_HOME environment variable
ENV JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
ENV PATH="${JAVA_HOME}/bin:${PATH}"
RUN export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64

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


WORKDIR /opt
ENV SONAR_VERSION=4.8.0.2856
#ENV SONAR_VERSION=3.1.0.1141
RUN wget https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-${SONAR_VERSION}-linux.zip
RUN unzip sonar-scanner-cli-${SONAR_VERSION}-linux.zip
RUN mv sonar-scanner-${SONAR_VERSION}-linux /opt/sonar-scanner
# Set SONAR_SCANNER_HOME environment variable
ENV SONAR_SCANNER_HOME=/opt/sonar-scanner
ENV PATH="${SONAR_SCANNER_HOME}/bin:${PATH}"

#RUN rm /app/node_modules/sonar-scanner/bin/sonar-scanner
#RUN ln -s /opt/sonar-scanner/bin/sonar-scanner /app/node_modules/sonar-scanner/bin/sonar-scanner
RUN echo "sonar.java.jdkHome=/usr/lib/jvm/java-17-openjdk-amd64/bin/java" >> /opt/sonar-scanner/conf/sonar-scanner.properties
RUN echo "sonar.host.url=http://localhost:9000" >> /opt/sonar-scanner/conf/sonar-scanner.properties
RUN echo "sonar.login=admin" >> /opt/sonar-scanner/conf/sonar-scanner.properties
RUN echo "sonar.password=admin1" >> /opt/sonar-scanner/conf/sonar-scanner.properties
RUN echo "sonar.sourceEncoding=UTF-8" >> /opt/sonar-scanner/conf/sonar-scanner.properties

WORKDIR /app


# Ejecutar el comando para iniciar el servidor de desarrollo en 0.0.0.0
CMD ["ng", "serve", "--host", "0.0.0.0"]
