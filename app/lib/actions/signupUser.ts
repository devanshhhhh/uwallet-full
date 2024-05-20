"use server";

import prisma from "@/db";
import bcrypt from "bcrypt";

interface credentials {
  firstname: string;
  lastname: string;
  email: string;
  number: string;
  password: string;
}
export async function signUp({
  firstname,
  lastname,
  email,
  number,
  password,
}: credentials) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const existingUser = await prisma.user.findFirst({
    where: {
      number: number,
    },
  });

  if (existingUser) {
    return { status: 411 };
  }
  try {
    const user = await prisma.user.create({
      data: {
        firstname: firstname,
        lastname: lastname,
        email: email,
        number: number,
        password: hashedPassword,
      },
    });
    await prisma.balance.create({
      data: {
        userId: user.id,
        amount: 0,
        locked: 0,
      },
    });

    return {
      id: user.id.toString(),
      name: user.firstname,
      email: user.number,
    };
  } catch (e) {
    return null;
  }
}
