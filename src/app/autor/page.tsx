"use client";

import Link from "next/link";
import { useState } from "react";
import profileImage from "./1759330229713.jpg";
import {
  ArrowRight,
  Award,
  Briefcase,
  Building2,
  CheckCircle2,
  Copy,
  Database,
  FileText,
  Globe,
  GraduationCap,
  Gauge,
  Github,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Smartphone,
  Target,
} from "lucide-react";
import { Header, Footer } from "@/components/layout";
import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { projects } from "@/data/projects";

const skills = [
  "Playwright",
  "Appium",
  "Cypress",
  "Selenium",
  "Robot Framework",
  "Postman",
  "Docker",
  "CI/CD (Azure DevOps, GitLab, GitHub Actions, Jenkins)",
  "JavaScript, Typescript, Python, Ruby, C#, Java",
  "Testes Web, Mobile e API",
  "K6 e JMeter",
  "SQL Server, MySQL, MongoDB",
];

const experiences = [
  {
    company: "Checkmob",
    role: "QA Analyst (Pleno)",
    period: "Maio de 2025 - atualmente",
    summary:
      "QA responsável pela liderança técnica do time de Qualidade em uma plataforma de gestão de equipes e vendas externas (Web/Mobile/API).",
    highlights: [
      "Definição de requisitos de qualidade e criação de casos de teste funcionais, exploratórios e regressão.",
      "Automação com Playwright (Web), Appium (Mobile) e Zapier para processos.",
      "Implementação do projeto de automação e uso de MCP para manutenção dos testes.",
      "Integração de testes automatizados na pipeline de CI/CD.",
    ],
    results: [
      "Redução de 46% no tempo de regressão com automação.",
      "Cobertura de automação acima de 70% em módulos críticos.",
      "Melhoria de 58% na detecção precoce de falhas por sprint.",
    ],
  },
  {
    company: "Pris",
    role: "Quality Assurance (Junior)",
    period: "Janeiro de 2024 - Maio de 2025",
    summary:
      "Projetos de Remuneração Variável e Incentivo de Longo Prazo (ILP) com Scrum.",
    highlights: [
      "Cenários de teste em BDD com Gherkin para cadastros e relatórios.",
      "Testes funcionais, exploratórios, regressão, performance e banco de dados.",
      "Testes de API com Postman e scripts de validação de endpoints.",
      "Documentação em Qase e acompanhamento via ClickUp.",
    ],
    results: [
      "Redução de 33% dos bugs em produção na sprint de atuação.",
      "Reconhecimento do time de produto pela qualidade das entregas.",
    ],
  },
  {
    company: "Crowdtest",
    role: "Analista de Testes / QA (Freelancer)",
    period: "Janeiro de 2023 - Abril de 2025",
    summary:
      "Projetos para Serasa, Natura, C&A e Meu Patrocínio em web e mobile.",
    highlights: [
      "Testes funcionais, exploratórios e de usabilidade em múltiplas plataformas.",
      "Reportes de bugs com evidências em ferramentas de gestão.",
      "Contribuição em melhorias de fluxo e experiência do usuário.",
    ],
    results: [
      "Falhas críticas identificadas em fluxo de pagamento e navegação mobile.",
      "Avaliação 5 estrelas em 91% dos ciclos de testes.",
    ],
  },
  {
    company: "Pipoca Ágil",
    role: "Analista de QA (Voluntário)",
    period: "Dezembro de 2022 - Abril de 2025",
    summary:
      "Atuação voluntária em aplicação Web e Mobile na área da saúde.",
    highlights: [
      "Análise de requisitos e critérios de aceitação desde o início do projeto.",
      "Cenários de testes funcionais, exploratórios e regressivos em web e Android.",
      "Validação de usabilidade e acessibilidade para produtos de saúde.",
    ],
    results: [
      "Detecção de inconsistências críticas no fluxo de login e cadastro.",
      "Estruturação da primeira suíte de testes manuais com documentação clara.",
    ],
  },
];

const certifications = [
  {
    name: "Graduado em Análise e Desenvolvimento de Sistemas",
    institution: "Faculdade FACINT",
    period: "Set de 2023 - Jan de 2026",
  },
  {
    name: "Engenharia de Qualidade de Software",
    institution: "EBAC",
    period: "Formação concluída",
  },
];

