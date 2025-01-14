import Provider from "./providers";

import Navbar from "@/app/_components/Navbar/Navbar";

import "@/styles/globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "GE Explorer",
  description:
    "Explore CSU General Education courses, professors, and ratings.",
  icons: {
    icon: "/compass.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <Provider>
          <header>
            <Navbar />
          </header>
          {children}
        </Provider>
      </body>
    </html>
  );
}
