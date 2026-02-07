"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Code2, FlaskConical } from "lucide-react";
import { Button } from "@/components/ui";

const navigation = [
  { name: "Início", href: "/" },
  { name: "Desafios", href: "/scenarios" },
  { name: "Playground", href: "/playground" },
  { name: "Sobre", href: "/about" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0B0501]/80 backdrop-blur-xl border-b border-white/8" data-testid="header">
      <nav className="mx-auto max-w-7xl px-6 lg:px-8" aria-label="Main navigation">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group" data-testid="header-logo">
            <div className="w-10 h-10 rounded-xl bg-[#FF6803] flex items-center justify-center shadow-[0_4px_20px_rgba(255,104,3,0.3)] group-hover:shadow-[0_8px_30px_rgba(255,104,3,0.4)] transition-all duration-200">
              <FlaskConical className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-white hidden sm:block">QA Playground</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-[#BFBFBF] hover:text-white transition-colors duration-200"
                data-testid={`nav-link-${item.name.toLowerCase()}`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex md:items-center md:gap-4">
            <Link href="/scenarios">
              <Button variant="primary" size="sm" data-testid="start-button">
                Começar Desafios
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden p-2 text-[#BFBFBF] hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            data-testid="mobile-menu-button"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/8" data-testid="mobile-menu">
            <div className="flex flex-col gap-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-base font-medium text-[#BFBFBF] hover:text-white transition-colors duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                  data-testid={`mobile-nav-link-${item.name.toLowerCase()}`}
                >
                  {item.name}
                </Link>
              ))}
              <div className="flex flex-col gap-2 pt-4 border-t border-white/8">
                <Link href="/scenarios" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" className="w-full">Começar Desafios</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
