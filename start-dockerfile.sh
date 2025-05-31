#habilitacion sonar
docker run -d --name sonarqube --network sonar-network -p 9000:9000 sonarqube

#Proyecto Angular
docker network create sonar-network
docker stop pluralsofttechnologies-secanifront
docker rm pluralsofttechnologies-secanifront
docker rmi pluralsofttechnologies-secanifront
docker build -t pluralsofttechnologies-secanifront .
docker run -it -d -p 4200:4200 --network sonar-network -v ./:/app --name pluralsofttechnologies-secanifront pluralsofttechnologies-secanifront
#docker logs -f  pluralsofttechnologies-secanifront
docker exec -it pluralsofttechnologies-secanifront bash




