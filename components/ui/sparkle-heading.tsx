"use client";
import React from "react";
import { SparklesCore } from "./sparkles";

export function SparklesHeading({ text }: { text: string }) {
  return (
    <div className="h-full w-full  flex flex-col items-center justify-center overflow-hidden rounded-md">
      <h1 className="text-5xl md:text-5xl lg:text-7xl font-bold text-center text-black relative z-20">
        {text}
      </h1>
      <div className="w-[40rem] h-40 relative">
        <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-slate-500 to-transparent h-[2px] w-3/4 blur-sm" />
        <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-gray-500 to-transparent h-[5px] w-1/4 blur-sm" />
        <SparklesCore
          background="transparent"
          minSize={0.4}
          maxSize={1}
          particleDensity={1200}
          className="w-full h-full"
          particleColor="#000000"
        />
        <div className="absolute inset-0 w-full h-full bg-white [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,black)]"></div>
      </div>
    </div>
  );
}
