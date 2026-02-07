import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, ListChecks } from "lucide-react";
import { Header, Footer } from "@/components/layout";
import { Badge, Button, Card, CardContent } from "@/components/ui";
import { scenarios } from "@/data/scenarios";

export function generateStaticParams() {
  return scenarios.map((scenario) => ({ id: scenario.id }));
}

type ScenarioDetailPageProps = {
  params: { id: string };
};

export default function ScenarioDetailPage({ params }: ScenarioDetailPageProps) {
  const scenario = scenarios.find((item) => item.id === params.id);

  if (!scenario) {
    notFound();
  }

  const ScenarioIcon = scenario.icon;

  return (
    <div className="min-h-screen bg-gradient-radial">
      <Header />

      <main className="pt-24 pb-16 px-6 lg:px-8" data-testid="scenario-detail-page">
        <div className="mx-auto max-w-6xl">
          <Link
            href="/scenarios"
            className="inline-flex items-center gap-2 text-sm text-[#BFBFBF] hover:text-white transition-colors"
            data-testid="back-to-scenarios"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para desafios
          </Link>

          <div className="mt-6 mb-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-[#FF6803]/10 border border-[#FF6803]/30 flex items-center justify-center">
                <ScenarioIcon className="w-7 h-7 text-[#FF6803]" />
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

            <h1 className="text-h1 text-white mb-4" data-testid="scenario-title">
              {scenario.title}
            </h1>
            <p className="text-lg text-[#BFBFBF] max-w-3xl" data-testid="scenario-description">
              {scenario.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-sm text-[#BFBFBF] mt-4">
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {scenario.estimatedTime}
              </span>
              <span>{scenario.testCases.length} casos de teste</span>
            </div>

            <div className="flex flex-wrap gap-2 mt-4" data-testid="scenario-skills">
              {scenario.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-2 py-1 text-xs rounded-md bg-white/5 text-[#BFBFBF]"
                >
                  {skill}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 mt-6">
              <Link href="/playground" data-testid="open-playground">
                <Button>Ir para o Playground</Button>
              </Link>
              <Link href="/scenarios" data-testid="view-all-scenarios">
                <Button variant="secondary">Ver todos os desafios</Button>
              </Link>
            </div>
          </div>

          <Card data-testid="scenario-testcases">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <ListChecks className="w-5 h-5 text-[#FF6803]" />
                <h2 className="text-xl font-semibold text-white">Casos de teste</h2>
              </div>
              <ol className="space-y-3 list-decimal list-inside text-[#BFBFBF]">
                {scenario.testCases.map((testCase) => (
                  <li key={testCase.id} data-testid={`testcase-${testCase.id}`}>
                    <span className="text-white">{testCase.title}</span>
                    <span className="ml-2 text-xs text-[#BFBFBF]">({testCase.id})</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
