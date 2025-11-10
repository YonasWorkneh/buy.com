import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import Navigation from "./Navigation";
import SearchBar from "./SearchBar";

export default function Header() {
  return (
    <header className="w-full px-6 md:px-12 lg:px-16 py-6 flex items-center justify-between bg-[#ede8d048]">
      {/* Logo */}
      <div className="shrink-0">
        <Link href="/" className="text-2xl font-bold text-[#1a1a1a]">
          <span className="font-bold">BUY</span>
          <span className="font-normal">.com</span>
        </Link>
      </div>

      {/* Navigation - Hidden on mobile, shown on desktop */}
      <Navigation />

      {/* Right side icons and button */}
      <div className="flex items-center gap-4">
        <SearchBar />
        <button className="p-2 text-[#1a1a1a] hover:text-[#4a4a4a] transition-colors">
          <ShoppingBag size={20} />
        </button>
        <button className="hidden sm:block px-6 py-2 bg-[#1a1a1a] text-white rounded-full hover:bg-[#2a2a2a] transition-colors cursor-pointer">
          Sign Up
        </button>
      </div>
    </header>
  );
}
