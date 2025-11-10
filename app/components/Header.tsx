import Link from "next/link";
import { Handbag, Heart, Plus } from "lucide-react";
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
        <Link
          href={"/favorites"}
          className="p-2 text-[#1a1a1a] hover:text-[#4a4a4a] transition-colors cursor-pointer"
        >
          <Heart size={20} />
        </Link>
        <Link
          href={"/cart"}
          className="p-2 text-[#1a1a1a] hover:text-[#4a4a4a] transition-colors cursor-pointer"
        >
          <Handbag size={20} />
        </Link>
        <Link
          href={"/myads/new"}
          className="px-4 py-1 bg-[#1a1a1a] text-white rounded-full hover:bg-[#2a2a2a] transition-colors cursor-pointer flex items-center justify-center gap-1"
        >
          <Plus size={15} />
          Place add
        </Link>
      </div>
    </header>
  );
}
