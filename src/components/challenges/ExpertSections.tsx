"use client";

import { useState, useEffect } from "react";
import { Button, Input, Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui";
import { Zap, TrendingUp, Eye, Globe2, Code, Database } from "lucide-react";

// 18. CONTEÚDO DINÂMICO E SHADOW DOM
export function ConteudoDinamicoSection() {
  const [shadowText, setShadowText] = useState("");
  const [dynamicContent, setDynamicContent] = useState<string[]>([]);
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCounter((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const addDynamicContent = () => {
    setDynamicContent([...dynamicContent, `Item ${dynamicContent.length + 1} - ${new Date().toLocaleTimeString()}`]);
  };

  return (
    <div className="space-y-6" data-testid="section-conteudo-dinamico">
      <Card>
        <CardHeader>
          <CardTitle>Conteúdo Gerado Dinamicamente</CardTitle>
          <CardDescription>Shadow DOM e elementos dinâmicos</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-xl bg-white/5 border border-white/12">
            <p className="text-sm text-[#BFBFBF] mb-2">Contador em tempo real:</p>
            <div className="text-2xl font-bold text-[#FF6803]" data-testid="live-counter">
              {counter}s
            </div>
          </div>

          <div>
            <Button onClick={addDynamicContent} data-testid="add-content">
              Adicionar Conteúdo Dinâmico
            </Button>
          </div>

          <div className="space-y-2" data-testid="dynamic-list">
            {dynamicContent.map((content, index) => (
              <div
                key={index}
                className="p-3 rounded-lg bg-white/5 border border-white/10 animate-fadeIn"
                data-testid={`dynamic-item-${index}`}
              >
                {content}
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-white/10">
            <label className="text-sm font-medium text-white block mb-2">Shadow DOM Input</label>
            <div id="shadow-host" className="shadow-root-container">
              <input
                type="text"
                value={shadowText}
                onChange={(e) => setShadowText(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/12 text-white placeholder:text-[#BFBFBF] focus:border-[#FF6803] focus:outline-none"
                placeholder="Digite no Shadow DOM..."
                data-testid="shadow-input"
              />
            </div>
            {shadowText && (
              <div className="mt-2 text-sm text-[#FF6803]" data-testid="shadow-output">
                Shadow text: {shadowText}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// 19. TESTES E2E COMPLETOS
export function TestesE2ESection() {
  const [workflow, setWorkflow] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({ name: "", email: "", terms: false });

  const startWorkflow = () => {
    setWorkflow([]);
    setCurrentStep(0);
    addStep("Workflow iniciado");
  };

  const addStep = (step: string) => {
    setWorkflow((prev) => [...prev, step]);
    setCurrentStep((prev) => prev + 1);
  };

  const completeWorkflow = () => {
    if (formData.name && formData.email && formData.terms) {
      addStep("Formulário preenchido");
      addStep("Termos aceitos");
      addStep("Workflow concluído com sucesso!");
    } else {
      addStep("Erro: Preencha todos os campos");
    }
  };

  return (
    <div className="space-y-6" data-testid="section-e2e">
      <Card>
        <CardHeader>
          <CardTitle>Workflow E2E</CardTitle>
          <CardDescription>Teste de fluxo completo</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={startWorkflow} data-testid="start-workflow">
            Iniciar Workflow
          </Button>

          {workflow.length > 0 && (
            <div className="space-y-3 p-4 rounded-xl bg-white/5 border border-white/12">
              {workflow.map((step, index) => (
                <div key={index} className="flex items-center gap-2" data-testid={`workflow-step-${index}`}>
                  <div className="w-6 h-6 rounded-full bg-[#FF6803]/20 border border-[#FF6803] flex items-center justify-center text-xs text-[#FF6803]">
                    {index + 1}
                  </div>
                  <span className="text-white">{step}</span>
                </div>
              ))}
            </div>
          )}

          {workflow.length > 0 && currentStep > 0 && currentStep < 3 && (
            <div className="space-y-3">
              <Input
                label="Nome Completo"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                data-testid="e2e-name"
              />
              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                data-testid="e2e-email"
              />
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.terms}
                  onChange={(e) => setFormData({ ...formData, terms: e.target.checked })}
                  className="w-4 h-4 rounded border-white/20 bg-white/5 text-[#FF6803]"
                  data-testid="e2e-terms"
                />
                <span className="text-sm text-white">Aceito os termos e condições</span>
              </label>
              <Button onClick={completeWorkflow} data-testid="complete-workflow">
                Finalizar Workflow
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// 20. TESTES DE PERFORMANCE
export function TestesPerformanceSection() {
  const [loadTime, setLoadTime] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [memoryUsage, setMemoryUsage] = useState<string>("");

  const measurePerformance = async () => {
    setIsLoading(true);
    const start = performance.now();
    
    // Simula operação pesada
    await new Promise((resolve) => setTimeout(resolve, 1500));
    for (let i = 0; i < 1000000; i++) {
      Math.sqrt(i);
    }
    
    const end = performance.now();
    setLoadTime(Math.round(end - start));
    
    // @ts-ignore - performance.memory pode não existir em todos browsers
    if (performance.memory) {
      // @ts-ignore
      const used = Math.round(performance.memory.usedJSHeapSize / 1048576);
      setMemoryUsage(`${used} MB`);
    }
    
    setIsLoading(false);
  };

  return (
    <div className="space-y-6" data-testid="section-performance">
      <Card>
        <CardHeader>
          <CardTitle>
            <TrendingUp className="w-5 h-5 inline mr-2" />
            Métricas de Performance
          </CardTitle>
          <CardDescription>Medição de tempo e recursos</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={measurePerformance} isLoading={isLoading} data-testid="measure-performance">
            <Zap className="w-4 h-4 mr-2" />
            Medir Performance
          </Button>

          {loadTime !== null && (
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-white/5 border border-white/12" data-testid="load-time">
                <p className="text-sm text-[#BFBFBF] mb-1">Tempo de Execução</p>
                <p className="text-2xl font-bold text-[#FF6803]">{loadTime}ms</p>
              </div>
              {memoryUsage && (
                <div className="p-4 rounded-xl bg-white/5 border border-white/12" data-testid="memory-usage">
                  <p className="text-sm text-[#BFBFBF] mb-1">Uso de Memória</p>
                  <p className="text-2xl font-bold text-[#FF6803]">{memoryUsage}</p>
                </div>
              )}
            </div>
          )}

          <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30">
            <p className="text-sm text-blue-400">
              <strong>Dica:</strong> Use ferramentas como Lighthouse para métricas detalhadas de performance.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// 21. TESTES DE ACESSIBILIDADE
export function TestesAcessibilidadeSection() {
  const [focusedElement, setFocusedElement] = useState("");
  const [ariaLiveMessage, setAriaLiveMessage] = useState("");

  const announceMessage = (message: string) => {
    setAriaLiveMessage(message);
    setTimeout(() => setAriaLiveMessage(""), 3000);
  };

  return (
    <div className="space-y-6" data-testid="section-acessibilidade">
      <Card>
        <CardHeader>
          <CardTitle>
            <Eye className="w-5 h-5 inline mr-2" />
            Testes de Acessibilidade
          </CardTitle>
          <CardDescription>ARIA, navegação por teclado e foco</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* ARIA Live Region */}
          <div
            role="status"
            aria-live="polite"
            aria-atomic="true"
            className="sr-only"
            data-testid="aria-live-region"
          >
            {ariaLiveMessage}
          </div>

          <div className="space-y-3">
            <Button
              onClick={() => announceMessage("Botão 1 foi clicado")}
              aria-label="Primeiro botão de teste"
              data-testid="aria-button-1"
              onFocus={() => setFocusedElement("Botão 1")}
            >
              Botão com ARIA Label
            </Button>

            <input
              type="text"
              placeholder="Input acessível"
              aria-label="Campo de entrada acessível"
              aria-describedby="input-help"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/12 text-white placeholder:text-[#BFBFBF] focus:border-[#FF6803] focus:outline-none focus:ring-2 focus:ring-[#FF6803]/50"
              data-testid="accessible-input"
              onFocus={() => setFocusedElement("Input")}
            />
            <p id="input-help" className="text-xs text-[#BFBFBF]">
              Este campo possui descrição ARIA
            </p>

            <select
              aria-label="Seleção acessível"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/12 text-white focus:border-[#FF6803] focus:outline-none"
              data-testid="accessible-select"
              onFocus={() => setFocusedElement("Select")}
            >
              <option>Opção 1</option>
              <option>Opção 2</option>
              <option>Opção 3</option>
            </select>

            <div
              tabIndex={0}
              role="button"
              aria-pressed="false"
              className="p-3 rounded-xl bg-white/5 border border-white/12 cursor-pointer hover:bg-white/10 focus:border-[#FF6803] focus:outline-none focus:ring-2 focus:ring-[#FF6803]/50"
              data-testid="focusable-div"
              onFocus={() => setFocusedElement("Div Focável")}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  announceMessage("Div focável foi ativada");
                }
              }}
            >
              Div Focável (pressione Enter/Espaço)
            </div>
          </div>

          {focusedElement && (
            <div className="p-3 rounded-xl bg-[#FF6803]/10 border border-[#FF6803]/30 text-[#FF6803]" data-testid="focus-indicator">
              Elemento em foco: {focusedElement}
            </div>
          )}

          {ariaLiveMessage && (
            <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400" data-testid="live-message">
              {ariaLiveMessage}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// 22. TESTES DE INTERNACIONALIZAÇÃO
export function TestesInternacionalizacaoSection() {
  const [locale, setLocale] = useState("pt-BR");
  const [currency, setCurrency] = useState(1234.56);

  const translations: Record<string, any> = {
    "pt-BR": {
      title: "Bem-vindo",
      description: "Este é um teste de internacionalização",
      button: "Alternar Idioma",
    },
    "en-US": {
      title: "Welcome",
      description: "This is an internationalization test",
      button: "Toggle Language",
    },
    "es-ES": {
      title: "Bienvenido",
      description: "Esta es una prueba de internacionalización",
      button: "Cambiar Idioma",
    },
  };

  const formatCurrency = (value: number, locale: string) => {
    const currencyCode = locale === "pt-BR" ? "BRL" : locale === "en-US" ? "USD" : "EUR";
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currencyCode,
    }).format(value);
  };

  const formatDate = (locale: string) => {
    return new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date());
  };

  const toggleLocale = () => {
    const locales = ["pt-BR", "en-US", "es-ES"];
    const currentIndex = locales.indexOf(locale);
    const nextIndex = (currentIndex + 1) % locales.length;
    setLocale(locales[nextIndex]);
  };

  return (
    <div className="space-y-6" data-testid="section-i18n">
      <Card>
        <CardHeader>
          <CardTitle>
            <Globe2 className="w-5 h-5 inline mr-2" />
            Internacionalização (i18n)
          </CardTitle>
          <CardDescription>Suporte multi-idioma e formatação</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-white" data-testid="i18n-title">
                {translations[locale].title}
              </h3>
              <p className="text-sm text-[#BFBFBF]" data-testid="i18n-description">
                {translations[locale].description}
              </p>
            </div>
            <div className="px-3 py-1 rounded-lg bg-[#FF6803]/20 text-[#FF6803] text-sm font-medium" data-testid="current-locale">
              {locale}
            </div>
          </div>

          <div className="space-y-3 p-4 rounded-xl bg-white/5 border border-white/12">
            <div className="flex justify-between">
              <span className="text-[#BFBFBF]">Moeda formatada:</span>
              <span className="text-white font-medium" data-testid="formatted-currency">
                {formatCurrency(currency, locale)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#BFBFBF]">Data formatada:</span>
              <span className="text-white font-medium" data-testid="formatted-date">
                {formatDate(locale)}
              </span>
            </div>
          </div>

          <Button onClick={toggleLocale} data-testid="toggle-locale">
            {translations[locale].button}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// 23. INTEGRAÇÃO COM GRAPHQL
export function IntegracaoGraphQLSection() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const exampleQuery = `{
  user(id: 1) {
    name
    email
    posts {
      title
    }
  }
}`;

  const mockGraphQLData = {
    data: {
      user: {
        name: "João Silva",
        email: "joao@exemplo.com",
        posts: [
          { title: "Introdução ao GraphQL" },
          { title: "Testando APIs GraphQL" },
          { title: "Automação com Playwright" },
        ],
      },
    },
  };

  const executeQuery = () => {
    setIsLoading(true);
    setResult(null);
    setTimeout(() => {
      setResult(mockGraphQLData);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="space-y-6" data-testid="section-graphql">
      <Card>
        <CardHeader>
          <CardTitle>
            <Database className="w-5 h-5 inline mr-2" />
            GraphQL API
          </CardTitle>
          <CardDescription>Consultas e mutações GraphQL</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-white block mb-2">Query GraphQL</label>
            <textarea
              value={query || exampleQuery}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full h-32 px-4 py-3 rounded-xl bg-white/5 border border-white/12 text-white font-mono text-sm placeholder:text-[#BFBFBF] focus:border-[#FF6803] focus:outline-none resize-none"
              data-testid="graphql-query"
            />
          </div>

          <Button onClick={executeQuery} isLoading={isLoading} data-testid="execute-query">
            <Code className="w-4 h-4 mr-2" />
            Executar Query
          </Button>

          {result && (
            <div className="p-4 rounded-xl bg-white/5 border border-white/12" data-testid="graphql-response">
              <p className="text-sm font-medium text-white mb-2">Resposta:</p>
              <pre className="text-xs text-[#BFBFBF] overflow-x-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
