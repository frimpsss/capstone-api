FROM node:alpine

ARG db=unknown
ENV DB_URL=$db
ARG AT_S=unknown
ENV ACCESS_TOKEN_SECRET=$AT_S
# ARG RT_S=unknown
# ENV REFRESH_TOKEN_SECRET=$RT_S
# ARG E_T=unknown
# ENV ENCRYPTION_TOKEN=$E_T

WORKDIR /
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 9090
CMD ["node", "dist/src/index.js"]