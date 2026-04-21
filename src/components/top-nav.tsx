"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Forside" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/jobs", label: "Job" },
  { href: "/setup", label: "Opsætning" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function TopNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-20 mb-12 rounded-full border border-white/70 bg-white/80 px-5 py-4 shadow-[0_10px_35px_rgba(15,23,42,0.06)] backdrop-blur md:mb-16">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <Link href="/" className="text-lg font-semibold tracking-tight text-slate-900">
          JobPilot
        </Link>

        <nav className="flex flex-wrap items-center gap-2 text-sm text-slate-600 sm:gap-3">
          {navItems.map((item) => {
            const active = isActive(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 transition ${
                  active
                    ? "bg-slate-950 text-white shadow-sm"
                    : "hover:bg-slate-100 hover:text-slate-950"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
