"use client";
import React from "react";
import { BackgroundBeams } from "./background-beams";

export function UsableBeams() {
  return (
    <div className="h-screen w-full rounded-md bg-neutral-950 relative flex flex-col items-center justify-center antialiased">
      <div className="max-w-2xl mx-auto p-4">
        <h1 className="relative z-10 text-lg md:text-7xl  bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600  text-center font-sans font-bold">
          Transform your business
        </h1>
        <p></p>
        <p className="text-neutral-500 max-w-lg mx-auto my-2 text-sm text-center relative z-10">
          Welcome to UWallet, we are here to transform your business. Get
          control of your own currency with the power of UWallet. Let your
          curstomers know about the dedication you but into your services. Run
          your own money, cashbacks, loyality point and much more!
        </p>
      </div>
      <BackgroundBeams />
    </div>
  );
}
