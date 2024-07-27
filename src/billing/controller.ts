import { HttpStatusCode } from "../utils/globalTypes";
import CustomResponse from "../utils/wrapper";
import { MongooseError } from "mongoose";
import { ZodError } from "zod";
import { TariffController } from "../tariffs/controller";
import { ITariff } from "../tariffs/type";
import { BillModel } from "./model";
import { NotificationController } from "../notifications/controller";
import { NotificationType } from "../notifications/types";
import {
  getMonthlyTotalConsumtionSortedByMeterIds,
  monthNames,
} from "../utils/helper";
import { createBillValidator } from "./utils";
import { BillStatus } from "./types";
import { MeterModel } from "../meters/model";
import { UserModel } from "../auth/model";

const Tariffs = new TariffController();
const Notifs = new NotificationController();
export class BillController {
  /**
   * generateBills
   * supposed to be automated but for demo sake making it an endpoint
   */
  public async generateBills({
    billingPeriodStart,
    billingPeriodEnd,
  }: {
    billingPeriodEnd: string;
    billingPeriodStart: string;
  }): Promise<CustomResponse<any>> {
    try {
      createBillValidator.parse({
        billingPeriodEnd: new Date(billingPeriodStart),
        billingPeriodStart: new Date(billingPeriodStart),
      });
      const PRICE_PER_LITTER = 0.077;
      const consumptions = (await getMonthlyTotalConsumtionSortedByMeterIds(
        new Date(billingPeriodStart),
        new Date(billingPeriodEnd)
      )) as any;

      const meters = await MeterModel.find();
      if (!meters) {
        return new CustomResponse(
          HttpStatusCode.Ok,
          "bills generated sucessfully",
          true
        );
      }
      const currentTarrifs =
        (await Tariffs.getActiveTariffs()) as CustomResponse<ITariff[]>;

      console.log(currentTarrifs);
      const tariffs = currentTarrifs.data?.map((e) => {
        return {
          tariffId: e._id,
          rate: e?.rate,
        };
      });

      const billing_month = new Date(billingPeriodEnd).getMonth();
      const billing_year = new Date(billingPeriodEnd).getFullYear();

      meters.map(async (meter: any) => {
        let MONTHLY_CONSUMPTION = Number(consumptions?.[meter?._id]) || 0;
        let amountDue = MONTHLY_CONSUMPTION * PRICE_PER_LITTER;
        currentTarrifs.data?.map((e: ITariff, i) => {
          amountDue += e.rate * 0.01 * MONTHLY_CONSUMPTION;
        });

        const newBill = new BillModel({
          meterId: meter._id,
          billingPeriodEnd,
          billingPeriodStart,
          totalAmountDue: amountDue,
          tariffs,
          status: BillStatus.UNPAID,
        });

        await newBill.save();
      });

      await Notifs.createNotification({
        title: `Bill for ${monthNames[billing_month]} - ${billing_year}`,
        message: `Bill for ${monthNames[billing_month]}, ${billing_year} is due. Payment can be made on the app or at any of our agents. \nRemember, there will be disconnection 20 days after you recieve this message \nThank you `,
        notifType: NotificationType.GENERAL,
      });
      return new CustomResponse(
        HttpStatusCode.Ok,
        "bills generated sucessfully",
        true
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
   * getIndividialsBills
{userId}:{userId: string}   */
  public async getIndividialsBills({
    userId,
  }: {
    userId: string;
  }): Promise<CustomResponse<any>> {
    try {
      const foundUser = await UserModel.findOne({ _id: userId });
      if (!foundUser) {
        return new CustomResponse(
          HttpStatusCode.BadRequest,
          "User does not exist",
          false
        );
      }

      const userBills = await BillModel.find({
        meterId: foundUser?.meterId,
      }).populate({
        path: "tariffs.tariffId",
        select: ["name"],
      });

      return new CustomResponse(
        HttpStatusCode.Ok,
        "Bills retrieved succesfully",
        true,
        userBills
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
   * getAllBills
   */
  public async getAllBills(): Promise<CustomResponse<any>> {
    try {
      const bills = await BillModel.find()
        .populate({
          path: "meterId",
          select: ["userId"],
          populate: {
            path: "userId",
            select: ["name"],
          },
        })
        .populate({
          path: "tariffs.tariffId",
          select: ["name"],
        });
      return new CustomResponse(
        HttpStatusCode.Ok,
        "Bills retreived succesfully",
        true,
        bills
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
