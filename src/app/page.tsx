import Link from "next/link";
import { 
  ArrowRight, 
  Play, 
  Code2, 
  Database, 
  Shield, 
  Zap, 
  Users, 
  CheckCircle2,
  Terminal,
  FileCode,
  RotateCcw
} from "lucide-react";
import { Header, Footer } from "@/components/layout";
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent, Badge } from "@/components/ui";

const features = [
  {
    icon: Code2,
    title: "Cenário de produção",
    description: "Fluxos completos com regras reais: cadastros, validações, erros, estados e comportamento complexo.",
  },
  {
    icon: Database,
    title: "Api real",
    description: "REST e GraphQL com validação de schema, paginação, auth, rate limit e respostas dinâmicas.",
  },
  {
    icon: RotateCcw,
    title: "Ambiente controlado",
    description: "Reset rápido, dados determinísticos e resultados previsíveis para automação confiável.",
  },
  {
    icon: Zap,
    title: "Edge case",
    description: "Timeouts, conteúdo instável, delays, listas infinitas e sincronização avançada.",
  },
  {
    icon: Shield,
    title: "Segurança e sessão",
    description: "JWT, refresh tokens, MFA, expiração e bloqueio por tentativas falhas.",
  },
  {
    icon: Terminal,
    title: "Multi-framework",
    description: "Pratique com Playwright, Cypress, Selenium, Robot Framework e sua stack favorita.",
  },
];

const scenarios = [
  { name: "Elementos Básicos", difficulty: "Iniciante", tests: 15 },
  { name: "Formulários Simples", difficulty: "Iniciante", tests: 12 },
  { name: "Navegação e Links", difficulty: "Iniciante", tests: 10 },
  { name: "Waits e Sincronização", difficulty: "Intermediário", tests: 18 },
  { name: "Tabelas Dinâmicas", difficulty: "Intermediário", tests: 20 },
  { name: "Formulários Complexos", difficulty: "Intermediário", tests: 16 },
  { name: "Drag & Drop Avançado", difficulty: "Avançado", tests: 15 },
  { name: "Iframes & Shadow DOM", difficulty: "Avançado", tests: 12 },
  { name: "Autenticação & Sessões", difficulty: "Avançado", tests: 18 },
  { name: "Fluxo de Pagamentos", difficulty: "Avançado", tests: 20 },
  { name: "Fluxo E2E Completo", difficulty: "Expert", tests: 30 },
  { name: "GraphQL & WebSockets", difficulty: "Expert", tests: 18 },
];

