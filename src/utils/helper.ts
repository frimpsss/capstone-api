import { child, get, ref } from "firebase/database";
import { dbRef, db } from "../push-notifs/service";
import { any } from "zod";
export const monthNames: string[] = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export async function getMonthlyTotalConsumtionSortedByMeterIds(
  startDate: Date,
  endDate: Date
): Promise<{ [meterId: string]: number } | Error> {
  try {
    const snapshot = await get(child(dbRef, "readings"));
    const data = snapshot.val();

    if (!data) {
      return {};
    }

    const startDateInMs = startDate.getTime();
    const endDateInMs = endDate.getTime();

    const meterIdAndTotal: { [meterId: string]: number } = {};

    Object.keys(data).forEach((meterId) => {
      let totalConsumption = 0;
      Object.values(data[meterId]).forEach((reading: any) => {
        const timeStamp = reading?.timeStamp;

        if (timeStamp && timeStamp < endDateInMs && timeStamp > startDateInMs) {
          totalConsumption += Number(reading?.value) || 0;
        }
      });

      meterIdAndTotal[meterId] = totalConsumption;
    });
    return meterIdAndTotal;
  } catch (error) {
    throw error;
  }
}
