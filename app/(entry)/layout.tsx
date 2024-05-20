import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { UsableBeams } from "@/components/ui/usable-beams";
import { Toaster } from "react-hot-toast";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "UWallet",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div></div>
        <div className="flex flex-row">
          <Toaster />
          <div className="h-screen w-screen bg-slate-600 hidden xl:flex">
            <UsableBeams />
          </div>
          <div className="w-screen">{children}</div>
        </div>
      </body>
    </html>
  );
}
