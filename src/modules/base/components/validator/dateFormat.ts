import { format } from "date-fns";

export const formatDateTime = (date: string, formatType: string): string => {
  return format(new Date(date), formatType);
};
