import CustomResponse from "../utils/wrapper";
import { HttpStatusCode } from "../utils/globalTypes";
import { ZodError } from "zod";
import { MongooseError } from "mongoose";
import { ITariff, TariffStatus } from "./type";
import { createTariffValidator } from "./utils";
import { TarrifModel } from "./model";
export class TariffController {
  /**
   * createTariff
   */
  public async createTariff({
    name,
    rate,
    description,
    effectiveFrom,
    effectiveTo,
  }: {
    name: string;
    rate: string;
    description: string;
    effectiveFrom: string;
    effectiveTo?: string;
  }): Promise<CustomResponse<any>> {
    try {
      createTariffValidator.parse({
        name,
        rate,
        description,
        effectiveFrom: new Date(effectiveFrom),
        effectiveTo: new Date(effectiveTo ?? ""),
        status: TariffStatus.ACTIVE,
      });

      const newTariff = new TarrifModel({
        name,
        rate,
        description,
        effectiveFrom,
        effectiveTo,
        status: TariffStatus.INACTIVE,
      });

      const saved = await newTariff.save();

      return new CustomResponse(
        HttpStatusCode.Created,
        "Tariff Created",
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
        "An error occured",
        false,
        JSON.stringify(error)
      );
    }
  }

  /**
   * getActiveTariffs
   */
  public async getActiveTariffs(): Promise<
    CustomResponse<ITariff[] | Error | string>
  > {
    try {
      const currentDate = new Date();
      const currentTarrifs = await TarrifModel.find({
        effectiveFrom: { $lte: currentDate },
        $or: [
          { effectiveTo: { $gte: currentDate } },
          { effectiveTo: { $exists: false } },
        ],
        status: TariffStatus.ACTIVE,
      });

      return new CustomResponse(
        HttpStatusCode.Ok,
        "Current Tariffs retrieved",
        true,
        currentTarrifs
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
        "An error occured",
        false,
        JSON.stringify(error)
      );
    }
  }
  public async toggleTariffStatus(id: string): Promise<CustomResponse<any>> {
    try {
      const foundTariff = await TarrifModel.findById(id);

      if (!foundTariff) {
        return new CustomResponse(
          HttpStatusCode.BadRequest,
          "Tariff not found",
          false
        );
      }

      const updated = await TarrifModel.findByIdAndUpdate(
        foundTariff.id,
        {
          status:
            foundTariff?.status == TariffStatus.ACTIVE
              ? TariffStatus.INACTIVE
              : TariffStatus.ACTIVE,
        },
        { returnDocument: "after" }
      );

      return new CustomResponse(
        HttpStatusCode.Ok,
        "Updated",
        true,
        updated?.status
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
        "An error occured",
        false,
        JSON.stringify(error)
      );
    }
  }

  /**
   * getAllTariffs
   */
  public async getAllTariffs(): Promise<CustomResponse<any>> {
    try {
      const all_tariffs = await TarrifModel.find();

      return new CustomResponse(
        HttpStatusCode.Ok,
        "Tariffs retieved succesfully",
        true,
        all_tariffs
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
        "An error occured",
        false,
        JSON.stringify(error)
      );
    }
  }
}
