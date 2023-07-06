"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const date_fns_1 = require("date-fns");
const prisma = new client_1.PrismaClient();
// A `main` function so that we can use async/await
async function main() {
    const testUser = await prisma.user.upsert({
        create: {
            email: "test@prisma.io",
            firstName: "Grace",
            lastName: "Bell",
        },
        update: {
            firstName: "Grace",
            lastName: "Bell",
        },
        where: {
            email: "test@prisma.io",
        },
    });
    const testAdmin = await prisma.user.upsert({
        create: {
            email: "test-admin@prisma.io",
            firstName: "Raini",
            lastName: "Goenka",
            isAdmin: true,
        },
        update: {
            firstName: "Raini",
            lastName: "Goenka",
            isAdmin: true,
        },
        where: {
            email: "test-admin@prisma.io",
        },
    });
    console.log(`Created test user\tid: ${testUser.id} | email: ${testUser.email} `);
    console.log(`Created test admin\tid: ${testAdmin.id} | email: ${testAdmin.email} `);
    // Shouldn't be done on production
    await prisma.testResult.deleteMany({});
    await prisma.courseEnrollment.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.test.deleteMany({});
    await prisma.course.deleteMany({});
    const weekFromNow = (0, date_fns_1.add)(new Date(), { days: 7 });
    const twoWeekFromNow = (0, date_fns_1.add)(new Date(), { days: 14 });
    const monthFromNow = (0, date_fns_1.add)(new Date(), { days: 28 });
    const user = await prisma.user.create({
        data: {
            email: "grate@wow.com",
            firstName: "Alan",
            lastName: "Bowder",
            social: {
                facebook: "facebook",
                twitter: "twitter",
            },
        },
    });
    const course = await prisma.course.create({
        data: {
            name: "CRUD with Prisma",
            courseDetails: "This is a course about CRUD operations using Prisma.",
            tests: {
                createMany: {
                    data: [
                        { date: weekFromNow, name: "First Test" },
                        { date: twoWeekFromNow, name: "Second Test" },
                        { date: monthFromNow, name: "Third Test" },
                    ],
                },
            },
            members: {
                create: {
                    role: "TEACHER",
                    user: {
                        connect: {
                            email: user.email,
                        },
                    },
                },
            },
        },
        include: {
            tests: true,
            members: { include: { user: true } },
        },
    });
    const shakuntala = await prisma.user.create({
        data: {
            email: "devi@prisma.io",
            firstName: "Shakuntala",
            lastName: "Devi",
            social: {
                facebook: "facebook",
                twitter: "twitter",
            },
            courses: {
                create: {
                    role: "STUDENT",
                    course: {
                        connect: { id: course.id },
                    },
                },
            },
        },
    });
    const david = await prisma.user.create({
        data: {
            email: "david@prisma.io",
            firstName: "David",
            lastName: "Deutsch",
            social: {
                facebook: "facebook",
                twitter: "twitter",
            },
            courses: {
                create: {
                    role: "STUDENT",
                    course: {
                        connect: { id: course.id },
                    },
                },
            },
        },
    });
    const testResultsShakuntala = [800, 950, 910];
    const testResultsDavid = [650, 900, 950];
    let counter = 0;
    for (const test of course.tests) {
        await prisma.testResult.create({
            data: {
                gradedBy: {
                    connect: { email: user.email },
                },
                student: {
                    connect: { email: shakuntala.email },
                },
                test: {
                    connect: { id: test.id },
                },
                result: testResultsShakuntala[counter],
            },
        });
        await prisma.testResult.create({
            data: {
                gradedBy: {
                    connect: { email: user.email },
                },
                student: {
                    connect: { email: david.email },
                },
                test: {
                    connect: { id: test.id },
                },
                result: testResultsDavid[counter],
            },
        });
        // Get aggregates for each test
        const results = await prisma.testResult.aggregate({
            where: {
                testId: test.id,
            },
            _avg: { result: true },
            _max: { result: true },
            _min: { result: true },
            _count: true,
        });
        console.log(`test: ${test.name} (id: ${test.id})`, results);
        counter++;
    }
    // Get aggregates for David
    const davidAggregates = await prisma.testResult.aggregate({
        where: {
            student: { email: david.email },
        },
        _avg: { result: true },
        _max: { result: true },
        _min: { result: true },
        _count: true,
    });
    console.log(`David's results (email: ${david.email})`, davidAggregates);
    // Get aggregates for Shakuntala
    const shakuntalaAggregates = await prisma.testResult.aggregate({
        where: {
            student: { email: shakuntala.email },
        },
        _avg: { result: true },
        _max: { result: true },
        _min: { result: true },
        _count: true,
    });
    console.log(`Shakuntala's results (email: ${shakuntala.email})`, shakuntalaAggregates);
}
main()
    .catch(async (e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    // Disconnect Prisma Client
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map