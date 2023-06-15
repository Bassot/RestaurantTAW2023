#step 1
FROM node:18-alpine as fe_node
LABEL maintainers="Andrea Basso, Riccardo Nalgi"
RUN npm i -g @angular/cli

EXPOSE 4200
# working dir
WORKDIR /app/

CMD npm install
CMD ng serve --host 0.0.0.0 --poll
