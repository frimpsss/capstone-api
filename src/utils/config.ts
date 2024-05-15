import { CorsOptions } from "cors";
const whiteList = ["http://localhost:3000"];

export const corsOptions: CorsOptions = {
  origin(requestOrigin, callback) {
    if (whiteList.includes(requestOrigin as string) || !requestOrigin) {
      callback(null, requestOrigin);
    } else {
      callback(new Error("Cors error"));
    }
  },
  allowedHeaders: ["X-Requested-With", "content-type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "OPTIONS", "PUT", "PATCH", "DELETE"],
};
