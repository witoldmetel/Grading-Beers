"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// plugin to instantiate Prisma Client
const plugin = {
    name: "app/status",
    register: async function (server) {
        server.route({
            // default status endpoint
            method: "GET",
            path: "/",
            handler: (_, h) => h.response({ up: true }).code(200),
        });
    },
};
exports.default = plugin;
//# sourceMappingURL=status.js.map