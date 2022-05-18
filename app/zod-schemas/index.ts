import { z } from "zod";

export const dateSchema = z.preprocess((arg) => {
  return typeof arg === "string"
    ? new Date(arg)
    : arg instanceof Date
    ? arg
    : undefined;
}, z.date());
