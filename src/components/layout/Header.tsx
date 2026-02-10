"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { Menu, X, FlaskConical, LogOut, User, ChevronDown, Pencil } from "lucide-react";
import { Button } from "@/components/ui";

const navigation = [
  { name: "Início", href: "/" },
  { name: "Desafios individuais", href: "/scenarios" },
  { name: "Playground de Automação", href: "/playground" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const isAutorPage = pathname === "/autor";
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";

  // Fechar menu do usuário ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      setProfileImage(null);
      return;
    }

    const fetchProfileImage = async () => {
      try {
        const response = await fetch("/api/profile");
        const data = await response.json();
        if (data?.success) {
          setProfileImage(data.profile?.image || null);
        }
      } catch {
        setProfileImage(null);
      }
    };

    fetchProfileImage();
  }, [isAuthenticated]);

  const handleSignOut = async () => {
    setUserMenuOpen(false);
    await signOut({ callbackUrl: "/" });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0B0501]/80 backdrop-blur-xl border-b border-white/8" data-testid="header">
      <nav className="mx-auto max-w-7xl px-6 lg:px-8" aria-label="Main navigation">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group" data-testid="header-logo">
            <div className="w-10 h-10 rounded-xl bg-[#FF6803] flex items-center justify-center shadow-[0_4px_20px_rgba(255,104,3,0.3)] group-hover:shadow-[0_8px_30px_rgba(255,104,3,0.4)] transition-all duration-200">
              <FlaskConical className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-white hidden sm:block">
              QA Playground
            </span>
          </Link>

          {/* Desktop Navigation */}
          {!isAutorPage && (
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
          )}

          {/* Desktop Actions */}
          {!isAutorPage && (
            <div className="hidden md:flex md:items-center md:gap-4">
              <Link href="/autor">
                <Button variant="primary" size="sm" data-testid="start-button">
                  Conheça o Autor
                </Button>
              </Link>

              {/* Auth Section */}
              {isAuthenticated ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl border border-white/12 hover:border-white/20 hover:bg-white/8 transition-all duration-200"
                    data-testid="user-menu-button"
                    aria-expanded={userMenuOpen}
                  >
                    {profileImage ? (
                      <img
                        src={profileImage}
                        alt="Avatar"
                        className="w-7 h-7 rounded-full"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-[#FF6803]/20 flex items-center justify-center">
                        <User className="w-4 h-4 text-[#FF6803]" />
                      </div>
                    )}
                    <span className="text-sm text-white max-w-[120px] truncate">
                      {session?.user?.name || session?.user?.email?.split("@")[0]}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-[#BFBFBF] transition-transform duration-200 ${userMenuOpen ? "rotate-180" : ""}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-xl bg-[#1a1210] border border-white/12 shadow-lg overflow-hidden" data-testid="user-dropdown">
                      <div className="p-3 border-b border-white/8">
                        <p className="text-sm font-medium text-white truncate">{session?.user?.name || "Usuário"}</p>
                        <p className="text-xs text-[#BFBFBF] truncate">{session?.user?.email}</p>
                      </div>
                      <div className="p-1">
                        <Link
                          href="/profile"
                          onClick={() => setUserMenuOpen(false)}
                          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-[#BFBFBF] hover:text-white hover:bg-white/8 rounded-lg transition-colors"
                          data-testid="edit-profile-button"
                        >
                          <Pencil className="w-4 h-4" />
                          Editar perfil
                        </Link>
                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-[#BFBFBF] hover:text-white hover:bg-white/8 rounded-lg transition-colors"
                          data-testid="logout-button"
                        >
                          <LogOut className="w-4 h-4" />
                          Sair da conta
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          )}

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
        {mobileMenuOpen && !isAutorPage && (
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

              {/* Mobile Auth */}
              {isAuthenticated && (
                <div className="flex items-center gap-3 py-3 border-t border-white/8">
                  {profileImage ? (
                    <img src={profileImage} alt="Avatar" className="w-8 h-8 rounded-full" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#FF6803]/20 flex items-center justify-center">
                      <User className="w-4 h-4 text-[#FF6803]" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{session?.user?.name || "Usuário"}</p>
                    <p className="text-xs text-[#BFBFBF] truncate">{session?.user?.email}</p>
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-2 pt-4 border-t border-white/8">
                <Link href="/scenarios" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" className="w-full">Começar Desafios</Button>
                </Link>
                {!isAutorPage && (
                  <Link href="/autor" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="secondary" className="w-full">Conheça o Autor</Button>
                  </Link>
                )}
                {isAuthenticated && (
                  <Link href="/profile" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="secondary" className="w-full">Editar perfil</Button>
                  </Link>
                )}
                {isAuthenticated ? (
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-[#BFBFBF]"
                    onClick={() => { setMobileMenuOpen(false); handleSignOut(); }}
                    data-testid="mobile-logout-button"
                  >
                    <LogOut className="w-4 h-4" />
                    Sair da conta
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
