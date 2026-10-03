"use client";

import { Heart, House, UserRound, UtensilsCrossed } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const destinations = [
  { href: "/", label: "Uy", icon: House },
  { href: "/recipes", label: "Retseptlar", icon: UtensilsCrossed },
  { href: "/favorites", label: "Sevimlilar", icon: Heart },
  { href: "/profile", label: "Profil", icon: UserRound },
];

export function MobileNavigation() {
  const pathname = usePathname();

  return (
    <nav aria-label="Asosiy navigatsiya" className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-border bg-background/95 px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur-xl md:hidden">
      {destinations.map(({ href, label, icon: Icon }) => {
        const isCurrent = href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            aria-current={isCurrent ? "page" : undefined}
            className={`flex min-h-11 flex-col items-center justify-center gap-1 rounded-sm text-[9px] font-medium transition-colors ${isCurrent ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
          >
            <Icon className="size-4" aria-hidden="true" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}