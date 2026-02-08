"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import {
  Search,
  Filter,
  Clock,
  ArrowRight,
  CheckCircle2
} from "lucide-react";
import { Header, Footer } from "@/components/layout";
import { Card, CardContent, Badge, Modal } from "@/components/ui";
import { scenarios, Scenario } from "@/data/scenarios";
import * as Sections from "@/components/challenges";

const filters = ["Todos", "Iniciante", "Intermediário", "Avançado", "Expert"];

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

export default function ScenariosPage() {
  const [activeFilter, setActiveFilter] = useState("Todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);

  const filteredScenarios = useMemo(() => {
    return scenarios.filter((scenario) => {
      // Filtro por dificuldade
      const matchesDifficulty = 
        activeFilter === "Todos" || scenario.difficulty === activeFilter;
      
      // Filtro por termo de busca (título, descrição ou skills)
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        searchTerm === "" ||
        scenario.title.toLowerCase().includes(searchLower) ||
        scenario.description.toLowerCase().includes(searchLower) ||
        scenario.skills.some(skill => skill.toLowerCase().includes(searchLower));
      
      return matchesDifficulty && matchesSearch;
    });
  }, [activeFilter, searchTerm]);

  return (
    <div className="min-h-screen bg-gradient-radial">
      <Header />

      <main className="pt-24 pb-16 px-6 lg:px-8" data-testid="scenarios-page">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-12">
            <Badge className="mb-4">Trilha de Desenvolvimento</Badge>
            <h1 className="text-h1 text-white mb-4" data-testid="scenarios-title">
              Desafios de Automação
            </h1>
            <p className="text-lg text-[#BFBFBF] max-w-2xl">
              Evolua suas habilidades do básico ao expert. Cada desafio é projetado
              para desenvolver competências específicas de um QA profissional.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4 mb-8" data-testid="filters">
            <div className="flex items-center gap-2 text-[#BFBFBF]">
              <Filter className="w-4 h-4" />
              <span className="text-sm">Filtrar:</span>
            </div>
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  filter === activeFilter
                    ? "bg-[#FF6803] text-white"
                    : "bg-white/5 text-[#BFBFBF] hover:bg-white/10 hover:text-white border border-white/10"
                }`}
                data-testid={`filter-${filter.toLowerCase()}`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative max-w-md mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#BFBFBF]" />
            <input
              type="text"
              placeholder="Buscar desafios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/12 text-white placeholder:text-[#BFBFBF] focus:border-[#FF6803] focus:outline-none focus:ring-2 focus:ring-[#FF6803]/20"
              data-testid="scenarios-search"
            />
          </div>

          {/* Results Count */}
          <div className="mb-8 text-sm text-[#BFBFBF]" data-testid="results-count">
            {filteredScenarios.length} {filteredScenarios.length === 1 ? "desafio" : "desafios"}
            {activeFilter !== "Todos" && <span> em <strong className="text-white">{activeFilter}</strong></span>}
            {searchTerm && <span> para "<strong className="text-white">{searchTerm}</strong>"</span>}
          </div>

          {/* Scenarios Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="scenarios-grid">
            {filteredScenarios.map((scenario) => (
              <button
                key={scenario.id}
                onClick={() => setSelectedScenario(scenario)}
                className="text-left w-full"
              >
                <Card variant="interactive" className="h-full group" data-testid={`scenario-${scenario.id}`}>
                  <CardContent className="p-6">
                    {/* Icon and Badge */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-[#FF6803]/10 border border-[#FF6803]/30 flex items-center justify-center">
                        <scenario.icon className="w-6 h-6 text-[#FF6803]" />
                      </div>
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

                    {/* Title and Description */}
                    <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-[#FF6803] transition-colors">
                      {scenario.title}
                    </h3>
                    <p className="text-[#BFBFBF] text-sm mb-4">{scenario.description}</p>

                    {/* Meta */}
                    <div className="flex items-center gap-4 text-sm text-[#BFBFBF] mb-4">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {scenario.estimatedTime}
                      </span>
                      <span>{scenario.testCases.length} casos de teste</span>
                    </div>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-2">
                      {scenario.skills.slice(0, 3).map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-1 text-xs rounded-md bg-white/5 text-[#BFBFBF]"
                        >
                          {skill}
                        </span>
                      ))}
                      {scenario.skills.length > 3 && (
                        <span className="px-2 py-1 text-xs rounded-md bg-white/5 text-[#BFBFBF]">
                          +{scenario.skills.length - 3} mais
                        </span>
                      )}
                    </div>

                    {/* Arrow */}
                    <div className="mt-4 flex items-center text-[#FF6803] opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-sm font-medium">Começar a praticar</span>
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </div>
                  </CardContent>
                </Card>
              </button>
            ))}
          </div>

          {/* No Results */}
          {filteredScenarios.length === 0 && (
            <div className="text-center py-16" data-testid="no-results">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-[#BFBFBF]" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Nenhum desafio encontrado</h3>
              <p className="text-[#BFBFBF] mb-4">
                Tente ajustar o filtro ou termo de busca
              </p>
              <button
                onClick={() => {
                  setActiveFilter("Todos");
                  setSearchTerm("");
                }}
                className="text-[#FF6803] hover:underline"
              >
                Limpar filtros
              </button>
            </div>
          )}

          {/* Community */}
          <div className="mt-16 text-center">
            <Card className="inline-block px-8 py-6">
              <p className="text-white font-medium mb-2">Tem sugestões de novos desafios?</p>
              <p className="text-sm text-[#BFBFBF]">
                Contribua com ideias! Esta plataforma é feita pela comunidade de QAs.
              </p>
              <div className="mt-4">
                <Link href="/autor">
                  <span className="inline-flex items-center justify-center rounded-lg border border-white/12 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:border-white/20 hover:bg-white/8 transition-colors">
                    Entrar em contato
                  </span>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </main>

      {/* Modal com Seção Interativa + Casos de Teste */}
      {selectedScenario && (
        <Modal
          isOpen={!!selectedScenario}
          onClose={() => setSelectedScenario(null)}
          size="full"
        >
          <div className="space-y-6 p-6 lg:p-8">
            {/* Header */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#FF6803]/10 border border-[#FF6803]/30 flex items-center justify-center flex-shrink-0">
                <selectedScenario.icon className="w-6 h-6 text-[#FF6803]" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold text-white">{selectedScenario.title}</h2>
                  <Badge
                    variant={
                      selectedScenario.difficulty === "Iniciante"
                        ? "success"
                        : selectedScenario.difficulty === "Intermediário"
                        ? "warning"
                        : selectedScenario.difficulty === "Avançado"
                        ? "error"
                        : "primary"
                    }
                  >
                    {selectedScenario.difficulty}
                  </Badge>
                </div>
                <p className="text-[#BFBFBF] mb-3">{selectedScenario.description}</p>
                <div className="flex items-center gap-4 text-sm text-[#BFBFBF]">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {selectedScenario.estimatedTime}
                  </span>
                  <span>{selectedScenario.testCases.length} casos de teste</span>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-[1.25fr_0.75fr] gap-6">
              {/* Seção Interativa */}
              <div className="lg:col-span-2 relative z-20">
                <Card className="p-4 overflow-visible">
                  <h3 className="text-lg font-semibold text-white mb-4">Seção Interativa</h3>
                  {(() => {
                    const SectionComponent = sectionComponents[selectedScenario.id];
                    return SectionComponent ? <SectionComponent /> : (
                      <div className="text-center py-8 text-[#BFBFBF]">
                        Componente não encontrado
                      </div>
                    );
                  })()}
                </Card>
              </div>

              {/* Casos de Teste */}
              <div className="lg:col-span-1 relative z-10">
                <Card className="p-4">
                  <h3 className="text-lg font-semibold text-white mb-3">Casos de Teste</h3>
                  <div className="space-y-3">
                    {selectedScenario.testCases.map((testCase, index) => (
                      <div
                        key={index}
                        className="group p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#FF6803]/30 transition-all"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-[#FF6803]/20 border border-[#FF6803] flex items-center justify-center flex-shrink-0 text-xs text-[#FF6803] font-medium">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <h4 className="text-sm font-medium text-white mb-1 group-hover:text-[#FF6803] transition-colors">
                              {testCase.title}
                            </h4>
                            {testCase.description && (
                              <p className="text-xs text-[#BFBFBF] mb-2">{testCase.description}</p>
                            )}
                            {testCase.steps && testCase.steps.length > 0 && (
                              <div className="flex flex-wrap gap-1 mb-2">
                                {testCase.steps.map((step, stepIndex) => (
                                  <span
                                    key={stepIndex}
                                    className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-md bg-white/5 text-[#BFBFBF]"
                                  >
                                    <CheckCircle2 className="w-3 h-3" />
                                    {step}
                                  </span>
                                ))}
                              </div>
                            )}
                            {testCase.expectedResult && (
                              <div className="text-xs">
                                <span className="text-[#BFBFBF]">Resultado esperado: </span>
                                <span className="text-green-400">{testCase.expectedResult}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </Modal>
      )}

      <Footer />
    </div>
  );
}
