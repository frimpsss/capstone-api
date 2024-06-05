import { ZodError } from "zod";
import { HttpStatusCode } from "../utils/globalTypes";
import CustomResponse from "../utils/wrapper";
import { MeterModel } from "./model";
import { createMeterValidator } from "./utils";
import { MongooseError } from "mongoose";
import { castToObjectId } from "../utils/config";

export class MeterController {
  /**
   * createMeter
   */
  public async createMeter({
    userId,
    gpsAddress,
  }: {
    userId: string;
    gpsAddress: string;
  }): Promise<CustomResponse<any>> {
    try {
      createMeterValidator.parse({
        userId,
        gpsAddress,
      });
      const newMeter = new MeterModel({
        gpsAddress,
        userId: castToObjectId(userId),
      });
      const saved = await newMeter.save();

      return new CustomResponse(
        HttpStatusCode.Created,
        "Meter created",
        true,
        saved
      );
    } catch (error: unknown | any) {
      console.log(error);
      if (error instanceof ZodError) {
        return new CustomResponse(
          HttpStatusCode.BadRequest,
          "Validation error",
          false,
          error
        );
      }
      if (error instanceof MongooseError) {
        return new CustomResponse(
          HttpStatusCode.BadRequest,
          "Mongoose Error",
          false,
          error
        );
      }

      return new CustomResponse(
        HttpStatusCode.InternalServerError,
        undefined,
        false,
        Error(error?.message)
      );
    }
  }

  /**
   * async allMeters
   */
  public async allMeters({
    ownerId,
  }: {
    ownerId?: string;
  }): Promise<CustomResponse<any>> {
    try {
      let toBeReturned;
      if (!ownerId) {
        toBeReturned = await MeterModel.find()
          .populate("userId")
          .populate({ path: "userId", select: "name" });
      } else {
        toBeReturned = await MeterModel.find({
          userId: castToObjectId(ownerId),
        }).populate({ path: "userId", select: "name" });
      }

      return new CustomResponse(
        HttpStatusCode.Ok,
        undefined,
        true,
        toBeReturned
      );
    } catch (error: unknown | any) {
      console.log(error);
      if (error instanceof ZodError) {
        return new CustomResponse(
          HttpStatusCode.BadRequest,
          "Validation error",
          false,
          error
        );
      }
      if (error instanceof MongooseError) {
        return new CustomResponse(
          HttpStatusCode.BadRequest,
          "Mongoose Error",
          false,
          error
        );
      }

      return new CustomResponse(
        HttpStatusCode.InternalServerError,
        undefined,
        false,
        Error(error?.message)
      );
    }
  }
}
