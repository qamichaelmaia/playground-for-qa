"use client";

import { useState, useEffect, useRef } from "react";
import { Button, Input, Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui";
import { Upload, CheckCircle2, AlertCircle, X, Search, Filter, GripVertical, Clock, Calendar, ChevronDown, ToggleLeft } from "lucide-react";

type SectionCompletionProps = {
  onComplete?: () => void;
  isComplete?: boolean;
};

// 6. WAITS E SINCRONIZAÇÃO
export function WaitsSincronizacaoSection({ onComplete, isComplete }: SectionCompletionProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [loadedData, setLoadedData] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(5);
  const [isCountdownActive, setIsCountdownActive] = useState(false);
  const [dynamicText, setDynamicText] = useState("Texto inicial");
  const [isVisible, setIsVisible] = useState(true);
  const [hasHidden, setHasHidden] = useState(false);
  const reportedRef = useRef(false);

  const handleSlowLoad = async () => {
    setIsLoading(true);
    setLoadedData(null);
    await new Promise((resolve) => setTimeout(resolve, 3000));
    setLoadedData("Dados carregados após 3 segundos!");
    setIsLoading(false);
  };

  const startCountdown = () => {
    setCountdown(5);
    setIsCountdownActive(true);
    setDynamicText("Contando...");
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setDynamicText("Contagem finalizada!");
          setIsCountdownActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const isDone = Boolean(loadedData) && countdown === 0 && hasHidden;

  useEffect(() => {
    if (isComplete) {
      reportedRef.current = true;
    }
  }, [isComplete]);

  useEffect(() => {
    if (!reportedRef.current && isDone) {
      reportedRef.current = true;
      onComplete?.();
    }
  }, [isDone, onComplete]);

  return (
    <div className="space-y-6" data-testid="section-waits-sincronizacao">
      <Card>
        <CardHeader>
          <CardTitle>Conteúdo Dinâmico</CardTitle>
          <CardDescription>Conteúdo que muda ao longo do tempo</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div
            className="p-4 rounded-xl bg-white/5 text-white"
            data-testid="dynamic-text"
          >
            {dynamicText}
            {isCountdownActive && (
              <span className="ml-2 text-[#FF6803]">({countdown})</span>
            )}
          </div>
          <div className="flex gap-3">
            <Button onClick={startCountdown} data-testid="start-countdown">
              Iniciar Contagem
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setIsVisible((prev) => {
                  const next = !prev;
                  if (!next) {
                    setHasHidden(true);
                  }
                  return next;
                });
              }}
              data-testid="toggle-visibility"
            >
              Alternar Elemento
            </Button>
          </div>
          {isVisible && (
            <div
              className="p-4 rounded-xl bg-[#FF6803]/10 border border-[#FF6803]/30 text-[#FF6803]"
              data-testid="toggleable-element"
            >
              Eu posso ser ocultado!
            </div>
          )}
          <div className="pt-4 border-t border-white/10">
            <Button
              onClick={handleSlowLoad}
              isLoading={isLoading}
              data-testid="slow-load-button"
            >
              Carregar Dados (3s)
            </Button>
            {loadedData && (
              <div
                className="mt-4 p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400"
                data-testid="loaded-data"
              >
                {loadedData}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// 7. TABELAS DINÂMICAS
export function TabelasDinamicasSection({ onComplete, isComplete }: SectionCompletionProps) {
  const sampleUsers = [
    { id: 1, name: "João Silva", email: "joao@exemplo.com", role: "Admin", status: "Ativo" },
    { id: 2, name: "Maria Santos", email: "maria@exemplo.com", role: "Editor", status: "Ativo" },
    { id: 3, name: "Pedro Oliveira", email: "pedro@exemplo.com", role: "Visualizador", status: "Inativo" },
    { id: 4, name: "Ana Costa", email: "ana@exemplo.com", role: "Editor", status: "Ativo" },
    { id: 5, name: "Carlos Ferreira", email: "carlos@exemplo.com", role: "Visualizador", status: "Pendente" },
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [hasSearched, setHasSearched] = useState(false);
  const [hasSorted, setHasSorted] = useState(false);
  const [hasSelected, setHasSelected] = useState(false);
  const [toast, setToast] = useState<{ show: boolean; type: "success" | "error"; message: string }>({
    show: false,
    type: "success",
    message: "",
  });
  const reportedRef = useRef(false);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ show: true, type, message });
    setTimeout(() => setToast({ ...toast, show: false }), 3000);
  };

  const filteredUsers = sampleUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (!sortColumn) return 0;
    const aVal = a[sortColumn as keyof typeof a];
    const bVal = b[sortColumn as keyof typeof b];
    if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
    if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const handleSort = (column: string) => {
    setHasSorted(true);
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const isDone = hasSearched && hasSorted && hasSelected;

  useEffect(() => {
    if (isComplete) {
      reportedRef.current = true;
    }
  }, [isComplete]);

  useEffect(() => {
    if (!reportedRef.current && isDone) {
      reportedRef.current = true;
      onComplete?.();
    }
  }, [isDone, onComplete]);

  return (
    <div className="space-y-6" data-testid="section-tabelas-dinamicas">
      {toast.show && (
        <div
          className={`p-4 rounded-xl border ${
            toast.type === "success"
              ? "bg-green-500/10 border-green-500/30 text-green-400"
              : "bg-red-500/10 border-red-500/30 text-red-400"
          }`}
          data-testid="table-toast"
        >
          {toast.message}
        </div>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Tabela de Dados</CardTitle>
              <CardDescription>Tabela ordenável, pesquisável e selecionável</CardDescription>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#BFBFBF]" />
              <input
                type="text"
                placeholder="Buscar usuários..."
                value={searchTerm}
                onChange={(e) => {
                  const nextValue = e.target.value;
                  setSearchTerm(nextValue);
                  if (nextValue.trim().length > 0) {
                    setHasSearched(true);
                  }
                }}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/12 text-white placeholder:text-[#BFBFBF] focus:border-[#FF6803] focus:outline-none"
                data-testid="table-search"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full" data-testid="users-table">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="p-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedRows.length === sortedUsers.length && sortedUsers.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedRows(sortedUsers.map((u) => u.id));
                          setHasSelected(true);
                        } else {
                          setSelectedRows([]);
                        }
                      }}
                      className="w-4 h-4 rounded border-white/20 bg-white/5 text-[#FF6803]"
                      data-testid="select-all"
                    />
                  </th>
                  {["name", "email", "role", "status"].map((col) => (
                    <th
                      key={col}
                      onClick={() => handleSort(col)}
                      className="p-3 text-left text-sm font-medium text-[#BFBFBF] cursor-pointer hover:text-white transition-colors"
                      data-testid={`sort-${col}`}
                    >
                      {col.charAt(0).toUpperCase() + col.slice(1)}
                      {sortColumn === col && (
                        <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>
                      )}
                    </th>
                  ))}
                  <th className="p-3 text-left text-sm font-medium text-[#BFBFBF]">Ações</th>
                </tr>
              </thead>
              <tbody>
                {sortedUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    data-testid={`row-${user.id}`}
                  >
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(user.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedRows([...selectedRows, user.id]);
                            setHasSelected(true);
                          } else {
                            setSelectedRows(selectedRows.filter((id) => id !== user.id));
                          }
                        }}
                        className="w-4 h-4 rounded border-white/20 bg-white/5 text-[#FF6803]"
                        data-testid={`select-row-${user.id}`}
                      />
                    </td>
                    <td className="p-3 text-white" data-testid={`cell-name-${user.id}`}>
                      {user.name}
                    </td>
                    <td className="p-3 text-[#BFBFBF]" data-testid={`cell-email-${user.id}`}>
                      {user.email}
                    </td>
                    <td className="p-3 text-white">{user.role}</td>
                    <td className="p-3 text-white">{user.status}</td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => showToast("success", `Editando ${user.name}`)}
                          data-testid={`edit-${user.id}`}
                        >
                          Editar
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => showToast("error", `Excluindo ${user.name}`)}
                          data-testid={`delete-${user.id}`}
                        >
                          Excluir
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-sm text-[#BFBFBF]" data-testid="selection-count">
            {selectedRows.length} de {sortedUsers.length} linha(s) selecionada(s)
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// 8. UPLOAD DE ARQUIVOS
export function UploadArquivosSection({ onComplete, isComplete }: SectionCompletionProps) {
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [toast, setToast] = useState<{ show: boolean; type: "success" | "error"; message: string }>({
    show: false,
    type: "success",
    message: "",
  });
  const reportedRef = useRef(false);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ show: true, type, message });
    setTimeout(() => setToast({ show: false, type, message: "" }), 3000);
  };

  const handleFileUpload = (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      showToast("error", "Arquivo muito grande! Máximo 5MB permitido.");
      return;
    }
    setUploadedFile(file.name);
    showToast("success", `Arquivo "${file.name}" enviado com sucesso!`);
  };

  useEffect(() => {
    if (isComplete) {
      reportedRef.current = true;
    }
  }, [isComplete]);

  useEffect(() => {
    if (!reportedRef.current && uploadedFile) {
      reportedRef.current = true;
      onComplete?.();
    }
  }, [uploadedFile, onComplete]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  };

  return (
    <div className="space-y-6" data-testid="section-upload-arquivos">
      {toast.show && (
        <div
          className={`flex items-center gap-3 p-4 rounded-xl border ${
            toast.type === "success"
              ? "bg-green-500/10 border-green-500/30 text-green-400"
              : "bg-red-500/10 border-red-500/30 text-red-400"
          }`}
          data-testid="upload-toast"
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Upload de Arquivo</CardTitle>
          <CardDescription>Arraste e solte ou clique para enviar</CardDescription>
        </CardHeader>
        <CardContent>
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
              dragActive
                ? "border-[#FF6803] bg-[#FF6803]/10"
                : "border-white/20 hover:border-white/40"
            }`}
            data-testid="dropzone"
          >
            <Upload className="w-8 h-8 text-[#BFBFBF] mx-auto mb-3" />
            <p className="text-[#BFBFBF] mb-2">Arraste e solte um arquivo aqui, ou</p>
            <label className="cursor-pointer">
              <span className="text-[#FF6803] hover:underline">procure arquivos</span>
              <input
                type="file"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file);
                }}
                data-testid="file-input"
              />
            </label>
            <p className="text-xs text-[#BFBFBF] mt-2">Tamanho máximo: 5MB</p>
          </div>
          {uploadedFile && (
            <div
              className="mt-4 flex items-center gap-2 text-green-400"
              data-testid="uploaded-file"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{uploadedFile}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// 9. DROPDOWNS E SELECTS
export function DropdownsSelectsSection({ onComplete, isComplete }: SectionCompletionProps) {
  const [selectValue, setSelectValue] = useState("");
  const [openMenu, setOpenMenu] = useState<"select" | "dropdown" | null>(null);
  const [selectedDropdown, setSelectedDropdown] = useState("Selecione uma opção");
  const reportedRef = useRef(false);

  const isDone = selectValue.trim().length > 0 && selectedDropdown !== "Selecione uma opção";

  useEffect(() => {
    if (isComplete) {
      reportedRef.current = true;
    }
  }, [isComplete]);

  useEffect(() => {
    if (!reportedRef.current && isDone) {
      reportedRef.current = true;
      onComplete?.();
    }
  }, [isDone, onComplete]);

  return (
    <div className="space-y-6" data-testid="section-dropdowns-selects">
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="relative z-30 overflow-visible">
          <CardHeader>
            <CardTitle>Select Customizado</CardTitle>
            <CardDescription>Dropdown com opções múltiplas</CardDescription>
          </CardHeader>
          <CardContent className="overflow-visible">
            <div className="relative z-30">
              <label className="text-sm font-medium text-white block mb-2">Framework</label>
              <div className="relative">
                <button
                  onClick={() => setOpenMenu(openMenu === "select" ? null : "select")}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white/5 border border-white/12 text-white hover:border-white/20 transition-colors"
                  data-testid="select-input"
                  aria-expanded={openMenu === "select"}
                >
                  <span className={selectValue ? "text-white" : "text-[#BFBFBF]"}>
                    {selectValue || "Escolha uma opção"}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${openMenu === "select" ? "rotate-180" : ""}`}
                  />
                </button>
                {openMenu === "select" && (
                  <div
                    className="absolute top-full left-0 right-0 mt-2 py-2 rounded-xl bg-[#1a1a1a] border border-white/12 shadow-xl z-[60] max-h-60 overflow-y-auto"
                    data-testid="select-menu"
                  >
                    {[
                      { value: "playwright", label: "Playwright" },
                      { value: "cypress", label: "Cypress" },
                      { value: "selenium", label: "Selenium" },
                      { value: "robot", label: "Robot Framework" },
                      { value: "jest", label: "Jest" },
                      { value: "mocha", label: "Mocha" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSelectValue(option.label);
                          setOpenMenu(null);
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
            </div>
          </CardContent>
        </Card>

        <Card className="relative z-30 overflow-visible">
          <CardHeader>
            <CardTitle>Dropdown Menu</CardTitle>
            <CardDescription>Menu com ações</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <button
                onClick={() => setOpenMenu(openMenu === "dropdown" ? null : "dropdown")}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white/5 border border-white/12 text-white hover:border-white/20 transition-colors"
                data-testid="dropdown-trigger"
                aria-expanded={openMenu === "dropdown"}
              >
                {selectedDropdown}
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${openMenu === "dropdown" ? "rotate-180" : ""}`}
                />
              </button>
              {openMenu === "dropdown" && (
                <div
                  className="absolute top-full left-0 right-0 mt-2 py-2 rounded-xl bg-[#1a1a1a] border border-white/12 shadow-xl z-[60]"
                  data-testid="dropdown-menu"
                >
                  {["Opção A", "Opção B", "Opção C", "Opção D"].map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setSelectedDropdown(option);
                        setOpenMenu(null);
                      }}
                      className="w-full px-4 py-2 text-left text-[#BFBFBF] hover:text-white hover:bg-white/5 transition-colors"
                      data-testid={`dropdown-option-${option.toLowerCase().replace(" ", "-")}`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// 10. FORMULÁRIOS COMPLEXOS
export function FormulariosComplexosSection({ onComplete, isComplete }: SectionCompletionProps) {
  const [formData, setFormData] = useState({
    phone: "",
    cpf: "",
    dependentField: "",
    numberField: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showDependent, setShowDependent] = useState(false);
  const reportedRef = useRef(false);

  const validatePhone = (phone: string) => {
    if (phone && !/^\(\d{2}\) \d{5}-\d{4}$/.test(phone)) {
      return "Formato inválido. Use (00) 00000-0000";
    }
    return "";
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 11) {
      return numbers
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{5})(\d)/, "$1-$2");
    }
    return formData.phone;
  };

  const phoneValid = formData.phone.trim().length > 0 && !validatePhone(formData.phone);
  const isDone =
    phoneValid &&
    formData.numberField.trim().length > 0 &&
    showDependent &&
    formData.dependentField.trim().length > 0;

  useEffect(() => {
    if (isComplete) {
      reportedRef.current = true;
    }
  }, [isComplete]);

  useEffect(() => {
    if (!reportedRef.current && isDone) {
      reportedRef.current = true;
      onComplete?.();
    }
  }, [isDone, onComplete]);

  return (
    <div className="space-y-6" data-testid="section-formularios-complexos">
      <Card>
        <CardHeader>
          <CardTitle>Formulário com Validações</CardTitle>
          <CardDescription>Máscaras e campos dependentes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Input
              label="Telefone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: formatPhone(e.target.value) })}
              placeholder="(00) 00000-0000"
              data-testid="input-phone"
            />
            {validatePhone(formData.phone) && (
              <p className="text-xs text-red-400 mt-1">{validatePhone(formData.phone)}</p>
            )}
          </div>

          <div>
            <Input
              label="Número"
              type="number"
              value={formData.numberField}
              onChange={(e) => setFormData({ ...formData, numberField: e.target.value })}
              data-testid="input-number"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showDependent}
                onChange={(e) => setShowDependent(e.target.checked)}
                className="w-4 h-4 rounded border-white/20 bg-white/5 text-[#FF6803]"
                data-testid="toggle-dependent"
              />
              <span className="text-sm text-white">Mostrar campo dependente</span>
            </label>
          </div>

          {showDependent && (
            <div>
              <Input
                label="Campo Dependente"
                value={formData.dependentField}
                onChange={(e) => setFormData({ ...formData, dependentField: e.target.value })}
                data-testid="input-dependent"
              />
            </div>
          )}

          <Button type="submit" data-testid="submit-complex-form">
            Enviar
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// 11. DATE & TIME PICKERS
export function DateTimePickersSection({ onComplete, isComplete }: SectionCompletionProps) {
  const [dateValue, setDateValue] = useState("");
  const [timeValue, setTimeValue] = useState("");
  const [rangeStart, setRangeStart] = useState("");
  const [rangeEnd, setRangeEnd] = useState("");
  const reportedRef = useRef(false);

  const isDone =
    dateValue.trim().length > 0 &&
    timeValue.trim().length > 0 &&
    rangeStart.trim().length > 0 &&
    rangeEnd.trim().length > 0;

  useEffect(() => {
    if (isComplete) {
      reportedRef.current = true;
    }
  }, [isComplete]);

  useEffect(() => {
    if (!reportedRef.current && isDone) {
      reportedRef.current = true;
      onComplete?.();
    }
  }, [isDone, onComplete]);

  return (
    <div className="space-y-6" data-testid="section-data-pickers">
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Seleção de Data</CardTitle>
            <CardDescription>Date picker</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Data"
              type="date"
              value={dateValue}
              onChange={(e) => setDateValue(e.target.value)}
              data-testid="input-date"
            />
            {dateValue && (
              <div className="text-sm text-[#FF6803]" data-testid="date-output">
                Data selecionada: {dateValue}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Seleção de Hora</CardTitle>
            <CardDescription>Time picker</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Horário"
              type="time"
              value={timeValue}
              onChange={(e) => setTimeValue(e.target.value)}
              data-testid="input-time"
            />
            {timeValue && (
              <div className="text-sm text-[#FF6803]" data-testid="time-output">
                Horário selecionado: {timeValue}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Range de Datas</CardTitle>
            <CardDescription>Selecione início e fim</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="Data Inicial"
                type="date"
                value={rangeStart}
                onChange={(e) => setRangeStart(e.target.value)}
                data-testid="input-range-start"
              />
              <Input
                label="Data Final"
                type="date"
                value={rangeEnd}
                onChange={(e) => setRangeEnd(e.target.value)}
                data-testid="input-range-end"
              />
            </div>
            {rangeStart && rangeEnd && (
              <div className="text-sm text-[#FF6803]" data-testid="range-output">
                Período: {rangeStart} até {rangeEnd}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
