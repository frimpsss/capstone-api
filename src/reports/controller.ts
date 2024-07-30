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
  }: {
    title: string;
    userId: string;
    description: string;
    images: string[];
  }): Promise<CustomResponse<any>> {
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
  public async getAllReports(): Promise<CustomResponse<any>> {
    try {
      const reports = await ReportModel.find().populate({
        path: "userId",
      });
      return new CustomResponse(
        HttpStatusCode.Ok,
        "All reports retrieved",
        true,
        reports
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
  public async recentReports(): Promise<CustomResponse<any>> {
    try {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      const reports = await ReportModel.find({
        createdAt: { $gte: startOfDay, $lte: endOfDay },
      }).populate({
        path: "userId",
      });
      return new CustomResponse(
        HttpStatusCode.Ok,
        "All reports retrieved",
        true,
        reports
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
  public async attendToReport({
    id,
    remarks,
  }: {
    id: string;
    remarks?: string;
  }): Promise<CustomResponse<any>> {
    try {
      const report = await ReportModel.findById(id);
      if (!report) {
        return new CustomResponse(
          HttpStatusCode.BadRequest,
          "Request does not exist",
          false
        );
      }
      if (report.attendedTo) {
        return new CustomResponse(
          HttpStatusCode.BadRequest,
          "Report has already been attended to",
          false
        );
      }
      await ReportModel.findOneAndUpdate(
        { _id: report._id },
        { attendedTo: true, remarks: remarks }
      );
      return new CustomResponse(
        HttpStatusCode.Ok,
        "All reports retrieved",
        true,
        report
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
