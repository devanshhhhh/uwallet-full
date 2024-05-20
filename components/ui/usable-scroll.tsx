"use client";
import React from "react";
import { ContainerScroll } from "../ui/container-scroll-animation";
import Image from "next/image";
import { WavyBackground } from "./wavy-background";

export function UsableScroll() {
  return (
    <WavyBackground>
      <div className="flex flex-col overflow-hidden">
        <ContainerScroll
          titleComponent={
            <>
              <h1 className="text-4xl font-semibold text-black dark:text-white">
                Transform your business with <br />
                <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none">
                  UWallet
                </span>
              </h1>
            </>
          }
        >
          <Image
            src="/dash.png"
            alt="hero"
            height={720}
            width={1400}
            className="mx-auto rounded-2xl object-cover h-full object-left-top"
            draggable={false}
          />
        </ContainerScroll>
      </div>
    </WavyBackground>
  );
}
