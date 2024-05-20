"use server";

import prisma from "@/db";

export async function checkVerified(number: string) {
  if (!number || number === "") {
    return { status: -1 };
  }
  try {
    const currUser = await prisma.user.findUnique({
      where: {
        number: number,
      },
    });
    if (currUser && currUser.isVerified === true) {
      return { status: 200 };
    } else {
      const mailUser = await prisma.user.findUnique({
        where: {
          email: number,
        },
      });
      if (mailUser && mailUser.isVerified === true) {
        return { status: 200 };
      } else {
        return { email: mailUser?.email };
      }
    }
  } catch (e) {
    return { status: 500 };
  }
}
