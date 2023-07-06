"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = __importDefault(require("../client"));
// plugin to instantiate Prisma Client
const plugin = {
    name: "app/prisma",
    register: async function (server) {
        server.app.prisma = client_1.default;
        server.ext({
            type: "onPostStop",
            method: async (server) => {
                server.app.prisma.$disconnect();
            },
        });
    },
};
exports.default = plugin;
//# sourceMappingURL=prisma.js.map