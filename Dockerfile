FROM node:lts-alpine as builder
ARG http_proxy=http://10.67.1.66:3128
ARG https_proxy=http://10.67.1.66:3128
ARG BUILD_CONFIG=prod

WORKDIR /build
COPY . .

RUN npm install
RUN npm audit fix

RUN npm run build-$BUILD_CONFIG

FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /build/dist/erc-households-ui /usr/share/nginx/html
EXPOSE 80