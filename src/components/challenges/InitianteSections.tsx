"use client";

import { useState } from "react";
import { Button, Input, Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui";
import { ChevronDown } from "lucide-react";

// 1. ELEMENTOS BÁSICOS
export function ElementosBasicosSection() {
  const [clickCount, setClickCount] = useState(0);
  const [doubleClickCount, setDoubleClickCount] = useState(0);
  const [rightClickCount, setRightClickCount] = useState(0);
  const [textInput, setTextInput] = useState("");
  const [selectValue, setSelectValue] = useState("");
  const [selectOpen, setSelectOpen] = useState(false);
  const [rangeValue, setRangeValue] = useState(50);
  const [toggleValue, setToggleValue] = useState(false);
  const [checkboxes, setCheckboxes] = useState({ option1: false, option2: false, option3: false });
  const [radioValue, setRadioValue] = useState("");

  return (
    <div className="space-y-6" data-testid="section-elementos-basicos">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Botões */}
        <Card>
          <CardHeader>
            <CardTitle>Eventos de Clique</CardTitle>
            <CardDescription>Teste diferentes interações de clique</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => setClickCount((c) => c + 1)}
                data-testid="click-button"
              >
                Clique aqui ({clickCount})
              </Button>
              <Button
                variant="secondary"
                onDoubleClick={() => setDoubleClickCount((c) => c + 1)}
                data-testid="double-click-button"
              >
                Duplo clique ({doubleClickCount})
              </Button>
              <Button
                variant="ghost"
                onContextMenu={(e) => {
                  e.preventDefault();
                  setRightClickCount((c) => c + 1);
                }}
                data-testid="right-click-button"
              >
                Clique direito ({rightClickCount})
              </Button>
            </div>
            <Button
              variant="secondary"
              onClick={() => {
                setClickCount(0);
                setDoubleClickCount(0);
                setRightClickCount(0);
              }}
              data-testid="reset-clicks"
            >
              Resetar Tudo
            </Button>
          </CardContent>
        </Card>

        {/* Campo de texto */}
        <Card>
          <CardHeader>
            <CardTitle>Campo de Texto</CardTitle>
            <CardDescription>Entrada de texto com limite</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Input
                label="Campo de Texto"
                placeholder="Digite algo..."
                value={textInput}
                onChange={(e) => setTextInput(e.target.value.slice(0, 40))}
                maxLength={40}
                data-testid="text-input"
              />
              <div className="flex justify-between text-xs mt-1">
                <span className="text-[#BFBFBF]" data-testid="char-counter">
                  {textInput.length}/40 caracteres
                </span>
                {textInput.length >= 40 && (
                  <span className="text-[#FF6803]">Limite atingido</span>
                )}
              </div>
            </div>
            <div className="text-sm text-[#BFBFBF]" data-testid="text-output">
              Você digitou: {textInput || "(vazio)"}
            </div>
          </CardContent>
        </Card>

        {/* Select */}
        <Card className="relative z-30 overflow-visible">
          <CardHeader>
            <CardTitle>Seleção</CardTitle>
            <CardDescription>Dropdown customizado</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 overflow-visible">
            <div className="relative z-30">
              <label className="text-sm font-medium text-white block mb-2">Framework de Teste</label>
              <div className="relative">
                <button
                  onClick={() => setSelectOpen(!selectOpen)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white/5 border border-white/12 text-white hover:border-white/20 transition-colors"
                  data-testid="select-input"
                  aria-expanded={selectOpen}
                >
                  <span className={selectValue ? "text-white" : "text-[#BFBFBF]"}>
                    {selectValue || "Escolha uma opção"}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${selectOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {selectOpen && (
                  <div
                    className="absolute top-full left-0 right-0 mt-2 py-2 rounded-xl bg-[#1a1a1a] border border-white/12 shadow-xl z-[60] max-h-60 overflow-y-auto"
                    data-testid="select-menu"
                  >
                    {[
                      { value: "playwright", label: "Playwright" },
                      { value: "cypress", label: "Cypress" },
                      { value: "selenium", label: "Selenium" },
                      { value: "robot", label: "Robot Framework" }
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSelectValue(option.label);
                          setSelectOpen(false);
                        }}
                        className={`w-full px-4 py-2 text-left transition-colors ${
                          selectValue === option.label
                            ? "text-[#FF6803] bg-white/5"
                            : "text-[#BFBFBF] hover:text-white hover:bg-white/5"
                        }`}
                        data-testid={`select-option-${option.value}`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {selectValue && (
                <div className="text-xs text-[#FF6803] mt-1" data-testid="select-output">
                  Selecionado: {selectValue}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Range e Toggle */}
        <Card>
          <CardHeader>
            <CardTitle>Controles</CardTitle>
            <CardDescription>Slider e interruptor</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-white block mb-2">
                Intervalo: {rangeValue}
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={rangeValue}
                onChange={(e) => setRangeValue(Number(e.target.value))}
                className="w-full accent-[#FF6803]"
                data-testid="range-input"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-white">Interruptor</span>
              <button
                onClick={() => setToggleValue(!toggleValue)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  toggleValue ? "bg-[#FF6803]" : "bg-white/20"
                }`}
                data-testid="toggle-switch"
                role="switch"
                aria-checked={toggleValue}
              >
                <span
                  className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    toggleValue ? "translate-x-6" : ""
                  }`}
                />
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// 2. FORMULÁRIOS SIMPLES
export function FormulariosSimplesSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name) newErrors.name = "Nome é obrigatório";
    if (!formData.email) {
      newErrors.email = "Email é obrigatório";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }
    if (!formData.password) {
      newErrors.password = "Senha é obrigatória";
    } else if (formData.password.length < 8) {
      newErrors.password = "Senha deve ter no mínimo 8 caracteres";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Senhas não coincidem";
    }
    if (!formData.terms) {
      newErrors.terms = "Você deve aceitar os termos";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 3000);
    }
  };

  const handleClear = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: false
    });
    setErrors({});
    setSubmitSuccess(false);
  };

  return (
    <div className="space-y-6" data-testid="section-formularios-simples">
      <Card>
        <CardHeader>
          <CardTitle>Formulário de Cadastro</CardTitle>
          <CardDescription>Preencha todos os campos obrigatórios</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                label="Nome"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                data-testid="input-name"
              />
              {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
            </div>

            <div>
              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                data-testid="input-email"
              />
              {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
            </div>

            <div>
              <Input
                label="Senha"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                data-testid="input-password"
              />
              {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password}</p>}
            </div>

            <div>
              <Input
                label="Confirmar Senha"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                data-testid="input-confirm-password"
              />
              {errors.confirmPassword && <p className="text-xs text-red-400 mt-1">{errors.confirmPassword}</p>}
            </div>

            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.terms}
                  onChange={(e) => setFormData({ ...formData, terms: e.target.checked })}
                  className="w-4 h-4 rounded border-white/20 bg-white/5 text-[#FF6803] focus:ring-[#FF6803]/50"
                  data-testid="checkbox-terms"
                />
                <span className="text-sm text-[#BFBFBF]">Aceito os termos e condições</span>
              </label>
              {errors.terms && <p className="text-xs text-red-400 mt-1">{errors.terms}</p>}
            </div>

            {submitSuccess && (
              <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm" data-testid="success-message">
                Formulário enviado com sucesso!
              </div>
            )}

            <div className="flex gap-3">
              <Button type="submit" data-testid="submit-button">
                Enviar
              </Button>
              <Button type="button" variant="secondary" onClick={handleClear} data-testid="clear-button">
                Limpar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

// 3. NAVEGAÇÃO E LINKS
export function NavegacaoLinksSection() {
  const [history, setHistory] = useState<string[]>(["Página Inicial"]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const navigate = (page: string) => {
    const newHistory = [...history.slice(0, currentIndex + 1), page];
    setHistory(newHistory);
    setCurrentIndex(newHistory.length - 1);
  };

  const goBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const goForward = () => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  return (
    <div className="space-y-6" data-testid="section-navegacao-links">
      <Card>
        <CardHeader>
          <CardTitle>Navegação entre Páginas</CardTitle>
          <CardDescription>Simule navegação com histórico</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-xl bg-white/5 border border-white/12">
            <p className="text-sm text-[#BFBFBF] mb-2">Página atual:</p>
            <p className="text-lg text-white font-semibold" data-testid="current-page">
              {history[currentIndex]}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button onClick={() => navigate("Sobre")} data-testid="link-about">
              Ir para Sobre
            </Button>
            <Button onClick={() => navigate("Contato")} data-testid="link-contact">
              Ir para Contato
            </Button>
            <Button onClick={() => navigate("Produtos")} data-testid="link-products">
              Ir para Produtos
            </Button>
            <Button 
              onClick={() => window.open("https://github.com/qamichaelmaia", "_blank")} 
              variant="secondary"
              data-testid="link-external"
            >
              Link Externo ↗
            </Button>
          </div>

          <div className="flex gap-2 pt-4 border-t border-white/12">
            <Button 
              onClick={goBack} 
              disabled={currentIndex === 0}
              variant="secondary"
              data-testid="button-back"
            >
              ← Voltar
            </Button>
            <Button 
              onClick={goForward} 
              disabled={currentIndex === history.length - 1}
              variant="secondary"
              data-testid="button-forward"
            >
              Avançar →
            </Button>
          </div>

          <div className="text-xs text-[#BFBFBF]" data-testid="history-count">
            Histórico: {history.length} página(s)
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// 4. ALERTAS E MODAIS
export function AlertasModaisSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const showAlert = () => {
    alert("Este é um alerta simples!");
  };

  const showConfirm = () => {
    const result = confirm("Você confirma esta ação?");
    setToastMessage(result ? "Confirmado!" : "Cancelado");
    setTimeout(() => setToastMessage(""), 3000);
  };

  const showPrompt = () => {
    const result = prompt("Digite seu nome:");
    if (result) {
      setToastMessage(`Olá, ${result}!`);
      setTimeout(() => setToastMessage(""), 3000);
    }
  };

  return (
    <div className="space-y-6" data-testid="section-alertas-modais">
      {toastMessage && (
        <div 
          className="p-4 rounded-xl bg-[#FF6803]/10 border border-[#FF6803]/30 text-[#FF6803]"
          data-testid="toast-message"
        >
          {toastMessage}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Alertas e Diálogos</CardTitle>
          <CardDescription>Teste diferentes tipos de alertas</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-3">
            <Button onClick={showAlert} data-testid="button-alert">
              Mostrar Alert
            </Button>
            <Button onClick={showConfirm} variant="secondary" data-testid="button-confirm">
              Mostrar Confirm
            </Button>
            <Button onClick={showPrompt} variant="secondary" data-testid="button-prompt">
              Mostrar Prompt
            </Button>
            <Button onClick={() => setIsModalOpen(true)} data-testid="button-modal">
              Abrir Modal
            </Button>
          </div>

          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4" data-testid="custom-modal">
              <div 
                className="absolute inset-0 bg-black/60" 
                onClick={() => setIsModalOpen(false)}
                data-testid="modal-overlay"
              />
              <div className="relative bg-[#1a1a1a] border border-white/12 rounded-xl p-6 max-w-md w-full">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-4 right-4 text-[#BFBFBF] hover:text-white"
                  data-testid="modal-close-x"
                >
                  ✕
                </button>
                <h3 className="text-xl font-semibold text-white mb-4">Modal Customizado</h3>
                <p className="text-[#BFBFBF] mb-4">
                  Este é um modal personalizado com overlay e botão de fechar.
                </p>
                <Button onClick={() => setIsModalOpen(false)} data-testid="modal-close-button">
                  Fechar
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// 5. CHECKBOXES & RADIOS
export function CheckboxesRadiosSection() {
  const [checkboxes, setCheckboxes] = useState({
    option1: false,
    option2: false,
    option3: false
  });
  const [allChecked, setAllChecked] = useState(false);
  const [radioValue, setRadioValue] = useState("");

  const handleSelectAll = () => {
    const newValue = !allChecked;
    setAllChecked(newValue);
    setCheckboxes({
      option1: newValue,
      option2: newValue,
      option3: newValue
    });
  };

  return (
    <div className="space-y-6" data-testid="section-checkboxes-radios">
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Checkboxes</CardTitle>
            <CardDescription>Seleção múltipla</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="flex items-center gap-2 cursor-pointer mb-3">
                <input
                  type="checkbox"
                  checked={allChecked}
                  onChange={handleSelectAll}
                  className="w-4 h-4 rounded border-white/20 bg-white/5 text-[#FF6803]"
                  data-testid="checkbox-select-all"
                />
                <span className="text-white font-medium">Selecionar Todas</span>
              </label>
            </div>
            <div className="space-y-2">
              {["option1", "option2", "option3"].map((opt) => (
                <label key={opt} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checkboxes[opt as keyof typeof checkboxes]}
                    onChange={(e) =>
                      setCheckboxes({ ...checkboxes, [opt]: e.target.checked })
                    }
                    className="w-4 h-4 rounded border-white/20 bg-white/5 text-[#FF6803]"
                    data-testid={`checkbox-${opt}`}
                  />
                  <span className="text-[#BFBFBF]">{opt}</span>
                </label>
              ))}
            </div>
            <div className="text-sm text-[#BFBFBF]" data-testid="checkbox-count">
              Selecionados: {Object.values(checkboxes).filter(Boolean).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Radio Buttons</CardTitle>
            <CardDescription>Seleção única</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {["radio1", "radio2", "radio3"].map((radio) => (
              <label key={radio} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="radioGroup"
                  value={radio}
                  checked={radioValue === radio}
                  onChange={(e) => setRadioValue(e.target.value)}
                  className="w-4 h-4 border-white/20 bg-white/5 text-[#FF6803]"
                  data-testid={`radio-${radio}`}
                />
                <span className="text-[#BFBFBF]">{radio}</span>
              </label>
            ))}
            {radioValue && (
              <div className="text-sm text-[#FF6803] mt-4" data-testid="radio-output">
                Selecionado: {radioValue}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
