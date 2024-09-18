"use client"
import Navbar from "../components/home/navbar";

import { useState } from "react";




export default function Home() {
  return (
    <div className="home-page">
      <div className="box-border mx-auto w-[1100px] max-2xl:w-[1200px] max-xl:w-[920px] max-lg:w-[680px] max-md:w-[440px] max-sm:w-[340px]">
        <Navbar />
        <HomePage />
      </div>
    </div>
  );
}

const HomePage = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const togglePopup = (e) => {
    e.preventDefault();
    setIsPopupOpen(!isPopupOpen);
  };
  return (
    <div className="w-full dotted-background relative flex flex-col items-center justify-center">
      <div className="flex items-center justify-center max-md:hidden">
        <section className="py-32 max-md:py-12">
          <section className="mx-auto flex justify-center max-w-[980px] flex-col items-center gap-2 py-8 md:py-12 md:pb-8 lg:py-24 lg:pb-20">
            <a className="bg-slate-50 inline-flex items-center rounded-lg bg-muted px-3 py-1 text-sm font-sans">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                class="lucide lucide-blocks h-4 w-4"
                lg="[object Object]"
                x="[object Object]"
              >
                <rect width="7" height="7" x="14" y={3} rx={1}></rect>
                <path d="M10 21V8a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1H3"></path>
              </svg>
              <span className="mx-3">coming soon</span>
            </a>

            <h1 className="text-center text-base font-bold leading-tight tracking-tighter md:text-4xl lg:leading-[1.1]">
              converting files into machine-readable formats
            </h1>
            <span
              className="max-w-[750px] text-center text-lg font-light text-foreground"
              style={{
                display: "inline-block",
                verticalAlign: "top",
                textDecoration: "inherit",
                textWrap: "balance",
              }}
            >
              Transformo Docs: Seamlessly detecting Non machine readable files and converting files into machine-readable formats. 
            </span>

            <div className="flex w-full items-center justify-center space-x-4 py-4 md:pb-10">
              <a href="/analyzer">
                <button className="cursor-pointer whitespace-nowrap flex flex-row items-center justify-center gap-2 rounded-md text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gradient-to-b from-neutral-600 to-neutral-900 text-white shadow-md hover:brightness-105 hover:shadow-lg transition-all duration-200 ease-in-out h-10 px-4 py-2">
                  File Analyzer
                </button>
              </a>
              {/* <a href="#" onClick={togglePopup}>
                <button className="whitespace-nowrap flex flex-row items-center justify-center gap-2 rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
                Help us improve
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="lucide lucide-arrow-right ml-1 h-4 w-4 transition-transform duration-300 ease-in-out transform hover:translate-x-1"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </button>
              </a> */}
            </div>
          </section>
        </section>
      </div>
    </div>
  );
};

const Footer = () => {
  return (
    <div>
      <div>
        <div id="Knowmore"></div>
        <div className="p-10 w-full">
          <div className="flex items-center justify-center gap-4 my-4">
            <a
              href="https://github.com/Adarsh-jaiss"
              target="_blank"
              rel="noopener noreferrer"
            >
              Github
            </a>
            <a
              href="https://x.com/twtadarsh"
              target="_blank"
              rel="noopener noreferrer"
            >
              Twitter
            </a>
          </div>
          <p className="text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} shipper. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};
