import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

// Extend dayjs with plugins
dayjs.extend(utc);
dayjs.extend(timezone);

export const formatToLocalTime = (date: string | undefined) => {
  if (!date) return "";

  return dayjs(date).utc().local().format("DD MMM YYYY HH:mm A");
};
