import Link from "next/link";
import { FlaskConical, Github, Instagram, Linkedin } from "lucide-react";

const footerLinks = {
  practice: [
    { name: "Desafios individuais", href: "/scenarios" },
    { name: "Playground", href: "/playground" },
  ],
  learn: [
    { name: "Guia Playwright", href: "https://playwright.dev/docs/intro" },
    { name: "Guia Cypress", href: "https://docs.cypress.io/app/get-started/why-cypress" },
    { name: "Guia Selenium", href: "https://www.selenium.dev/documentation/" },
  ],
  community: [
    { name: "Sobre o Projeto", href: "/about" },
    { name: "Contribuir", href: "/contribute" },
    { name: "Contato", href: "https://www.linkedin.com/in/qamichael/"},
  ],
};

const socialLinks = [
  { name: "GitHub", href: "https://github.com/qamichaelmaia", icon: Github },
  { name: "Instagram", href: "https://www.instagram.com/qa.michael", icon: Instagram },
  { name: "LinkedIn", href: "https://www.linkedin.com/in/qamichael/", icon: Linkedin },
];

export function Footer() {
  return (
    <footer className="bg-[#0B0501] border-t border-white/8" data-testid="footer">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2" data-testid="footer-logo">
              <div className="w-10 h-10 rounded-xl bg-[#FF6803] flex items-center justify-center">
                <FlaskConical className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-semibold text-white">QA Playground</span>
            </Link>
            <p className="mt-4 text-sm text-[#BFBFBF] max-w-xs">
              Plataforma gratuita de desafios para QAs desenvolverem suas habilidades em automação.
            </p>
            <div className="flex items-center gap-4 mt-6">
              {socialLinks.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#BFBFBF] hover:text-white transition-colors duration-200"
                  aria-label={item.name}
                  data-testid={`social-link-${item.name.toLowerCase()}`}
                >
                  <item.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4" data-testid="footer-section-learn">Aprender</h3>
            <ul className="space-y-3">
              {footerLinks.learn.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#BFBFBF] hover:text-white transition-colors duration-200"
                    data-testid={`footer-link-${link.name.toLowerCase().replace(/\s/g, "-")}`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4" data-testid="footer-section-practice">Praticar</h3>
            <ul className="space-y-3">
              {footerLinks.practice.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#BFBFBF] hover:text-white transition-colors duration-200"
                    data-testid={`footer-link-${link.name.toLowerCase().replace(/\s/g, "-")}`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4" data-testid="footer-section-community">Comunidade</h3>
            <ul className="space-y-3">
              {footerLinks.community.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#BFBFBF] hover:text-white transition-colors duration-200"
                    data-testid={`footer-link-${link.name.toLowerCase().replace(/\s/g, "-")}`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-white/8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-[#BFBFBF]" data-testid="copyright">
            © {new Date().getFullYear()} QA Playground. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-sm text-[#BFBFBF] hover:text-white transition-colors duration-200">
              Política de Privacidade
            </Link>
            <Link href="/terms" className="text-sm text-[#BFBFBF] hover:text-white transition-colors duration-200">
              Termos de Uso
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
