"use server";

import prisma from "@/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import { v4 as uuidv4 } from "uuid";

export async function createOnRampTransaction(
  provider: string,
  amount: number
) {
  // Ideally the token should come from the banking provider (hdfc/axis)
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !session.user?.id) {
      return {
        message: "Unauthenticated request",
      };
    }
    const token = uuidv4();
    await prisma.onRampTransaction.create({
      data: {
        provider,
        status: "Processing",
        startTime: new Date(),
        token: token,
        userId: Number(session?.user?.id),
        amount: amount * 100,
      },
    });

    return {
      message: "Done",
    };
  } catch (e) {
    return null;
  }
}
