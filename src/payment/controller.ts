import { ZodError } from "zod";
import CustomResponse from "../utils/wrapper";
import { HttpStatusCode } from "../utils/globalTypes";
import { MongooseError } from "mongoose";
import { BillModel } from "../billing/model";
import { PaymentModel } from "./model";

export class PaymentController {
  /**
   * savePaymentDetails
   */
  public async saveTranactionDetails({
    billingId,
    txnData,
    userId,
  }: {
    billingId: string;
    txnData: any;
    userId: string;
  }): Promise<CustomResponse<any>> {
    try {
      const bill = await BillModel.findById(billingId);

      if (!bill) {
        return new CustomResponse(
          HttpStatusCode.BadRequest,
          "Bill does not exist",
          false
        );
      }

      const newPayment = new PaymentModel({
        billId: bill?._id,
        txnData: txnData,
        userId,
      });

      const saved = await newPayment.save();
      await BillModel.findByIdAndUpdate(bill._id, {
        status: "PAID",
        paymentId: saved?._id,
      });
      return new CustomResponse(
        HttpStatusCode.Ok,
        "Payment Details saved",
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
   * getAllT
   */
  public async getAllTxns(): Promise<CustomResponse<any>> {
    try {
      const txn = await PaymentModel.find();

      return new CustomResponse(
        HttpStatusCode.Ok,
        "Transctions retieved",
        true,
        txn
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
   * getAllT
   */
  public async getAllUserTxns({
    userId,
  }: {
    userId: string;
  }): Promise<CustomResponse<any>> {
    try {
      const txn = await PaymentModel.find({ userId }).populate({
        path: "billId",
        select: ["billingPeriodStart", "totalAmountDue"],
      });

      return new CustomResponse(
        HttpStatusCode.Ok,
        "Transctions retieved",
        true,
        txn
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
