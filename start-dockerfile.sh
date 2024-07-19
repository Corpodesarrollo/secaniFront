docker stop pluralsofttechnologies-secanifront
docker rm pluralsofttechnologies-secanifront
docker rmi pluralsofttechnologies-secanifront
docker build -t pluralsofttechnologies-secanifront .
docker run -it -d -p 4200:4200 -v ./:/app --name pluralsofttechnologies-secanifront pluralsofttechnologies-secanifront
docker logs -f  pluralsofttechnologies-secanifront