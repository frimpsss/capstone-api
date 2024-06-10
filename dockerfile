FROM node:alpine


# ARG AT_S=unknown
# ENV ACCESS_TOKEN_SECRET=$AT_S
# ENV DATABASE_URL=$DB_URL
# ARG DB_URL=unknown

WORKDIR /
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 9090
CMD ["node", "dist/src/index.js"]