"use server";
import { getServerSession } from "next-auth";
import type { NextApiRequest, NextApiResponse } from "next";
import { authOptions } from "../auth";
import prisma from "@/db";

export async function getUserDetails() {
  const session = await getServerSession(authOptions);
  if (!session?.user || !session.user?.id) {
    return {
      message: "Unauthenticated request",
    };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(session?.user?.id) },
      include: {
        OnRampTransaction: true,
        Balance: true,
        Incoming: true,
        Outgoing: true,
      },
    });
    return user;
  } catch (error) {
    return { message: "error" };
  }
}
