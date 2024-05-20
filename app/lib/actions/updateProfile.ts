"use server";

import prisma from "@/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";

export async function updateUserDetails(
  firstname: string,
  lastname: string,
  email: string
) {
  const session = await getServerSession(authOptions);
  if (!session?.user || !session.user?.id) {
    return {
      message: "Unauthenticated request",
    };
  }

  try {
    await prisma.user.update({
      where: {
        id: Number(session.user.id),
      },
      data: {
        firstname,
        lastname,
        email,
      },
    });

    return {
      message: "User details updated successfully",
    };
  } catch (error) {
    return {
      message: "Failed to update user details",
    };
  }
}
