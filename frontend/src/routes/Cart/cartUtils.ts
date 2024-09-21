import { format, addDays } from "date-fns";

export const getDateInFuture = (estDays: number) => {
  const currentDate = new Date();
  const futureDate = addDays(currentDate, estDays);
  const formattedDate = format(futureDate, "EEEE, MMMM d, yyyy");
  return formattedDate;
};
