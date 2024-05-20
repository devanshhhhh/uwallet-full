"use client";
import { useRouter } from "next/navigation";

export default async function Landing() {
  const router = useRouter();
  router.push("/signin");
  return <></>;
}
