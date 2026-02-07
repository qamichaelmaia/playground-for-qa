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
    title: "Cenários Realistas",
    description: "Desafios baseados em situações reais do dia a dia de um QA: formulários, tabelas, modais e mais.",
  },
  {
    icon: Database,
    title: "Testes de API",
    description: "API REST completa para praticar automação de backend com validações, status codes e payloads.",
  },
  {
    icon: RotateCcw,
    title: "Ambiente Controlado",
    description: "Reset de dados a qualquer momento. Sempre comece com um estado limpo e previsível.",
  },
  {
    icon: Zap,
    title: "Edge Cases",
    description: "Respostas lentas, elementos instáveis e conteúdo dinâmico para testar sua resiliência.",
  },
  {
    icon: Shield,
    title: "Fluxos de Autenticação",
    description: "Login, cadastro, recuperação de senha, MFA e sessões expiradas para automatizar.",
  },
  {
    icon: Terminal,
    title: "Multi-Framework",
    description: "Pratique com Playwright, Cypress, Selenium, Robot Framework ou sua ferramenta favorita.",
  },
];

const scenarios = [
  { name: "Elementos Básicos", difficulty: "Iniciante", tests: 15 },
  { name: "Formulários", difficulty: "Iniciante", tests: 12 },
  { name: "Navegação e Links", difficulty: "Iniciante", tests: 8 },
  { name: "Waits e Sincronização", difficulty: "Intermediário", tests: 18 },
  { name: "Tabelas Dinâmicas", difficulty: "Intermediário", tests: 20 },
  { name: "Upload de Arquivos", difficulty: "Intermediário", tests: 10 },
  { name: "Drag & Drop", difficulty: "Avançado", tests: 12 },
  { name: "Iframes e Shadow DOM", difficulty: "Avançado", tests: 15 },
  { name: "Testes de API REST", difficulty: "Avançado", tests: 25 },
  { name: "Fluxo E2E Completo", difficulty: "Expert", tests: 30 },
  { name: "Performance & Stress", difficulty: "Expert", tests: 8 },
  { name: "Acessibilidade (A11y)", difficulty: "Expert", tests: 20 },
];

const stats = [
  { value: "50+", label: "Desafios Práticos" },
  { value: "4", label: "Níveis de Dificuldade" },
  { value: "200+", label: "Casos de Teste" },
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
              <Badge className="mb-4">O Que Você Vai Praticar</Badge>
              <h2 className="text-h1 text-white mb-4" data-testid="features-title">
                Habilidades Essenciais para QAs
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
                <Badge className="mb-4">Trilha de Aprendizado</Badge>
                <h2 className="text-h1 text-white mb-4" data-testid="scenarios-title">
                  Desafios por Nível de Dificuldade
                </h2>
                <p className="text-lg text-[#BFBFBF] max-w-xl">
                  Evolua do básico ao avançado. Cada desafio fortalece uma habilidade específica.
                </p>
              </div>
              <Link href="/scenarios" className="mt-6 md:mt-0">
                <Button variant="secondary" data-testid="view-all-scenarios">
                  Ver Todos os Cenários
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {scenarios.map((scenario, index) => (
                <Link href={`/scenarios/${scenario.name.toLowerCase().replace(/\s+/g, "-")}`} key={scenario.name}>
                  <Card variant="interactive" className="h-full" data-testid={`scenario-card-${index}`}>
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
                </Link>
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
                <Badge variant="primary" className="mb-6">Sua Jornada Começa Aqui</Badge>
                <h2 className="text-h1 text-white mb-4" data-testid="cta-title">
                  Pronto para Evoluir como QA?
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
