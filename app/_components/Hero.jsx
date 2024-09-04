import React from "react";
import GetStartedButton from "./GetStartedButton";
import NavbarButton from "./Navbar/NavbarButton";

const Hero = () => {
  return (
    <>
      <section className="hero pt-48 mt-6 sm:pt-36 h-[860x] flex flex-col items-center justify-center w-full h-[full]bg-opacity-50 gap-5 ">
        <h1 className="text-8xl text-black text-center font-bold">
          <span className="text-8xl pr-4 font-bold text-transparent bg-clip-text bg-gradient-to-br from-[#1359f9] to-[#e3e5e9] ">
            Explore
          </span>
          GEs with Ease
        </h1>
        <p className="text-gray-500 text-center text-lg">
          Uses{" "}
          <a
            href="https://assist.org"
            target="_blank"
            class="underline decoration-black"
          >
            {" "}
            Assist.org
          </a>{" "}
          to handpick the best Community College courses just for you!{" "}
        </p>
        <ul className="flex gap-3 items-center">
          <GetStartedButton text="Get Started" redirect="/areas" />
        </ul>
      </section>

      <div className="text-5xl text-black text-center font-bold pt-48">
        More
      </div>

      <div className="text-5xl text-black text-center font-bold pt-48">FAQ</div>
      <div className="circlePosition w-[400px] h-[300px] bg-blue-600 rounded-[75%] absolute z-3 top-[50%] left-[60%] translate-x--1/2 translate-y--1/2 blur-[140px]" />
    </>
  );
};

export default Hero;
