FROM node:21-alpine3.18 as build

WORKDIR /app

COPY ./frontend/package.json ./frontend/package-lock.json ./
RUN npm install

ENV REACT_APP_BACKEND http://16.171.182.204/api/

COPY ./frontend /app
RUN npm run build