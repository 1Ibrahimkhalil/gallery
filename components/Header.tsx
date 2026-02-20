"use client";

import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { Image as ImageIcon, Menu, X, LayoutDashboard } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const Header = () => {
  const { user, isLoaded } = useUser();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "My Images", href: "/dashboard/images", icon: ImageIcon },
  ];

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled
          ? "bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800/60 shadow-xs py-2"
          : "bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 py-3",
      )}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex h-14 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-blue-600 p-1.5 rounded-lg transition-transform group-hover:scale-110">
              <ImageIcon className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl md:text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-blue-600 to-indigo-600">
              Gallery
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {isLoaded &&
              user &&
              navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-sm font-medium transition-all hover:text-blue-600 flex items-center gap-2 relative group py-1",
                    pathname === link.href
                      ? "text-blue-600"
                      : "text-muted-foreground",
                  )}
                >
                  <link.icon className="w-4 h-4" />
                  {link.name}
                  {pathname === link.href && (
                    <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-blue-600 rounded-full" />
                  )}
                  {pathname !== link.href && (
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 rounded-full transition-all group-hover:w-full" />
                  )}
                </Link>
              ))}
          </nav>

          {/* Auth & Mobile Toggle */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-3">
              {isLoaded &&
                (user ? (
                  <div className="flex items-center gap-4 border-l pl-4 ml-2 border-slate-200 dark:border-slate-800">
                    <UserButton />
                  </div>
                ) : (
                  <>
                    <SignInButton mode="modal">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="font-medium cursor-pointer"
                      >
                        Log in
                      </Button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 cursor-pointer shadow-md shadow-blue-500/20"
                      >
                        Get Started
                      </Button>
                    </SignUpButton>
                  </>
                ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-muted-foreground hover:text-blue-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle Menu"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white dark:bg-slate-950 border-b shadow-2xl animate-in slide-in-from-top-4 duration-200">
          <div className="container mx-auto px-4 py-6 flex flex-col gap-3">
            {isLoaded && user ? (
              <>
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "text-base font-medium p-3 rounded-xl flex items-center gap-3 transition-colors",
                      pathname === link.href
                        ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20"
                        : "hover:bg-slate-50 dark:hover:bg-slate-900",
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <link.icon className="w-5 h-5" />
                    {link.name}
                  </Link>
                ))}
                <div className="flex items-center justify-between pt-4 border-t mt-2 border-slate-100 dark:border-slate-800">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold">
                      {user.fullName || user.username}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {user.primaryEmailAddress?.emailAddress}
                    </span>
                  </div>
                  <UserButton />
                </div>
              </>
            ) : (
              <div className="grid grid-cols-1 gap-3 pt-2">
                <SignInButton mode="modal">
                  <Button
                    variant="outline"
                    className="w-full justify-center h-12 text-base font-semibold cursor-pointer"
                  >
                    Sign In
                  </Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-base font-semibold cursor-pointer shadow-lg shadow-blue-500/25">
                    Create Account
                  </Button>
                </SignUpButton>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
