"use client";

import * as React from "react";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Button } from "./ui/button";
import { Menu, Briefcase } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

const navLinks = [
  { href: "/portfolio", label: "Portfolio" },
  { href: "/resume", label: "Resume" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center pl-2 md:pl-4 lg:pl-8">
        <div className="mr-4 flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2 ">
            <Briefcase className="h-6 w-6 text-primary" />
            <span className="font-bold sm:inline-block">Jordan Bringgold</span>
          </Link>
          <nav className="hidden gap-6 text-sm md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-medium text-foreground/60 transition-colors hover:text-foreground/80"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-end gap-2">
          <ThemeToggle />
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader className="sr-only">
                <SheetTitle>Mobile Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-6 pt-6">
                <Link
                  href="/"
                  className="mr-6 flex items-center space-x-2"
                  onClick={() => setIsSheetOpen(false)}
                >
                  <Briefcase className="h-6 w-6 text-primary" />
                  <span className="font-bold">Jordan Bringgold</span>
                </Link>
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-lg font-medium text-foreground/80 transition-colors hover:text-foreground"
                    onClick={() => setIsSheetOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
