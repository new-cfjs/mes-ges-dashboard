FROM node:16 AS build
WORKDIR /app

RUN npm install -g @angular/cli
COPY ./package.json .
RUN npm install
COPY . .
RUN ng build

FROM nginx as runtime
COPY --from=build /app/dist/mes-ges/ /usr/share/nginx/html
COPY ./nginx/default.conf /etc/nginx/conf.d/
#CMD ["ng", "serve", "--port", "80", "--host", "0.0.0.0"]
