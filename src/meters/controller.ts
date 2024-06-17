import { ZodError } from "zod";
import { HttpStatusCode } from "../utils/globalTypes";
import CustomResponse from "../utils/wrapper";
import { MeterModel } from "./model";
import { createMeterValidator } from "./utils";
import mongoose, { MongooseError } from "mongoose";
import { castToObjectId } from "../utils/config";
import { findAppUserByID } from "../auth/services";
import { UserModel } from "../auth/model";

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
    const session = await mongoose.startSession();
    try {
      session.startTransaction();

      createMeterValidator.parse({
        userId,
        gpsAddress,
      });
      const foundUser = await findAppUserByID(userId);
      if (!foundUser) {
        return new CustomResponse(
          HttpStatusCode.BadRequest,
          "User not found",
          false
        );
      }

      if (foundUser.meterId) {
        return new CustomResponse(
          HttpStatusCode.Conflict,
          "Meter Already Exists",
          false
        );
      }
      const newMeter = new MeterModel({
        gpsAddress,
        userId: castToObjectId(userId),
      });

      const saved = await newMeter.save();
      const updateUser = await UserModel.findOneAndUpdate(
        { _id: userId },
        { meterId: saved._id }
      );

      if (!saved && updateUser) {
        await session.abortTransaction();
        return new CustomResponse(
          HttpStatusCode.InternalServerError,
          "An error occured",
          false
        );
      }
      await session.commitTransaction();
      return new CustomResponse(
        HttpStatusCode.Created,
        "Meter created",
        true,
        saved
      );
    } catch (error: unknown | any) {
      await session.abortTransaction();
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
    } finally {
      await session.endSession();
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
