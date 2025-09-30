"use client";

import { SignedIn, SignedOut, UserButton, SignInButton } from "@clerk/nextjs";
import { Button } from "./ui/button";
import { LayoutDashboard, PenBox } from "lucide-react";
import Link from "next/link";

export default function ClientUserActions() {
  return (
    <>
      <SignedIn>
        <Link href="/dashboard" className="flex items-center gap-2">
          <Button variant="outline">
            <LayoutDashboard size={18} />
            <span className="hidden md:inline">Dashboard</span>
          </Button>
        </Link>
        <a href="/transaction/create">
          <Button className="flex items-center gap-2">
            <PenBox size={18} />
            <span className="hidden md:inline">Add Transaction</span>
          </Button>
        </a>
        <UserButton appearance={{ elements: { avatarBox: "w-12 h-12" } }} />
      </SignedIn>
      <SignedOut>
        <SignInButton forceRedirectUrl="/dashboard">
          <Button variant="outline">Login</Button>
        </SignInButton>
      </SignedOut>
    </>
  );
}
