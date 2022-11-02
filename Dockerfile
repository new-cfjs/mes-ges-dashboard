FROM node:16 AS build
WORKDIR /app

RUN npm install -g @angular/cli
COPY ./package.json .
RUN npm install
COPY . .
RUN ng build

FROM nginx as runtime
COPY --from=build /app/dist/mes-ges/ /usr/share/nginx/html
