"use client";

import React, { useRef } from "react";
import Link from "next/link";

import {
  Globe,
  FlaskConical,
  Microscope,
  Calculator,
  CircleCheckBig,
  CornerRightDown,
} from "lucide-react";
import OrbitingCircles from "@/app/_components/ui/orbiting-circles";

const Hero = () => {
  const infoRef = useRef(null);

  return (
    <>
      <div className="w-[20vw] h-[30vh] bg-blue-600 rounded-[75%] absolute z-3 top-[60%] left-[70%] translate-x--1/2 translate-y--1/2 blur-[150px]" />
      <div className="w-[20vw] h-[20vh] bg-blue-600 rounded-[75%] absolute z-3 top-[40%] left-[10%] translate-x--1/2 translate-y--1/2 blur-[140px]" />

      <div className="flex flex-col overflow-clip h-[calc(100vh-80px-80px)] items-center justify-center">
        <section className="fade-up mt-6 flex flex-col items-center gap-5 ">
          <h1 className="text-6xl lg:text-8xl max-w-[75%] text-black text-center font-bold">
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-[#1359f9] to-[#e3e5e9] ">
              Explore
            </span>{" "}
            GEs with Ease
          </h1>

          <p className="text-gray-500 text-center text-lg max-w-[75%]">
            Browse our collection of General Education courses
          </p>
        </section>

        <Link href="/courses" className="mb-12">
          <button className="group mt-6 text-lg font-medium text-white overflow-hidden px-6 py-3 rounded-full flex space-x-2 items-center bg-gradient-to-r from-[#1335f9ec] hover:to-[#a3c0fa] to-[#89aefa]">
            Get Started
            <div className="flex items-center -space-x-3 translate-x-3">
              <div className="w-2.5 h-[1.6px] rounded bg-white origin-left transition duration-300 scale-x-0  group-hover:scale-x-100"></div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 stroke-white -translate-x-2 transition duration-300 group-hover:translate-x-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </button>
        </Link>
      </div>

      <button
        className="flex gap-3 text-gray-500 items-center mb-6"
        onClick={() => {
          if (infoRef.current) {
            infoRef.current.scrollIntoView({ behavior: "smooth" });
          }
        }}
      >
        <h1 className="text-4xl font-bold">Learn more</h1>
        <CornerRightDown size={36} />
      </button>

      <div
        className="flex lg:flex-row flex-col items-center w-full mt-2 gap-12 justify-between"
        ref={infoRef}
      >
        <div className="relative flex h-[425px] w-full lg:w-1/2 items-center justify-center overflow-hidden">
          <span className="pointer-events-none text-center text-5xl font-semibold leading-normal text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-violet-500 to-blue-500">
            100+ Subjects
          </span>
          <OrbitingCircles
            className="border-none bg-transparent"
            duration={20}
            delay={20}
            radius={80}
          >
            <Globe size={40} className="text-purple-800" />
          </OrbitingCircles>
          <OrbitingCircles
            className="border-none bg-transparent"
            duration={20}
            delay={10}
            radius={80}
          >
            <FlaskConical size={40} className="text-blue-800" />
          </OrbitingCircles>
          <OrbitingCircles
            className="border-none bg-transparent"
            radius={190}
            duration={20}
            reverse
          >
            <Calculator size={40} className="text-red-800" />
          </OrbitingCircles>
          <OrbitingCircles
            className="border-none bg-transparent"
            radius={190}
            duration={20}
            delay={20}
            reverse
          >
            <Microscope size={40} className="text-green-800" />
          </OrbitingCircles>
        </div>

        <div className="flex flex-col gap-5 w-[70%] lg:w-1/2">
          <h2 className="text-4xl font-medium text-black">
            Find the perfect course for{" "}
            <span className="decor decoration-wavy underline decoration-indigo-600 underline-offset-4">
              You.
            </span>
          </h2>
          <ul className="flex flex-col text-3xl gap-5 mb-16">
            <li className="flex items-center gap-3">
              <CircleCheckBig
                size={35}
                strokeWidth={2}
                className="text-green-700"
              />
              Transferrable
            </li>
            <li className="flex items-center gap-3">
              <CircleCheckBig
                size={35}
                strokeWidth={2}
                className="text-green-700"
              />
              Online
            </li>
            <li className="flex items-center gap-3">
              <CircleCheckBig
                size={35}
                strokeWidth={2}
                className="text-green-700"
              />
              Affordable
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Hero;
