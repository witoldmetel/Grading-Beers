"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("@hapi/joi"));
const usersPlugin = {
    name: "app/users",
    // we need this to make sure that prisma plugin is already loaded
    dependencies: ["app/prisma"],
    register: async function (server) {
        server.route([
            {
                method: "GET",
                path: "/users/{userId}",
                handler: getUserHandler,
                options: {
                    validate: {
                        params: joi_1.default.object({
                            userId: joi_1.default.string().pattern(/^[0-9]+$/),
                        }),
                        failAction: (request, h, err) => {
                            // show validation errors to user https://github.com/hapijs/hapi/issues/3706
                            throw err;
                        },
                    },
                },
            },
            {
                method: "POST",
                path: "/users",
                handler: registerHandler,
                options: {
                    validate: {
                        payload: userInputValidator,
                        failAction: (request, h, err) => {
                            // show validation errors to user https://github.com/hapijs/hapi/issues/3706
                            throw err;
                        },
                    },
                },
            },
            {
                method: "DELETE",
                path: "/users/{userId}",
                handler: deleteHandler,
                options: {
                    validate: {
                        params: joi_1.default.object({
                            userId: joi_1.default.string().pattern(/^[0-9]+$/),
                        }),
                        failAction: (request, h, err) => {
                            // show validation errors to user https://github.com/hapijs/hapi/issues/3706
                            throw err;
                        },
                    },
                },
            },
            {
                method: "PUT",
                path: "/users/{userId}",
                handler: updateHandler,
                options: {
                    validate: {
                        params: joi_1.default.object({
                            userId: joi_1.default.string().pattern(/^[0-9]+$/),
                        }),
                        payload: userInputValidator,
                        failAction: (request, h, err) => {
                            // show validation errors to user https://github.com/hapijs/hapi/issues/3706
                            throw err;
                        },
                    },
                },
            },
        ]);
    },
};
exports.default = usersPlugin;
const userInputValidator = joi_1.default.object({
    firstName: joi_1.default.string().required(),
    lastName: joi_1.default.string().required(),
    email: joi_1.default.string().email().required(),
    social: joi_1.default.object({
        facebook: joi_1.default.string().optional(),
        twitter: joi_1.default.string().optional(),
        github: joi_1.default.string().optional(),
        website: joi_1.default.string().optional(),
    }).optional(),
});
async function getUserHandler(request, h) {
    const { prisma } = request.server.app;
    const userId = request.params.userId;
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: parseInt(userId, 10),
            },
        });
        if (!user) {
            return h.response().code(404);
        }
        else {
            return h.response(user).code(200);
        }
    }
    catch (err) {
        console.log(err);
        return h.response().code(500);
    }
}
async function registerHandler(request, h) {
    const { prisma } = request.server.app;
    const payload = request.payload;
    try {
        const createdUser = await prisma.user.create({
            data: {
                firstName: payload.firstName,
                lastName: payload.lastName,
                email: payload.email,
                // social: JSON.stringify(payload.social),
                social: payload.social,
            },
            select: {
                id: true,
            },
        });
        return h.response(createdUser).code(200);
    }
    catch (err) {
        console.log(err);
    }
}
async function deleteHandler(request, h) {
    const { prisma } = request.server.app;
    const userId = request.params.userId;
    try {
        await prisma.user.delete({
            where: {
                id: parseInt(userId, 10),
            },
        });
        return h.response().code(204);
    }
    catch (err) {
        console.log(err);
        return h.response().code(500);
    }
}
async function updateHandler(request, h) {
    const { prisma } = request.server.app;
    const userId = request.params.userId;
    const payload = request.payload;
    try {
        await prisma.user.update({
            where: {
                id: parseInt(userId, 10),
            },
            data: payload,
        });
        return h.response().code(204);
    }
    catch (err) {
        console.log(err);
        return h.response().code(500);
    }
}
//# sourceMappingURL=users.js.map