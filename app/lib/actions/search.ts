"use server";
import prisma from "@/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
export async function findUserByPhone(phone: string) {
  if (!phone || phone === "") {
    return null;
  }
  const session = await getServerSession(authOptions);
  if (!session?.user || !session.user?.id) {
    return null;
  }
  try {
    const currentUser = await prisma.user.findUnique({
      where: {
        id: Number(session.user.id),
      },
    });

    if (currentUser && currentUser.number === phone) {
      return null;
    }
  } catch (e) {
    return null;
  }
  try {
    const user = await prisma.user.findUnique({
      where: {
        number: phone,
      },
    });
    if (user) {
      return {
        name: (user?.firstname || "") + " " + (user?.lastname || ""),
        number: user?.number,
        email: user?.email,
      };
    } else {
      {
        return null;
      }
    }
  } catch (e) {
    return null;
  }
}
