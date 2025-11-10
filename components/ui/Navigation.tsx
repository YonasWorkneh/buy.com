"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export const navItems = [
  { href: "/shop", label: "Shop" },
  { href: "/favorites", label: "Favorites" },
  { href: "/cart", label: "Cart" },
  { href: "/myads", label: "My ads" },
  { href: "/contact", label: "Contact" },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="hidden md:flex items-center gap-8 flex-1 justify-center">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className="relative text-[#1a1a1a] hover:text-[#4a4a4a] transition-colors pb-1 group"
          >
            {item.label}
            {!isActive && (
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#1a1a1a] transition-all duration-300 group-hover:w-full"></span>
            )}
            {isActive && (
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-[#1a1a1a] rounded-full"></span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
