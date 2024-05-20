"use server";

import prisma from "@/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import { v4 as uuidv4 } from "uuid";

export async function transferAmount(
  number: string | undefined,
  amount: number
) {
  const session = await getServerSession(authOptions);
  if (!session?.user || !session.user?.id) {
    return null;
  }

  const userId = Number(session.user.id);
  const currentUser = await prisma.user.findUnique({
    where: {
      id: Number(session.user.id),
    },
  });

  if (currentUser && currentUser.number === number) {
    return null;
  }
  try {
    const result = await prisma.$transaction(async (prisma) => {
      // Check if the current user has sufficient balance
      const currentUserBalance = await prisma.balance.findUnique({
        where: {
          userId,
        },
      });

      if (!currentUserBalance || currentUserBalance.amount < amount) {
        return null;
      }

      // Find the user linked to the given phone number
      const receivingUser = await prisma.user.findUnique({
        where: {
          number,
        },
      });

      if (!receivingUser) {
        return null;
      }

      // Update the current user's balance
      await prisma.balance.update({
        where: {
          userId,
        },
        data: {
          amount: currentUserBalance.amount - amount,
        },
      });

      // Update the receiving user's balance
      const receivingUserBalance = await prisma.balance.findUnique({
        where: {
          userId: receivingUser.id,
        },
      });

      if (!receivingUserBalance) {
        await prisma.balance.create({
          data: {
            userId: receivingUser.id,
            amount: amount,
            locked: 0,
          },
        });
      } else {
        await prisma.balance.update({
          where: {
            userId: receivingUser.id,
          },
          data: {
            amount: receivingUserBalance.amount + amount,
          },
        });
      }

      // Create the outgoing transaction for the current user
      const outgoingToken = uuidv4();
      await prisma.outgoing.create({
        data: {
          status: "Success",
          token: outgoingToken,
          startTime: new Date(),
          userId,
          to: receivingUser.firstname + " " + receivingUser.lastname,
          amount,
        },
      });

      // Create the incoming transaction for the receiving user
      const incomingToken = uuidv4();
      await prisma.incoming.create({
        data: {
          status: "Processing",
          token: incomingToken,
          startTime: new Date(),
          userId: receivingUser.id,
          from: currentUser?.firstname + " " + currentUser?.lastname || "",
          amount,
        },
      });

      return {
        message: "Transfer successful",
      };
    });

    return result;
  } catch (error) {
    return null;
  }
}
