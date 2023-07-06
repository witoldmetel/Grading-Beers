import Hapi from "@hapi/hapi";
import dotenv from "dotenv";
import hapiAuthJWT from "hapi-auth-jwt2";

import statusPlugin from "./plugins/status";
import prismaPlugin from "./plugins/prisma";
import usersPlugin from "./plugins/users";
import authPlugin from "./plugins/auth";
import emailPlugin from "./plugins/email";
import testResultsPlugin from "./plugins/test-results";

dotenv.config();

const isProduction = process.env.NODE_ENV === "production";

const server: Hapi.Server = Hapi.server({
  port: process.env.PORT || 3000,
  host: process.env.HOST || "localhost",
});

export async function createServer(): Promise<Hapi.Server> {
  // Register the logger
  await server.register({
    plugin: require("hapi-pino"),
    options: {
      logEvents:
        process.env.CI === "true" || process.env.TEST === "true"
          ? false
          : undefined,
      prettyPrint: process.env.NODE_ENV !== "production",
      // Redact Authorization headers, see https://getpino.io/#/docs/redaction
      redact: ["req.headers.authorization"],
    },
  });

  // order of plugins doesn't matter, if we need specific plugin loaded first we use 'dependencies' ---> check usersPlugin
  await server.register([
    hapiAuthJWT,
    authPlugin,
    prismaPlugin,
    statusPlugin,
    usersPlugin,
    emailPlugin,
    testResultsPlugin,
  ]);
  await server.initialize();

  return server;
}

export async function startServer(server: Hapi.Server): Promise<Hapi.Server> {
  await server.start();

  console.log(`Server running on ${server.info.uri}`);
  console.log(`Server in on ${isProduction} mode`);

  return server;
}

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});
