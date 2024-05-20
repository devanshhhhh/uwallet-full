"use client";
import { Button } from "@/components/ui/button";
import { UsableScroll } from "@/components/ui/usable-scroll";
import { useRouter } from "next/navigation";

export default async function Landing() {
  const router = useRouter();
  return (
    <main>
      <header className="border shadow-sm h-24 flex flex-row justify-between items-center ">
        <div className="ml-12">Logo</div>
        <div className="flex flex-row justify-end gap-12">
          <Button className="w-24" onClick={() => router.push("/signin")}>
            Login
          </Button>
          <Button
            className="w-24 mr-12"
            variant={"secondary"}
            onClick={() => router.push("/signup")}
          >
            Signup
          </Button>
        </div>
      </header>
      <UsableScroll />
    </main>
  );
}
