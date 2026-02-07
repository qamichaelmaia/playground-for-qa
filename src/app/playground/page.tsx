"use client";

import { useState, useRef, useEffect } from "react";
import { Header, Footer } from "@/components/layout";
import { Card, Badge } from "@/components/ui";
import { scenarios } from "@/data/scenarios";
import * as Sections from "@/components/challenges";

// Mapeamento de IDs para componentes de seção
const sectionComponents: Record<string, React.ComponentType> = {
  "elementos-basicos": Sections.ElementosBasicosSection,
  "formularios-simples": Sections.FormulariosSimplesSection,
  "navegacao-links": Sections.NavegacaoLinksSection,
  "alertas-modais": Sections.AlertasModaisSection,
  "checkboxes-radios": Sections.CheckboxesRadiosSection,
  "waits-sincronizacao": Sections.WaitsSincronizacaoSection,
  "tabelas-dinamicas": Sections.TabelasDinamicasSection,
  "upload-arquivos": Sections.UploadArquivosSection,
  "dropdowns-selects": Sections.DropdownsSelectsSection,
  "formularios-complexos": Sections.FormulariosComplexosSection,
  "data-pickers": Sections.DateTimePickersSection,
  "drag-drop": Sections.DragDropSection,
  "iframes-shadow-dom": Sections.IframesShadowDOMSection,
  "api-rest": Sections.IntegracaoAPISection,
  "autenticacao-sessoes": Sections.AutenticacaoSessoesSection,
  "pagamentos": Sections.SimulacaoPagamentosSection,
  "multi-window-tabs": Sections.MultiJanelasAbasSection,
  "conteudo-dinamico": Sections.ConteudoDinamicoSection,
  "fluxo-e2e-completo": Sections.TestesE2ESection,
  "performance-stress": Sections.TestesPerformanceSection,
  "acessibilidade": Sections.TestesAcessibilidadeSection,
  "internacionalizacao": Sections.TestesInternacionalizacaoSection,
  "graphql-websockets": Sections.IntegracaoGraphQLSection,
};

export default function PlaygroundPage() {
  const [activeSection, setActiveSection] = useState("elementos-basicos");
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const scrollToSection = (id: string) => {
    const element = sectionRefs.current[id];
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      setActiveSection(id);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.pageYOffset + 150;

      for (const scenario of scenarios) {
        const element = sectionRefs.current[scenario.id];
        if (element) {
          const { top, bottom } = element.getBoundingClientRect();
          const elementTop = top + window.pageYOffset;
          const elementBottom = bottom + window.pageYOffset;

          if (scrollPosition >= elementTop && scrollPosition < elementBottom) {
            setActiveSection(scenario.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-radial">
      <Header />

      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {/* Header */}
          <div className="mb-12">
            <Badge className="mb-4">Todos os Desafios</Badge>
            <h1 className="text-h1 text-white mb-4">Playground de Automação</h1>
            <p className="text-lg text-[#BFBFBF] max-w-2xl">
              Explore todas as 23 seções de desafios em uma única página. Use a navegação lateral para pular entre os desafios.
            </p>
          </div>

          <div className="flex gap-8">
            {/* Navegação Lateral (Sticky) */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-24 space-y-2 max-h-[calc(100vh-120px)] overflow-y-auto pr-2 modal-scrollbar">
                <div className="flex items-center justify-between mb-4 px-3">
                  <h2 className="text-sm font-semibold text-white">Navegação Rápida</h2>
                  <span className="text-xs text-[#BFBFBF]">{scenarios.length}</span>
                </div>
                {scenarios.map((scenario, index) => (
                  <button
                    key={scenario.id}
                    onClick={() => scrollToSection(scenario.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                      activeSection === scenario.id
                        ? "bg-[#FF6803] text-white font-medium"
                        : "text-[#BFBFBF] hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs opacity-60">{index + 1}</span>
                      <span className="truncate">{scenario.title}</span>
                    </div>
                  </button>
                ))}
              </div>
            </aside>

            {/* Conteúdo Principal */}
            <div className="flex-1 space-y-16">
              {scenarios.map((scenario) => {
                const SectionComponent = sectionComponents[scenario.id];
                
                return (
                  <div
                    key={scenario.id}
                    ref={(el) => { sectionRefs.current[scenario.id] = el; }}
                    id={`section-${scenario.id}`}
                    className="scroll-mt-24"
                  >
                    {/* Cabeçalho da Seção */}
                    <div className="mb-6">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-[#FF6803]/10 border border-[#FF6803]/30 flex items-center justify-center flex-shrink-0">
                          <scenario.icon className="w-6 h-6 text-[#FF6803]" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h2 className="text-2xl font-bold text-white">{scenario.title}</h2>
                            <Badge
                              variant={
                                scenario.difficulty === "Iniciante"
                                  ? "success"
                                  : scenario.difficulty === "Intermediário"
                                  ? "warning"
                                  : scenario.difficulty === "Avançado"
                                  ? "error"
                                  : "primary"
                              }
                            >
                              {scenario.difficulty}
                            </Badge>
                          </div>
                          <p className="text-[#BFBFBF]">{scenario.description}</p>
                        </div>
                      </div>
                    </div>

                    {/* Componente da Seção */}
                    {SectionComponent ? (
                      <SectionComponent />
                    ) : (
                      <Card className="p-6">
                        <div className="text-center py-8 text-[#BFBFBF]">
                          Componente não encontrado para a seção {scenario.id}
                        </div>
                      </Card>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
