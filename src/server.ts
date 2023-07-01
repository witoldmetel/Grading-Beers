import Hapi from "@hapi/hapi";
import statusPlugin from "./plugins/status";
import prismaPlugin from "./plugins/prisma";

const server: Hapi.Server = Hapi.server({
  port: process.env.PORT || 3000,
  host: process.env.HOST || "localhost",
});

export async function start(): Promise<Hapi.Server> {
  await server.register([statusPlugin, prismaPlugin]);

  await server.start();
  console.log(`Server running on ${server.info.uri}`);
  return server;
}

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

start().catch((err) => {
  console.log(err);
});
