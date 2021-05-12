FROM node:alpine as builder

WORKDIR /react-ui

COPY package.json ./

RUN npm install

COPY . .

RUN npm run build

FROM nginx:alpine

ARG configpath

COPY ${configpath} /etc/nginx/nginx.conf

RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /react-ui/build /usr/share/nginx/html

ENTRYPOINT ["nginx", "-g", "daemon off;"]