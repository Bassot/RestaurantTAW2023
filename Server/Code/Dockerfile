FROM node:18-alpine
LABEL maintainers="Andrea Basso, Riccardo Nalgi"

#EXPOSE 8080
# working dir
WORKDIR /app/
# storing this var to detect in what environment the server is actually running
ENV DBHOST mongo
#RUN npm install
#RUN npm run compile

# CMD commands are executing after the volumes' mounting
CMD npm i
CMD npm run start
