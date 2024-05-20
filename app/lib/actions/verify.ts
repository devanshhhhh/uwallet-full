"use server";
import prisma from "@/db";
import { sendEmail } from "../usenodemailer";

export async function sendVerificationToken(email: string | undefined) {
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
      currUser.Verifications[0].verificationToken
    ) {
      token = currUser.Verifications[0].verificationToken;
      sendEmail(
        currUser.email,
        "Verify your UWallet account",
        `<p>Your OTP for verification is: ${token}<p>`
      );
    } else {
      token = Math.random().toString(36).substring(2, 8).toUpperCase();
      await prisma.verifications.upsert({
        where: { userId: currUser.id },
        update: { verificationToken: token },
        create: { userId: currUser.id, verificationToken: token },
      });
      sendEmail(
        currUser.email,
        "Verify your UWallet account",
        `<p>Your OTP for verification is: ${token}<p>`
      );
    }
    return { status: 200 };
  } catch (e) {
    return { status: 500 };
  }
}

export async function checkVerificationToken(
  userEmail: string | undefined,
  token: string
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
      currUser.Verifications[0].verificationToken
    ) {
      if (token && token === currUser.Verifications[0].verificationToken) {
        await prisma.user.update({
          where: { email: userEmail },
          data: {
            isVerified: true,
          },
        });
        await prisma.verifications.upsert({
          where: { userId: currUser.id },
          update: { verificationToken: null },
          create: { userId: currUser.id, verificationToken: null },
        });

        return { status: 200 };
      }
    }
  } catch (e) {
    return { status: 500 };
  }
}