const stats = [
  { value: "23", label: "Seções no playground" },
  { value: "4", label: "Níveis de dificuldade" },
  { value: "200+", label: "Casos de teste" },
  { value: "100%", label: "Gratuito" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-radial">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-24 px-6 lg:px-8 overflow-hidden" data-testid="hero-section">
          {/* Background Glow */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[#FF6803]/20 rounded-full blur-[120px]" />
            <div className="absolute top-20 left-1/4 w-[400px] h-[400px] bg-[#AE3A02]/15 rounded-full blur-[100px]" />
          </div>

          <div className="relative mx-auto max-w-5xl text-center">
            {/* Badge */}
            <div className="animate-fade-in-up">
              <Badge variant="primary" dot className="mb-6" data-testid="hero-badge">
                Plataforma 100% Gratuita para QAs
              </Badge>
            </div>

            {/* Title */}
            <h1 
              className="text-display text-white mb-6 animate-fade-in-up animate-delay-100"
              data-testid="hero-title"
            >
              Desenvolva suas Skills
              <br />
              <span className="text-[#FF6803]">em Automação de Testes</span>
            </h1>

            {/* Subtitle */}
            <p 
              className="text-xl text-[#BFBFBF] max-w-2xl mx-auto mb-10 animate-fade-in-up animate-delay-200"
              data-testid="hero-subtitle"
            >
              Uma plataforma de desafios práticos para QAs evoluírem suas habilidades
              em automação. Do iniciante ao expert, no seu ritmo.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up animate-delay-300">
              <Link href="/playground">
                <Button size="lg" data-testid="cta-start">
                  <Play className="w-5 h-5" />
                  Começar Desafios
                </Button>
              </Link>
              <Link href="/scenarios">
                <Button variant="secondary" size="lg" data-testid="cta-docs">
                  <FileCode className="w-5 h-5" />
                  Ver Todos os Desafios
                </Button>
              </Link>
            </div>

            {/* Frameworks */}
            <div className="mt-16 animate-fade-in-up animate-delay-400">
              <p className="text-sm text-[#BFBFBF] mb-4">Pratique com qualquer framework</p>
              <div className="flex items-center justify-center gap-8 opacity-60">
                <span className="text-white font-medium">Playwright</span>
                <span className="text-white font-medium">Cypress</span>
                <span className="text-white font-medium">Selenium</span>
                <span className="text-white font-medium">Robot</span>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 px-6 lg:px-8 border-y border-white/8" data-testid="stats-section">
          <div className="mx-auto max-w-5xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={stat.label} className="text-center" data-testid={`stat-${index}`}>
                  <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
                  <div className="text-sm text-[#BFBFBF]">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 px-6 lg:px-8" data-testid="features-section">
          <div className="mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <Badge className="mb-4">O que você vai praticar</Badge>
              <h2 className="text-h1 text-white mb-4" data-testid="features-title">
                Habilidade essencial para QAs
              </h2>
              <p className="text-lg text-[#BFBFBF] max-w-2xl mx-auto">
                Desafios criados para desenvolver competências reais do mercado de trabalho.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <Card key={feature.title} variant="interactive" data-testid={`feature-card-${index}`}>
                  <CardHeader>
                    <div className="w-12 h-12 rounded-xl bg-[#FF6803]/10 border border-[#FF6803]/30 flex items-center justify-center mb-4">
                      <feature.icon className="w-6 h-6 text-[#FF6803]" />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Scenarios Section */}
        <section className="py-24 px-6 lg:px-8 bg-white/[0.02]" data-testid="scenarios-section">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
              <div>
                <Badge className="mb-4">Trilha de aprendizado</Badge>
                <h2 className="text-h1 text-white mb-4" data-testid="scenarios-title">
                  Desafios por nível de dificuldade
                </h2>
                <p className="text-lg text-[#BFBFBF] max-w-xl">
                  Trilha com desafios completos, incluindo segurança, APIs, performance e fluxos E2E.
                </p>
              </div>
              <div className="mt-6 md:mt-0 flex flex-col sm:flex-row gap-3">
                <Link href="/playground">
                  <Button data-testid="cta-playground">
                    Playground
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/scenarios">
                  <Button variant="secondary" data-testid="view-all-scenarios">
                    Trilha de desenvolvimento
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {scenarios.map((scenario, index) => (
                <Card
                  key={scenario.name}
                  variant="interactive"
                  className="h-full cursor-default"
                  data-testid={`scenario-card-${index}`}
                >
                  <CardContent className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">{scenario.name}</h3>
                      <p className="text-sm text-[#BFBFBF]">{scenario.tests} casos de teste</p>
                    </div>
                    <Badge
                      variant={
                        scenario.difficulty === "Iniciante" ? "success" :
                        scenario.difficulty === "Intermediário" ? "warning" :
                        scenario.difficulty === "Avançado" ? "error" : "primary"
                      }
                    >
                      {scenario.difficulty}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-6 lg:px-8" data-testid="cta-section">
          <div className="mx-auto max-w-4xl">
            <Card className="text-center p-12 relative overflow-hidden">
              {/* Background Glow */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#FF6803]/10 rounded-full blur-[80px]" />
              </div>

              <div className="relative">
                <Badge variant="primary" className="mb-6">Sua jornada começa aqui!</Badge>
                <h2 className="text-h1 text-white mb-4" data-testid="cta-title">
                  Pronto para evoluir como QA?
                </h2>
                <p className="text-lg text-[#BFBFBF] max-w-xl mx-auto mb-8">
                  Comece agora mesmo a praticar automação de testes. Escolha um desafio
                  do seu nível e desenvolva suas habilidades.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link href="/scenarios">
                    <Button size="lg" data-testid="cta-register">
                      Explorar Desafios
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                  </Link>
                  <Link href="/playground">
                    <Button variant="ghost" size="lg" data-testid="cta-pricing">
                      Ir para o Playground
                    </Button>
                  </Link>
                </div>

                <div className="flex items-center justify-center gap-6 mt-8 text-sm text-[#BFBFBF]">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    100% Gratuito
                  </span>
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    Sem cadastro obrigatório
                  </span>
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    Aprenda no seu ritmo
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