const sectionTabs = [
  { id: "skills", label: "Skills", icon: Target },
  { id: "experience", label: "Experiência", icon: Briefcase },
  { id: "projects", label: "Projetos", icon: ArrowRight },
  { id: "certifications", label: "Certificações", icon: Award },
] as const;

type SectionTabId = (typeof sectionTabs)[number]["id"];

const splitRoleTitle = (role: string) => {
  const match = role.match(/^(.*)\s\((.*)\)$/);
  if (!match) return { title: role, seniority: "" };
  return { title: match[1], seniority: match[2] };
};

const projectTypeMeta = {
  API: {
    label: "API",
    icon: Database,
    accent: "text-sky-300",
    badge: "bg-sky-500/10 border-sky-500/30 text-sky-300",
  },
  Mobile: {
    label: "Mobile",
    icon: Smartphone,
    accent: "text-emerald-300",
    badge: "bg-emerald-500/10 border-emerald-500/30 text-emerald-300",
  },
  Web: {
    label: "Web",
    icon: Globe,
    accent: "text-amber-300",
    badge: "bg-amber-500/10 border-amber-500/30 text-amber-300",
  },
  Performance: {
    label: "Performance",
    icon: Gauge,
    accent: "text-violet-300",
    badge: "bg-violet-500/10 border-violet-500/30 text-violet-300",
  },
  Documentacao: {
    label: "Documentação",
    icon: FileText,
    accent: "text-cyan-300",
    badge: "bg-cyan-500/10 border-cyan-500/30 text-cyan-300",
  },
} as const;

const projectFilters = [
  { id: "Todos", label: "Todos", icon: Target, accent: "text-white" },
  { id: "Web", label: "Web", icon: Globe, accent: projectTypeMeta.Web.accent },
  { id: "Mobile", label: "Mobile", icon: Smartphone, accent: projectTypeMeta.Mobile.accent },
  { id: "API", label: "API", icon: Database, accent: projectTypeMeta.API.accent },
  { id: "Performance", label: "Performance", icon: Gauge, accent: projectTypeMeta.Performance.accent },
  { id: "Documentacao", label: "Documentação", icon: FileText, accent: projectTypeMeta.Documentacao.accent },
] as const;

type ProjectFilterId = (typeof projectFilters)[number]["id"];

