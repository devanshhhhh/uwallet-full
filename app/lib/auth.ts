import prisma from "@/db";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        phone: {
          label: "Phone number",
          type: "text",
          placeholder: "+91 XXXX-XXX-XXX",
          requried: true,
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Password",
          required: true,
        },
      },
      async authorize(credentials: any) {
        const existingUser = await prisma.user.findFirst({
          where: {
            number: credentials.phone,
          },
        });
        console.log("Reached 1");
        if (existingUser) {
          const passwordValidation = await bcrypt.compare(
            credentials.password,
            existingUser.password
          );
          if (passwordValidation) {
            return {
              id: existingUser.id.toString(),
              firstname: existingUser.firstname,
              email: existingUser.number,
            };
          }
          return null;
        } else {
          console.log("Reached 2");
          const byEmail = await prisma.user.findFirst({
            where: {
              email: credentials.phone,
            },
          });
          if (byEmail) {
            const passwordValidation = await bcrypt.compare(
              credentials.password,
              byEmail.password
            );
            if (passwordValidation) {
              return {
                id: byEmail.id.toString(),
                firstname: byEmail.firstname,
                email: byEmail.number,
              };
            }
            return null;
          }
        }

        return null;
      },
    }),
  ],
  secret: process.env.JWT_SECRET || "secret",
  callbacks: {
    async session({ token, session }: any) {
      session.user.id = token.sub;
      // session.user.name = token.firstname + " " + token.lastname;
      // session.user.number = token.number;
      // session.user.email = token.email;

      return session;
    },
  },
  pages: {
    signIn: "/signin",
  },
};
