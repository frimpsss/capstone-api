import { MongooseError } from "mongoose";
import { IReport } from "./types";
import { HttpStatusCode } from "../utils/globalTypes";
import CustomResponse from "../utils/wrapper";
import { ZodError } from "zod";
import { createReportValidator } from "./utils";
import { ReportModel } from "./model";

export class ReportController {
  /**
   * name
   */
  public async createReport({
    title,
    userId,
    description,
    images,
  }: IReport): Promise<CustomResponse<any>> {
    try {
      createReportValidator.parse({
        title,
        userId,
        description,
        images,
      });

      const newReport = new ReportModel({
        userId,
        title,
        description,
        images,
      });

      const saved = await newReport.save();
      return new CustomResponse(
        HttpStatusCode.Ok,
        "Report created succesfully",
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
   * getAllReports
   */
  public getAllReports() {
    try {
    } catch (error) {}
  }
}
