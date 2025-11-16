"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button"; // shadcn button (adjust path if needed)


const navItems = [
    { label: "Home", href: "/" },
    { label: "Images", href: "/images" },
    { label: "Products", href: "/products" },
];

const Navbar: React.FC = () => {
    const pathname = usePathname() || "/";
    const [open, setOpen] = useState(false);

    const isActive = (href: string) =>
        href === "/" ? pathname === "/" : pathname.startsWith(href);

    return (
        <header className="w-full bg-white/80 backdrop-blur sticky top-0 z-40 border-b">
            <div className="w-5/6 mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-14">
                    {/* Brand */}
                    <div className="flex items-center gap-3">
                        <Link href="/" aria-label="Ngoc Lam shop managerment">
                            <span className="inline-block text-lg font-extrabold text-slate-900">
                                Ngoc Lam
                            </span>
                        </Link>
                        <span className="text-sm text-slate-500 hidden sm:inline">
                            shop management
                        </span>
                    </div>

                    {/* Desktop nav */}
                    <nav className="hidden sm:flex items-center gap-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                aria-current={isActive(item.href) ? "page" : undefined}
                                className={
                                    "px-3 py-2 rounded-md text-sm transition-colors " +
                                    (isActive(item.href)
                                        ? "font-semibold text-slate-900 bg-slate-100"
                                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50")
                                }
                            >
                                {item.label}
                            </Link>
                        ))}
                        <Button asChild>
                            <Link href="/settings" className="ml-2">
                                Settings
                            </Link>
                        </Button>
                    </nav>

                    {/* Mobile controls */}
                    <div className="sm:hidden flex items-center">
                        <button
                            onClick={() => setOpen((v) => !v)}
                            aria-expanded={open}
                            aria-label="Toggle menu"
                            className="inline-flex items-center justify-center p-2 rounded-md text-slate-700 hover:bg-slate-100"
                        >
                            {/* simple hamburger / close icon */}
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                {open ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
                {/* Mobile menu */}
                {open && (
                    <div className="sm:hidden mt-2 pb-4">
                        <nav className="flex flex-col gap-1">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setOpen(false)}
                                    className={
                                        "block px-3 py-2 rounded-md text-sm transition-colors " +
                                        (isActive(item.href)
                                            ? "font-semibold text-slate-900 bg-slate-100"
                                            : "text-slate-600 hover:text-slate-900 hover:bg-slate-50")
                                    }
                                >
                                    {item.label}
                                </Link>
                            ))}
                            <Link
                                href="/settings"
                                onClick={() => setOpen(false)}
                                className="mt-1 px-3 py-2 rounded-md text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                            >
                                Settings
                            </Link>
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Navbar;