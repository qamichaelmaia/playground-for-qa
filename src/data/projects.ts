export type ProjectType = "API" | "Mobile" | "Web" | "Performance" | "Documentacao";

export type Project = {
  name: string;
  description: string;
  type: ProjectType;
  githubUrl: string;
  imageUrl?: string;
};

// Add new projects at the top to keep newest first.
// Order: most recent -> oldest (top -> bottom).
export const projects: Project[] = [
  {
    name: "API Test Automation",
    description:
      "Atualmente, estão incluídos testes para as APIs do OpenWeather e SpaceX, cobrindo funcionalidades essenciais como previsão do tempo e informações sobre lançamentos espaciais.",
    type: "API",
    githubUrl: "https://github.com/qamichaelmaia/api-test-automation",
    imageUrl: "/images/projects/API%20Test%20Automation.png",
  },
  {
    name: "Automação Mobile com Appium",
    description:
      "Automação de testes de uma aplicação mobile, cobrindo o fluxo completo de login, seleção de produto e finalização de compra. O ambiente utiliza WebdriverIO, Appium, Allure Report e Android Studio.",
    type: "Mobile",
    githubUrl: "https://github.com/qamichaelmaia/application-mobile-test",
    imageUrl: "/images/projects/App%20EbacShop.png",
  },
  {
    name: "Automação Web com Cypress",
    description:
      "Automação Web para a plataforma Automation Exercise, desenvolvido utilizando o Cypress com a arquitetura Page Objects. A automação inclui funcionalidades como login, cadastro de cliente, e fluxo completo de compra.",
    type: "Web",
    githubUrl: "https://github.com/qamichaelmaia/cypress-automationexercise",
    imageUrl: "/images/projects/Automation%20Exercise.png",
  },
];