export default function AutorPage() {
  const [activeSection, setActiveSection] = useState<SectionTabId>("skills");
  const [projectFilter, setProjectFilter] = useState<ProjectFilterId>("Todos");
  const filteredProjects =
    projectFilter === "Todos"
      ? projects
      : projects.filter((project) => project.type === projectFilter);

  return (
    <div className="min-h-screen bg-gradient-radial">
      <Header />

      <main className="pt-24 pb-16 sm:pt-28 sm:pb-20">
        <section className="relative px-4 sm:px-6 lg:px-8">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-20 right-[-120px] w-[420px] h-[420px] bg-[#FF6803]/20 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-120px] left-[-120px] w-[420px] h-[420px] bg-[#AE3A02]/20 rounded-full blur-[140px]" />
          </div>

          <div className="relative mx-auto max-w-6xl">
            <div className="mb-8 sm:mb-10">
              <Badge variant="primary" dot>
                Portfolio
              </Badge>
            </div>

            <div className="grid gap-6 sm:gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">
              <div>
                <Card className="h-fit">
                <CardContent className="pt-6 space-y-6">
                  <div className="flex items-center justify-center">
                    <div className="w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-40 lg:h-40 rounded-full border border-white/15 bg-white/5 overflow-hidden">
                      <img
                        src={profileImage.src}
                        alt="Foto de Michael Maia"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="text-center space-y-2">
                    <h1 className="text-xl sm:text-2xl font-semibold text-white">Michael Maia</h1>
                    
                    <p className="text-sm sm:text-base text-[#FF6803] font-medium">Quality Assurance</p>
                  </div>
                  <div className="space-y-3 text-xs sm:text-sm text-[#BFBFBF]">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>Bahia, Brasil</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Instagram className="w-4 h-4" />
                      <Link
                          href="https://www.instagram.com/qa.michael"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-white transition-colors"
                      >
                          Instagram
                      </Link>
                    </div>
                    <div className="flex items-center gap-2">
                        <Linkedin className="w-4 h-4" />
                      <Link
                          href="https://www.linkedin.com/in/qamichael/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-white transition-colors"
                      >
                          LinkedIn
                        </Link>
                      </div>
                      <div className="flex items-center gap-2">
                        <Github className="w-4 h-4" />
                        <Link
                          href="https://github.com/qamichaelmaia"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-white transition-colors"
                        >
                          GitHub
                        </Link>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <button
                          type="button"
                          onClick={() => navigator.clipboard.writeText("contatomichaelmaia@gmail.com")}
                          className="break-all hover:text-white transition-colors"
                          data-testid="contact-email-copy"
                        >
                          contatomichaelmaia@gmail.com
                        </button>
                        <button
                          type="button"
                          onClick={() => navigator.clipboard.writeText("contatomichaelmaia@gmail.com")}
                          className="relative group text-[#BFBFBF] hover:text-white transition-colors"
                          aria-label="Copiar"
                          data-testid="contact-email-copy-icon"
                        >
                          <Copy className="w-4 h-4" />
                          <span className="pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 rounded-md border border-white/12 bg-[#1a1a1a] px-2 py-1 text-xs text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                            Copiar
                          </span>
                        </button>
                    </div>
                  </div>
                </CardContent>
                </Card>
              </div>

              <div className="space-y-5">
                <Card>
                  <CardHeader>
                    <CardTitle>Resumo Profissional</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-[#BFBFBF]">
                    <p>
                      Sou formado em Engenharia de Qualidade de Software pela EBAC e graduado em Análise e
                      Desenvolvimento de Sistemas pela FACINT. Com 4+ anos de experiência, atualmente sou
                      o QA responsável pela liderança técnica do Time de Qualidade na Checkmob, plataforma de
                      gestão de equipes e vendas externas (Web/Mobile/API).
                    </p>
                    <p>
                      Tenho experiências anteriores na Pris (empresa do Banco BTG Pactual), Pipoca Ágil e Crowdtest, onde pude trabalhar com planejamentos, testes Manuais, testes automatizados, testes de usabilidade e testes de performance em projetos de empresas como Serasa, Natura, C&A e Meu Patrocínio.
                    </p>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-3">
                  {sectionTabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeSection === tab.id;

                    return (
                      <Button
                        key={tab.id}
                        variant={isActive ? "primary" : "secondary"}
                        onClick={() => setActiveSection(tab.id)}
                        className="w-full sm:w-auto justify-center"
                        data-testid={`autor-tab-${tab.id}`}
                      >
                        <Icon className="w-4 h-4" />
                        {tab.label}
                      </Button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10 sm:mt-12 md:-mt-24 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">
              <div className="hidden lg:block" aria-hidden="true" />
              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-5 sm:p-6 lg:p-8">
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-0 right-0 h-40 w-40 bg-[#FF6803]/10 blur-[80px]" />
                </div>

                {activeSection === "skills" && (
                  <div key="skills" className="animate-fade-in-up">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8">
                      <div>
                        <Badge className="mb-3">Skills</Badge>
                        <h2 className="text-h1 text-white">Especialidades</h2>
                      </div>
                      <Target className="w-6 h-6 text-[#FF6803]" />
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {skills.map((skill) => (
                        <Card key={skill} className="p-4">
                          <div className="flex items-start gap-3">
                            <CheckCircle2 className="w-4 h-4 text-[#FF6803] flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-white">{skill}</span>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {activeSection === "experience" && (
                  <div key="experience" className="animate-fade-in-up">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8">
                      <div>
                        <Badge className="mb-3">Experiência</Badge>
                        <h2 className="text-h1 text-white">Trajetória Profissional</h2>
                      </div>
                      <Briefcase className="w-6 h-6 text-[#FF6803]" />
                    </div>
                    <div className="space-y-6">
                      {experiences.map((experience) => (
                        <Card key={experience.company}>
                          <CardHeader>
                            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                              <div>
                                <CardTitle className="text-white">
                                  {splitRoleTitle(experience.role).title}
                                  {splitRoleTitle(experience.role).seniority && (
                                    <span className="text-[#FF6803]"> {splitRoleTitle(experience.role).seniority}</span>
                                  )}
                                </CardTitle>
                                <div className="flex items-center gap-2 text-sm text-[#BFBFBF]">
                                  <Building2 className="w-4 h-4" />
                                  <span>{experience.company}</span>
                                </div>
                              </div>
                              <Badge variant="default">{experience.period}</Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <p className="text-sm text-[#BFBFBF]">{experience.summary}</p>
                            <div className="grid gap-4 md:grid-cols-2">
                              <div>
                                <p className="text-xs uppercase text-[#FF6803] mb-2">Atividades</p>
                                <ul className="space-y-2 text-sm text-[#BFBFBF]">
                                  {experience.highlights.map((item) => (
                                    <li key={item} className="flex items-start gap-2">
                                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#FF6803]" />
                                      <span>{item}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <p className="text-xs uppercase text-[#FF6803] mb-2">Resultados</p>
                                <ul className="space-y-2 text-sm text-[#BFBFBF]">
                                  {experience.results.map((item) => (
                                    <li key={item} className="flex items-start gap-2">
                                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-green-400" />
                                      <span>{item}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {activeSection === "projects" && (
                  <div key="projects" className="animate-fade-in-up">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8">
                      <div>
                        <Badge className="mb-3">Projetos</Badge>
                        <h2 className="text-h1 text-white">Projetos em Destaque</h2>
                      </div>
                      <ArrowRight className="w-6 h-6 text-[#FF6803]" />
                    </div>
                    <div className="flex flex-wrap gap-2 sm:gap-3 mb-6">
                      {projectFilters.map((filter) => {
                        const FilterIcon = filter.icon;
                        const isActive = projectFilter === filter.id;

                        return (
                          <Button
                            key={filter.id}
                            variant="secondary"
                            onClick={() => setProjectFilter(filter.id)}
                            className={`text-xs sm:text-sm ${isActive ? "ring-2 ring-[#FF6803]/30" : ""}`}
                            data-testid={`project-filter-${filter.id.toLowerCase()}`}
                          >
                            <FilterIcon className={`w-4 h-4 ${filter.accent}`} />
                            <span className={filter.accent}>{filter.label}</span>
                          </Button>
                        );
                      })}
                    </div>
                    <div className="grid gap-6 md:grid-cols-2">
                      {filteredProjects.map((project) => {
                        const meta = projectTypeMeta[project.type];
                        const TypeIcon = meta.icon;

                        return (
                          <Card key={project.name} className="overflow-hidden h-full flex flex-col">
                            <div className="h-40 w-full border-b border-white/10 bg-gradient-to-br from-white/5 via-white/0 to-white/5 flex items-center justify-center overflow-hidden">
                              {project.imageUrl ? (
                                <img
                                  src={project.imageUrl}
                                  alt={`Capa do projeto ${project.name}`}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="text-xs uppercase tracking-[0.2em] text-[#BFBFBF]">Imagem do projeto</div>
                              )}
                            </div>
                            <CardContent className="pt-6 flex flex-1 flex-col">
                              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between min-h-[32px] gap-2 sm:gap-3">
                                <h3 className="text-lg font-semibold text-white flex-1 min-w-0 truncate">
                                  {project.name}
                                </h3>
                                <Badge variant="default" className={`gap-2 ${meta.badge}`}>
                                  <TypeIcon className={`w-3.5 h-3.5 ${meta.accent}`} />
                                  {meta.label}
                                </Badge>
                              </div>
                              <p
                                className="text-sm text-[#BFBFBF] mt-4 line-clamp-3 min-h-[72px]"
                                style={{ maskImage: "linear-gradient(to bottom, black 70%, transparent 100%)" }}
                              >
                                {project.description}
                              </p>
                              <div className="flex flex-wrap gap-3 mt-6 mt-auto">
                                <Link href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                                  <Button variant="secondary" size="sm">
                                    <Github className="w-4 h-4" />
                                    Repositório
                                  </Button>
                                </Link>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                )}

                {activeSection === "certifications" && (
                  <div key="certifications" className="animate-fade-in-up">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8">
                      <div>
                        <Badge className="mb-3">Certificações</Badge>
                        <h2 className="text-h1 text-white">Formação e Certificações</h2>
                      </div>
                      <Award className="w-6 h-6 text-[#FF6803]" />
                    </div>
                    <div className="grid md:grid-cols-2 gap-3 sm:gap-4">
                      {certifications.map((cert) => (
                        <Card key={cert.name} className="p-6">
                          <div className="flex items-start gap-4">
                            <GraduationCap className="w-6 h-6 text-[#FF6803] flex-shrink-0" />
                            <div>
                              <h3 className="text-base font-semibold text-white">{cert.name}</h3>
                              <p className="text-sm text-[#BFBFBF]">{cert.institution}</p>
                              <p className="text-xs text-[#BFBFBF] mt-1">{cert.period}</p>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
