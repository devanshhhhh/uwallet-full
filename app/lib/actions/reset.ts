"use server";
import prisma from "@/db";
import { sendEmail } from "../usenodemailer";
import bcrypt from "bcrypt";

export async function sendResetToken(email: string | undefined) {
  if (!email || email === "") {
    return { status: -1 };
  }
  try {
    const currUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
      include: {
        Verifications: true,
      },
    });
    if (!currUser) {
      return { status: 411 };
    }
    let token;

    if (
      currUser.Verifications.length > 0 &&
      currUser.Verifications[0].resetToken
    ) {
      token = currUser.Verifications[0].resetToken;
      sendEmail(
        currUser.email,
        "Reset your UWallet account password",
        `<p>Your OTP for resetting your password is: ${token}<p>`
      );
    } else {
      token = Math.random().toString(36).substring(2, 8).toUpperCase();
      await prisma.verifications.upsert({
        where: { userId: currUser.id },
        update: { resetToken: token },
        create: { userId: currUser.id, resetToken: token },
      });
      sendEmail(
        currUser.email,
        "Reset your UWallet account password",
        `<p>Your OTP for resetting your password is: ${token}<p>`
      );
    }
    return { status: 200 };
  } catch (e) {
    return { status: 500 };
  }
}

export async function checkResetToken(
  userEmail: string | undefined,
  token: string,
  password: string
) {
  if (!userEmail || userEmail === "") {
    return { status: -1 };
  }
  try {
    const currUser = await prisma.user.findUnique({
      where: {
        email: userEmail,
      },
      include: {
        Verifications: true,
      },
    });

    if (!currUser) {
      return { status: 411 };
    }
    if (
      currUser.Verifications.length > 0 &&
      currUser.Verifications[0].resetToken
    ) {
      if (token && token === currUser.Verifications[0].resetToken) {
        const hashedPassword = await bcrypt.hash(password, 10);
        await prisma.user.update({
          where: { email: userEmail },
          data: {
            password: hashedPassword,
          },
        });
        await prisma.verifications.upsert({
          where: { userId: currUser.id },
          update: { resetToken: null },
          create: { userId: currUser.id, resetToken: null },
        });

        return { status: 200 };
      }
    }
  } catch (e) {
    return { status: 500 };
  }
}
