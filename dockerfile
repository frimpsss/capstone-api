FROM node:alpine

ARG DB_U=unknown
ENV DB_URL=$DB_U
ARG AT_S=unknown
ENV ACCESS_TOKEN_SECRET=$AT_S

WORKDIR /
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 9090
CMD ["node", "dist/src/index.js"]