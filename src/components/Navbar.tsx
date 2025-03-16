"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ModeToggle } from "./ModeToggle";
import { CodeIcon } from "lucide-react";
import { SignedIn, UserButton } from "@clerk/nextjs";

function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto flex h-16 items-center justify-between px-6 md:px-12">
        {/* LEFT - LOGO */}
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold text-2xl font-mono hover:opacity-80 transition-opacity"
        >
          <CodeIcon className="size-8 text-emerald-500" />
          <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
            CodeForge
          </span>
        </Link>

        {/* RIGHT - ACTIONS */}
        <SignedIn>
          <div className="flex items-center space-x-6">
            <button
              onClick={() => router.push(pathname === "/dashboard" ? "/" : "/dashboard")}
              className="px-5 py-2.5 rounded-full font-medium transition-all 
                         bg-emerald-600 text-white hover:bg-emerald-700 shadow-md
                         active:scale-95"
            >
              {pathname === "/dashboard" ? "Home" : "Dashboard"}
            </button>
            <ModeToggle />
            <UserButton afterSignOutUrl="/" />
          </div>
        </SignedIn>
      </div>
    </nav>
  );
}

export default Navbar;
