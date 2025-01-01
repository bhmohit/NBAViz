FROM node:21-alpine3.18 as build
WORKDIR /frontend
COPY ./frontend ./
ENV REACT_APP_BACKEND=http://localhost/api/
RUN npm install && npm run build

FROM nginx:alpine
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /frontend/dist /usr/share/nginx/html