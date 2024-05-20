"use client";
import { Inter } from "next/font/google";
import "../globals.css";
import { cn } from "@/lib/utils";
const inter = Inter({ subsets: ["latin"] });
import SideNavbar from "@/components/ui/Sidenavbar";
import { Providers } from "../providers";
import { Toaster } from "react-hot-toast";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [dark, setDark] = useState(false);
  return (
    <html lang="en">
      {" "}
      <Toaster />
      <Providers>
        <body
          className={cn(
            `min-h-screen w-full flex ${dark ? "dark" : ""}`,
            inter.className,
            {
              "debug-screens": process.env.NODE_ENV === "development",
            }
          )}
        >
          <SideNavbar />
          <div className="p-4 md:p-8 w-full flex flex-col">
            <Button className="self-end" onClick={() => setDark(!dark)}>
              {dark ? <Sun /> : <Moon />}
            </Button>
            {children}
          </div>
        </body>
      </Providers>
    </html>
  );
}
