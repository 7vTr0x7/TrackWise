import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "TrackWise",
  description: "One stop Finance Platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={` ${inter.className}`}>
        {children}
        <footer>
          <div>
            <p>&copy; 2025 TrackWise. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
