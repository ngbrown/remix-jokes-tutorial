import { PrismaClient } from "@prisma/client";

export const db: PrismaClient = createClient();

declare global {
  // noinspection ES6ConvertVarToLetConst
  var __db: PrismaClient | undefined;
}

// this is needed because in development we don't want to restart
// the server with every change, but we want to make sure we don't
// create a new connection to the DB with every change either.
function createClient() {
  if (process.env.NODE_ENV === "production") {
    return new PrismaClient();
  } else {
    if (!global.__db) {
      global.__db = new PrismaClient();
    }
    return global.__db;
  }
}
