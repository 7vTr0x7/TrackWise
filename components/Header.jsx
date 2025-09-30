import React from "react";
import { Button } from "./ui/button";
import { PenBox, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { checkUser } from "@/lib/checkUser";
import Image from "next/image";
import ClientUserActions from "./ClientUserActions";


const Header = async () => {
  await checkUser();

  return (
    <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/">
          <Image
            src={"/logo.png"}
            alt="Welth Logo"
            width={200}
            height={60}
            className="h-8 w-auto object-contain"
          />
        </Link>

        {/* Navigation Links - Different for signed in/out users */}
        <div className="hidden md:flex items-center space-x-8">
          <SignedOut>
            <a href="#features" className="text-gray-600 hover:text-blue-600">
              Features
            </a>
            <a
              href="#testimonials"
              className="text-gray-600 hover:text-blue-600">
              Testimonials
            </a>
          </SignedOut>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-4">
          <ClientUserActions />
        </div>
      </nav>
    </header>
  );
};

export default Header;
