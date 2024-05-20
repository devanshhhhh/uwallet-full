import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("securepassword", 10);

  const usersData = [
    {
      email: "john.doe@example.com",
      firstname: "John",
      lastname: "Doe",
      number: "1234567890",
      password: hashedPassword,
      isVerified: true,
    },
    {
      email: "jane.smith@example.com",
      firstname: "Jane",
      lastname: "Smith",
      number: "0987654321",
      password: hashedPassword,
      isVerified: true,
    },
    {
      email: "alice.jones@example.com",
      firstname: "Alice",
      lastname: "Jones",
      number: "1122334455",
      password: hashedPassword,
      isVerified: true,
    },
    {
      email: "bob.brown@example.com",
      firstname: "Bob",
      lastname: "Brown",
      number: "5566778899",
      password: hashedPassword,
      isVerified: true,
    },
  ];

  for (const userData of usersData) {
    await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: userData,
    });
  }

  const users = await prisma.user.findMany();

  for (const user of users) {
    await prisma.balance.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        amount: 1000,
        locked: 0,
      },
    });

    await prisma.onRampTransaction.createMany({
      data: [
        {
          status: "Success",
          token: uuidv4(),
          provider: "ProviderA",
          amount: 500,
          startTime: new Date(),
          userId: user.id,
        },
        {
          status: "Processing",
          token: uuidv4(),
          provider: "ProviderB",
          amount: 300,
          startTime: new Date(),
          userId: user.id,
        },
      ],
    });

    await prisma.outgoing.createMany({
      data: [
        {
          status: "Success",
          token: uuidv4(),
          startTime: new Date(),
          userId: user.id,
          to: "Recipient One",
          amount: 200,
        },
        {
          status: "Processing",
          token: uuidv4(),
          startTime: new Date(),
          userId: user.id,
          to: "Recipient Two",
          amount: 150,
        },
      ],
    });

    await prisma.incoming.createMany({
      data: [
        {
          status: "Success",
          token: uuidv4(),
          startTime: new Date(),
          userId: user.id,
          from: "Sender One",
          amount: 250,
        },
        {
          status: "Failure",
          token: uuidv4(),
          startTime: new Date(),
          userId: user.id,
          from: "Sender Two",
          amount: 100,
        },
      ],
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
