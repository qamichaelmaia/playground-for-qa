"use client";

import { useState, useEffect, useRef } from "react";
import { Button, Input, Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui";
import { Move, Lock, DollarSign, ExternalLink, CheckCircle2, AlertCircle, CreditCard, Globe, GripVertical, AlertTriangle, X, ChevronDown } from "lucide-react";

type SectionCompletionProps = {
  onComplete?: () => void;
  isComplete?: boolean;
};

type KanbanItem = {
  id: number;
  title: string;
  description: string;
  column: "backlog" | "todo" | "inProgress" | "done";
  priority: "low" | "medium" | "high";
  disabled?: boolean;
};

// 12. DRAG & DROP AVANÇADO - Kanban Board Completo
export function DragDropSection({ onComplete, isComplete }: SectionCompletionProps) {
  const initialItems: KanbanItem[] = [
    { id: 1, title: "Tarefa 1", description: "Configurar ambiente", column: "backlog", priority: "high" },
    { id: 2, title: "Tarefa 2", description: "Escrever testes", column: "backlog", priority: "medium" },
    { id: 3, title: "Tarefa 3", description: "Revisar código", column: "backlog", priority: "low" },
    { id: 4, title: "Tarefa 4", description: "Deploy em staging", column: "todo", priority: "medium" },
    { id: 5, title: "Tarefa 5", description: "Documentação", column: "backlog", priority: "low" },
    { id: 6, title: "Tarefa Bloqueada", description: "Não pode ser movida", column: "backlog", priority: "high", disabled: true },
  ];

  const [items, setItems] = useState<KanbanItem[]>(initialItems);
  const [draggedItem, setDraggedItem] = useState<number | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const [reorderCount, setReorderCount] = useState(0);
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const reportedRef = useRef(false);

  const columnLimits = {
    backlog: 10,
    todo: 5,
    inProgress: 3,
    done: 20,
  };

  const columnColors = {
    backlog: "bg-gray-500/10 border-gray-500/30 text-gray-400",
    todo: "bg-blue-500/10 border-blue-500/30 text-blue-400",
    inProgress: "bg-yellow-500/10 border-yellow-500/30 text-yellow-400",
    done: "bg-green-500/10 border-green-500/30 text-green-400",
  };

  const priorityColors = {
    high: "text-red-400 bg-red-500/10 border-red-500/30",
    medium: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30",
    low: "text-green-400 bg-green-500/10 border-green-500/30",
  };

  const handleDragStart = (e: React.DragEvent, id: number) => {
    const item = items.find((i) => i.id === id);
    if (item?.disabled) {
      e.preventDefault();
      return;
    }
    setDraggedItem(id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, column: string) => {
    e.preventDefault();
    setDragOverColumn(column);
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, targetColumn: string) => {
    e.preventDefault();
    setDragOverColumn(null);
    
    if (draggedItem === null) return;

    const item = items.find((i) => i.id === draggedItem);
    if (!item || item.disabled) return;

    const targetItems = items.filter((i) => i.column === targetColumn);
    const limit = columnLimits[targetColumn as keyof typeof columnLimits];

    if (targetItems.length >= limit && item.column !== targetColumn) {
      setMoveHistory((prev) => [...prev, `❌ Limite de ${limit} itens atingido em ${targetColumn}`]);
      setDraggedItem(null);
      return;
    }

    setItems(
      items.map((i) =>
        i.id === draggedItem ? { ...i, column: targetColumn as KanbanItem["column"] } : i
      )
    );

    setMoveHistory((prev) => [
      ...prev,
      `✅ ${item.title} movido para ${targetColumn}`,
    ]);
    setReorderCount((prev) => prev + 1);
    setDraggedItem(null);
  };

  const resetBoard = () => {
    setItems(initialItems);
    setReorderCount(0);
    setMoveHistory([]);
  };

  const isDone = 
    items.some((i) => i.column === "done") &&
    items.some((i) => i.column === "inProgress") &&
    reorderCount >= 3;

  useEffect(() => {
    if (isComplete) reportedRef.current = true;
  }, [isComplete]);

  useEffect(() => {
    if (!reportedRef.current && isDone) {
      reportedRef.current = true;
      onComplete?.();
    }
  }, [isDone, onComplete]);

  const renderColumn = (
    columnId: KanbanItem["column"],
    title: string,
    subtitle: string
  ) => {
    const columnItems = items.filter((i) => i.column === columnId);
    const limit = columnLimits[columnId];

    return (
      <div
        onDragOver={(e) => handleDragOver(e, columnId)}
        onDrop={(e) => handleDrop(e, columnId)}
        onDragLeave={() => setDragOverColumn(null)}
        className={`p-4 rounded-xl border-2 border-dashed min-h-[400px] transition-all ${
          columnColors[columnId]
        } ${dragOverColumn === columnId ? "scale-[1.02] shadow-lg" : ""}`}
        data-testid={`kanban-column-${columnId}`}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold">{title}</h3>
            <p className="text-xs opacity-70">{subtitle}</p>
          </div>
          <div className="text-xs px-2 py-1 rounded-lg bg-white/10">
            {columnItems.length}/{limit}
          </div>
        </div>
        <div className="space-y-2">
          {columnItems.map((item) => (
            <div
              key={item.id}
              draggable={!item.disabled}
              onDragStart={(e) => handleDragStart(e, item.id)}
              className={`p-3 rounded-lg border ${
                item.disabled
                  ? "bg-white/5 cursor-not-allowed opacity-50"
                  : "bg-white/10 cursor-move hover:bg-white/20"
              } ${draggedItem === item.id ? "opacity-50" : ""}`}
              data-testid={`kanban-item-${item.id}`}
            >
              <div className="flex items-start gap-2">
                <GripVertical className="w-4 h-4 text-[#BFBFBF] flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium text-white truncate">{item.title}</p>
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded border ${
                        priorityColors[item.priority]
                      }`}
                    >
                      {item.priority}
                    </span>
                  </div>
                  <p className="text-xs text-[#BFBFBF] line-clamp-2">{item.description}</p>
                  {item.disabled && (
                    <div className="flex items-center gap-1 mt-2 text-xs text-red-400">
                      <Lock className="w-3 h-3" />
                      <span>Bloqueado</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6" data-testid="section-drag-drop">
      <Card>
        <CardHeader>
          <CardTitle>Kanban Board Avançado</CardTitle>
          <CardDescription>
            Arraste tarefas entre colunas - Limite de itens por coluna - Itens bloqueados
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {renderColumn("backlog", "Backlog", "Ideias e requisitos")}
            {renderColumn("todo", "A Fazer", "Máx: 5 itens")}
            {renderColumn("inProgress", "Em Progresso", "Máx: 3 itens (WIP)")}
            {renderColumn("done", "Concluído", "Tarefas finalizadas")}
          </div>

          <div className="flex items-center gap-4 pt-4 border-t border-white/10">
            <div className="text-sm text-[#BFBFBF]" data-testid="reorder-count">
              Movimentações: <span className="text-[#FF6803] font-medium">{reorderCount}</span>
            </div>
            <Button onClick={resetBoard} variant="secondary" size="sm" data-testid="reset-board">
              Resetar Board
            </Button>
          </div>

          {moveHistory.length > 0 && (
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 max-h-32 overflow-y-auto modal-scrollbar">
              <p className="text-xs font-medium text-[#BFBFBF] mb-2">Histórico de Movimentações:</p>
              <div className="space-y-1">
                {moveHistory.slice(-5).reverse().map((log, idx) => (
                  <p key={idx} className="text-xs text-white" data-testid={`move-log-${idx}`}>
                    {log}
                  </p>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// 13. IFRAMES E SHADOW DOM - Múltiplos contextos aninhados
export function IframesShadowDOMSection({ onComplete, isComplete }: SectionCompletionProps) {
  const [iframe1Completed, setIframe1Completed] = useState(false);
  const [iframe2Completed, setIframe2Completed] = useState(false);
  const [shadowCompleted, setShadowCompleted] = useState(false);
  const [currentContext, setCurrentContext] = useState<string>("main");
  const shadowHostRef = useRef<HTMLDivElement>(null);
  const reportedRef = useRef(false);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "iframe1-complete") {
        setIframe1Completed(true);
      } else if (event.data?.type === "iframe2-complete") {
        setIframe2Completed(true);
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  useEffect(() => {
    // Criar Shadow DOM real
    if (shadowHostRef.current && !shadowHostRef.current.shadowRoot) {
      const shadowRoot = shadowHostRef.current.attachShadow({ mode: "open" });
      
      const shadowContent = document.createElement("div");
      shadowContent.innerHTML = `
        <style>
          .shadow-container {
            padding: 16px;
            background: rgba(139, 92, 246, 0.1);
            border: 1px solid rgba(139, 92, 246, 0.3);
            border-radius: 12px;
          }
          .shadow-input {
            width: 100%;
            padding: 12px;
            border: 1px solid rgba(139, 92, 246, 0.3);
            border-radius: 8px;
            background: rgba(0, 0, 0, 0.3);
            color: white;
            font-size: 14px;
            margin-bottom: 12px;
            box-sizing: border-box;
          }
          .shadow-button {
            padding: 10px 20px;
            border: none;
            border-radius: 8px;
            background: #8b5cf6;
            color: white;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
          }
          .shadow-button:hover {
            background: #7c3aed;
          }
          .shadow-output {
            margin-top: 12px;
            padding: 12px;
            border-radius: 8px;
            background: rgba(139, 92, 246, 0.2);
            color: #c4b5fd;
            display: none;
          }
        </style>
        <div class="shadow-container">
          <h4 style="color: #c4b5fd; margin: 0 0 12px 0; font-size: 14px;">Shadow DOM Encapsulated</h4>
          <input 
            type="text" 
            class="shadow-input" 
            id="shadow-input"
            placeholder="Digite no Shadow DOM..."
            data-testid="shadow-input"
          />
          <button class="shadow-button" id="shadow-submit" data-testid="shadow-submit">
            Processar no Shadow DOM
          </button>
          <div class="shadow-output" id="shadow-output" data-testid="shadow-output"></div>
        </div>
      `;
      
      shadowRoot.appendChild(shadowContent);
      
      const shadowInput = shadowRoot.getElementById("shadow-input") as HTMLInputElement;
      const shadowButton = shadowRoot.getElementById("shadow-submit");
      const shadowOutput = shadowRoot.getElementById("shadow-output");
      
      shadowButton?.addEventListener("click", () => {
        if (shadowInput && shadowOutput) {
          shadowOutput.textContent = `Shadow: ${shadowInput.value}`;
          shadowOutput.style.display = "block";
          setShadowCompleted(true);
        }
      });
    }
  }, []);

  const isDone = iframe1Completed && iframe2Completed && shadowCompleted;

  useEffect(() => {
    if (isComplete) reportedRef.current = true;
  }, [isComplete]);

  useEffect(() => {
    if (!reportedRef.current && isDone) {
      reportedRef.current = true;
      onComplete?.();
    }
  }, [isDone, onComplete]);

  const iframe1Content = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { margin: 0; padding: 16px; font-family: system-ui; background: #1a1a2e; color: white; }
          input { width: 100%; padding: 10px; border: 1px solid rgba(59, 130, 246, 0.3); border-radius: 8px; background: rgba(59, 130, 246, 0.1); color: white; font-size: 13px; margin-bottom: 10px; box-sizing: border-box; }
          button { padding: 8px 16px; border: none; border-radius: 8px; background: #3b82f6; color: white; cursor: pointer; font-size: 13px; }
          button:hover { background: #2563eb; }
          .output { margin-top: 12px; padding: 10px; border-radius: 8px; background: rgba(59, 130, 246, 0.15); color: #93c5fd; display: none; }
        </style>
      </head>
      <body>
        <h4 style="margin: 0 0 10px 0; color: #93c5fd;">Iframe 1 (Nível 1)</h4>
        <input type="text" id="iframe1-input" placeholder="Input no Iframe 1..." data-testid="iframe1-input" />
        <button onclick="process()" data-testid="iframe1-button">Processar Iframe 1</button>
        <div class="output" id="output" data-testid="iframe1-output"></div>
        
        <script>
          function process() {
            const input = document.getElementById('iframe1-input').value;
            const output = document.getElementById('output');
            output.textContent = 'Iframe1: ' + input;
            output.style.display = 'block';
            if (input && window.parent) {
              window.parent.postMessage({ type: 'iframe1-complete' }, '*');
            }
          }
        </script>
      </body>
    </html>
  `;

  const iframe2Content = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { margin: 0; padding: 16px; font-family: system-ui; background: #1e293b; color: white; }
          input { width: 100%; padding: 10px; border: 1px solid rgba(34, 197, 94, 0.3); border-radius: 8px; background: rgba(34, 197, 94, 0.1); color: white; font-size: 13px; margin-bottom: 10px; box-sizing: border-box; }
          button { padding: 8px 16px; border: none; border-radius: 8px; background: #22c55e; color: white; cursor: pointer; font-size: 13px; }
          button:hover { background: #16a34a; }
          .output { margin-top: 12px; padding: 10px; border-radius: 8px; background: rgba(34, 197, 94, 0.15); color: #86efac; display: none; }
        </style>
      </head>
      <body>
        <h4 style="margin: 0 0 10px 0; color: #86efac;">Iframe 2 (Nível 1)</h4>
        <input type="text" id="iframe2-input" placeholder="Input no Iframe 2..." data-testid="iframe2-input" />
        <button onclick="process()" data-testid="iframe2-button">Processar Iframe 2</button>
        <div class="output" id="output" data-testid="iframe2-output"></div>
        
        <script>
          function process() {
            const input = document.getElementById('iframe2-input').value;
            const output = document.getElementById('output');
            output.textContent = 'Iframe2: ' + input;
            output.style.display = 'block';
            if (input && window.parent) {
              window.parent.postMessage({ type: 'iframe2-complete' }, '*');
            }
          }
        </script>
      </body>
    </html>
  `;

  return (
    <div className="space-y-6" data-testid="section-iframes">
      <Card>
        <CardHeader>
          <CardTitle>Iframes & Shadow DOM Avançado</CardTitle>
          <CardDescription>
            Múltiplos iframes + Shadow DOM encapsulado - Navegação entre contextos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Context Indicator */}
          <div className="flex items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10">
            <span className="text-sm text-[#BFBFBF]">Contexto Atual:</span>
            <span className="text-sm font-medium text-[#FF6803]" data-testid="current-context">
              {currentContext}
            </span>
          </div>

          {/* Iframe 1 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-white">Iframe 1</h3>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => setCurrentContext("iframe1")}
                  data-testid="switch-iframe1"
                >
                  Alternar para Iframe 1
                </Button>
                {iframe1Completed && (
                  <CheckCircle2 className="w-4 h-4 text-green-400" data-testid="iframe1-check" />
                )}
              </div>
            </div>
            <iframe
              srcDoc={iframe1Content}
              className="w-full border border-blue-500/30 rounded-xl"
              style={{ height: "200px" }}
              data-testid="iframe-1"
            />
          </div>

          {/* Iframe 2 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-white">Iframe 2</h3>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => setCurrentContext("iframe2")}
                  data-testid="switch-iframe2"
                >
                  Alternar para Iframe 2
                </Button>
                {iframe2Completed && (
                  <CheckCircle2 className="w-4 h-4 text-green-400" data-testid="iframe2-check" />
                )}
              </div>
            </div>
            <iframe
              srcDoc={iframe2Content}
              className="w-full border border-green-500/30 rounded-xl"
              style={{ height: "200px" }}
              data-testid="iframe-2"
            />
          </div>

          {/* Shadow DOM */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-white">Shadow DOM</h3>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => setCurrentContext("shadow-dom")}
                  data-testid="switch-shadow"
                >
                  Alternar para Shadow DOM
                </Button>
                {shadowCompleted && (
                  <CheckCircle2 className="w-4 h-4 text-green-400" data-testid="shadow-check" />
                )}
              </div>
            </div>
            <div ref={shadowHostRef} data-testid="shadow-host" className="border border-purple-500/30 rounded-xl" />
          </div>

          {/* Context Return */}
          <Button
            variant="secondary"
            onClick={() => setCurrentContext("main")}
            data-testid="return-main"
            className="w-full"
          >
            Retornar ao Contexto Principal
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// 14. INTEGRAÇÃO COM API REST - CRUD Completo
export function IntegracaoAPISection({ onComplete, isComplete }: SectionCompletionProps) {
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [page, setPage] = useState(1);
  const [newUser, setNewUser] = useState({ name: "", email: "" });
  const [httpStatus, setHttpStatus] = useState<number | null>(null);
  const [operationsCount, setOperationsCount] = useState(0);
  const reportedRef = useRef(false);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/users?_page=${page}&_limit=3`);
      setHttpStatus(response.status);
      const data = await response.json();
      setUsers(data);
      setSuccessMessage(`GET /users - Status ${response.status}`);
      setOperationsCount(prev => prev + 1);
    } catch (err) {
      setError("Erro ao buscar usuários");
      setHttpStatus(500);
    }
    setIsLoading(false);
  };

  const fetchUserById = async (id: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
      setHttpStatus(response.status);
      if (response.status === 404) {
        setError("Usuário não encontrado (404)");
        setSelectedUser(null);
      } else {
        const data = await response.json();
        setSelectedUser(data);
        setSuccessMessage(`GET /users/${id} - Status ${response.status}`);
        setOperationsCount(prev => prev + 1);
      }
    } catch (err) {
      setError("Erro ao buscar usuário");
    }
    setIsLoading(false);
  };

  const createUser = async () => {
    if (!newUser.name || !newUser.email) {
      setError("Nome e email são obrigatórios (400)");
      setHttpStatus(400);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("https://jsonplaceholder.typicode.com/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });
      setHttpStatus(response.status);
      const data = await response.json();
      setSuccessMessage(`POST /users - Status 201 - ID: ${data.id}`);
      setNewUser({ name: "", email: "" });
      setOperationsCount(prev => prev + 1);
    } catch (err) {
      setError("Erro ao criar usuário");
      setHttpStatus(500);
    }
    setIsLoading(false);
  };

  const updateUser = async (id: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Nome Atualizado", email: "updated@example.com" }),
      });
      setHttpStatus(response.status);
      setSuccessMessage(`PUT /users/${id} - Status ${response.status}`);
      setOperationsCount(prev => prev + 1);
    } catch (err) {
      setError("Erro ao atualizar usuário");
    }
    setIsLoading(false);
  };

  const deleteUser = async (id: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
        method: "DELETE",
      });
      setHttpStatus(response.status);
      setSuccessMessage(`DELETE /users/${id} - Status ${response.status}`);
      setOperationsCount(prev => prev + 1);
    } catch (err) {
      setError("Erro ao deletar usuário");
    }
    setIsLoading(false);
  };

  const isDone = operationsCount >= 4; // GET, GET by ID, POST, PUT/DELETE

  useEffect(() => {
    if (isComplete) reportedRef.current = true;
  }, [isComplete]);

  useEffect(() => {
    if (!reportedRef.current && isDone) {
      reportedRef.current = true;
      onComplete?.();
    }
  }, [isDone, onComplete]);

  return (
    <div className="space-y-6" data-testid="section-api-rest">
      <Card>
        <CardHeader>
          <CardTitle>API REST - CRUD Completo</CardTitle>
          <CardDescription>
            GET, POST, PUT, DELETE + Paginação + Tratamento de erros HTTP
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Status & Operations Counter */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <p className="text-xs text-[#BFBFBF] mb-1">Último Status HTTP</p>
              <p className={`text-lg font-bold ${
                httpStatus === 200 || httpStatus === 201 ? "text-green-400" :
                httpStatus === 404 ? "text-yellow-400" :
                httpStatus === 400 || httpStatus === 500 ? "text-red-400" :
                "text-white"
              }`} data-testid="http-status">
                {httpStatus || "---"}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <p className="text-xs text-[#BFBFBF] mb-1">Operações Realizadas</p>
              <p className="text-lg font-bold text-[#FF6803]" data-testid="operations-count">
                {operationsCount}
              </p>
            </div>
          </div>

          {/* GET Users */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Button onClick={fetchUsers} isLoading={isLoading} data-testid="fetch-users" size="sm">
                GET /users (Página {page})
              </Button>
              <div className="flex gap-1">
                <Button size="sm" variant="secondary" onClick={() => setPage(p => Math.max(1, p - 1))} data-testid="prev-page">
                  ←
                </Button>
                <Button size="sm" variant="secondary" onClick={() => setPage(p => p + 1)} data-testid="next-page">
                  →
                </Button>
              </div>
            </div>
            {users.length > 0 && (
              <div className="grid gap-2" data-testid="users-list">
                {users.map((user) => (
                  <div key={user.id} className="p-3 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-white">{user.name}</p>
                      <p className="text-xs text-[#BFBFBF]">{user.email}</p>
                    </div>
                    <div className="flex gap-1">
                      <Button size="sm" onClick={() => fetchUserById(user.id)} data-testid={`get-user-${user.id}`}>
                        GET
                      </Button>
                      <Button size="sm" variant="secondary" onClick={() => updateUser(user.id)} data-testid={`update-user-${user.id}`}>
                        PUT
                      </Button>
                      <Button size="sm" variant="secondary" onClick={() => deleteUser(user.id)} data-testid={`delete-user-${user.id}`}>
                        DEL
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* POST Create User */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
            <h4 className="text-sm font-medium text-white">POST /users - Criar Novo Usuário</h4>
            <div className="grid md:grid-cols-2 gap-3">
              <Input
                label="Nome"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                data-testid="new-user-name"
              />
              <Input
                label="Email"
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                data-testid="new-user-email"
              />
            </div>
            <Button onClick={createUser} isLoading={isLoading} data-testid="create-user">
              POST - Criar Usuário
            </Button>
          </div>

          {/* Selected User Details */}
          {selectedUser && (
            <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30" data-testid="selected-user">
              <h4 className="text-sm font-medium text-green-400 mb-2">Usuário Selecionado (GET by ID)</h4>
              <p className="text-sm text-white"><strong>ID:</strong> {selectedUser.id}</p>
              <p className="text-sm text-white"><strong>Nome:</strong> {selectedUser.name}</p>
              <p className="text-sm text-white"><strong>Email:</strong> {selectedUser.email}</p>
              <p className="text-sm text-white"><strong>Website:</strong> {selectedUser.website}</p>
            </div>
          )}

          {/* Messages */}
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400" data-testid="api-error">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}
          {successMessage && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400" data-testid="api-success">
              <CheckCircle2 className="w-4 h-4" />
              {successMessage}
            </div>
          )}

          {/* Test 404 */}
          <Button
            variant="secondary"
            onClick={() => fetchUserById(9999)}
            data-testid="test-404"
            size="sm"
            className="w-full"
          >
            Testar 404 (GET /users/9999)
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// 15. AUTENTICAÇÃO & SESSÕES - JWT, Refresh Token, Expiração
export function AutenticacaoSessoesSection({ onComplete, isComplete }: SectionCompletionProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [credentials, setCredentials] = useState({ email: "", password: "", code2FA: "" });
  const [error, setError] = useState("");
  const [sessionData, setSessionData] = useState<any>(null);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [show2FA, setShow2FA] = useState(false);
  const [sessionExpiry, setSessionExpiry] = useState<number | null>(null);
  const [refreshTokens, setRefreshTokens] = useState(0);
  const reportedRef = useRef(false);
  const sessionTimerRef = useRef<NodeJS.Timeout | null>(null);

  const validCredentials = [
    { email: "admin@test.com", password: "Senha@123", code2FA: "123456" },
    { email: "user@test.com", password: "User@456", code2FA: "654321" },
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isBlocked) {
      setError("Conta bloqueada temporariamente. Muitas tentativas.");
      return;
    }

    const validUser = validCredentials.find(
      (u) => u.email === credentials.email && u.password === credentials.password
    );

    if (!validUser) {
      setLoginAttempts((prev) => prev + 1);
      setError("Credenciais inválidas");
      
      if (loginAttempts + 1 >= 3) {
        setIsBlocked(true);
        setError("Conta bloqueada após 3 tentativas. Aguarde 30 segundos.");
        setTimeout(() => {
          setIsBlocked(false);
          setLoginAttempts(0);
        }, 30000);
      }
      return;
    }

    if (!show2FA) {
      setShow2FA(true);
      setError("");
      return;
    }

    if (credentials.code2FA !== validUser.code2FA) {
      setError("Código 2FA inválido");
      return;
    }

    // Login bem-sucedido
    setIsLoggedIn(true);
    setShow2FA(false);
    setError("");
    setLoginAttempts(0);
    
    const accessToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(credentials.email)}.${Date.now()}`;
    const refreshToken = `refresh_${Math.random().toString(36).substr(2, 9)}`;
    const expiresIn = 30; // 30 segundos para demonstração
    
    setSessionData({
      user: credentials.email.split("@")[0],
      accessToken,
      refreshToken,
      loginTime: new Date().toLocaleString(),
      expiresIn,
    });

    setSessionExpiry(expiresIn);
    
    // Timer de expiração de sessão
    if (sessionTimerRef.current) clearInterval(sessionTimerRef.current);
    sessionTimerRef.current = setInterval(() => {
      setSessionExpiry((prev) => {
        if (prev === null || prev <= 1) {
          handleLogout("Sessão expirada automaticamente");
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleRefreshToken = () => {
    if (!sessionData) return;
    
    const newAccessToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(sessionData.user)}.${Date.now()}`;
    
    setSessionData((prev: any) => ({
      ...prev,
      accessToken: newAccessToken,
    }));

    setRefreshTokens((prev) => prev + 1);
    setSessionExpiry(30);
  };

  const handleLogout = (reason = "Logout manual") => {
    setIsLoggedIn(false);
    setSessionData(null);
    setCredentials({ email: "", password: "", code2FA: "" });
    setShow2FA(false);
    setSessionExpiry(null);
    setRefreshTokens(0);
    
    if (sessionTimerRef.current) {
      clearInterval(sessionTimerRef.current);
      sessionTimerRef.current = null;
    }

    if (reason === "Sessão expirada automaticamente") {
      setError(reason);
    }
  };

  const isDone = isLoggedIn && refreshTokens >= 1;

  useEffect(() => {
    if (isComplete) reportedRef.current = true;
  }, [isComplete]);

  useEffect(() => {
    if (!reportedRef.current && isDone) {
      reportedRef.current = true;
      onComplete?.();
    }
  }, [isDone, onComplete]);

  useEffect(() => {
    return () => {
      if (sessionTimerRef.current) clearInterval(sessionTimerRef.current);
    };
  }, []);

  return (
    <div className="space-y-6" data-testid="section-autenticacao">
      <Card>
        <CardHeader>
          <CardTitle>Autenticação Avançada</CardTitle>
          <CardDescription>
            JWT + Refresh Token + 2FA + Expiração de Sessão + Rate Limiting
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isLoggedIn ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 text-sm">
                <strong>Credenciais válidas:</strong><br />
                admin@test.com / Senha@123 / 2FA: 123456<br />
                user@test.com / User@456 / 2FA: 654321
              </div>

              {!show2FA ? (
                <>
                  <Input
                    label="Email"
                    type="email"
                    value={credentials.email}
                    onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                    placeholder="admin@test.com"
                    data-testid="login-email"
                    disabled={isBlocked}
                  />
                  <Input
                    label="Senha"
                    type="password"
                    value={credentials.password}
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                    placeholder="Senha@123"
                    data-testid="login-password"
                    disabled={isBlocked}
                  />
                </>
              ) : (
                <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30">
                  <h4 className="text-sm font-medium text-yellow-400 mb-3">Autenticação de Dois Fatores (2FA)</h4>
                  <Input
                    label="Código 2FA"
                    value={credentials.code2FA}
                    onChange={(e) => setCredentials({ ...credentials, code2FA: e.target.value })}
                    placeholder="123456"
                    data-testid="login-2fa"
                    maxLength={6}
                  />
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setShow2FA(false);
                      setCredentials({ ...credentials, code2FA: "" });
                    }}
                    className="mt-2"
                    data-testid="cancel-2fa"
                    size="sm"
                  >
                    Voltar
                  </Button>
                </div>
              )}

              {error && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400" data-testid="login-error">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}

              <div className="text-xs text-[#BFBFBF]" data-testid="login-attempts">
                Tentativas de login: {loginAttempts}/3 {isBlocked && "(Bloqueado)"}
              </div>

              <Button type="submit" data-testid="login-button" disabled={isBlocked}>
                <Lock className="w-4 h-4 mr-2" />
                {show2FA ? "Verificar 2FA" : "Entrar"}
              </Button>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-green-400 mb-4" data-testid="login-status">
                <CheckCircle2 className="w-5 h-5" />
                <span>Login realizado com sucesso! Sessão ativa.</span>
              </div>

              {/* Session Expiry Warning */}
              {sessionExpiry !== null && sessionExpiry <= 10 && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-400" data-testid="session-warning">
                  <AlertTriangle className="w-4 h-4" />
                  Sessão expira em {sessionExpiry}s
                </div>
              )}

              {/* Session Info */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/12 space-y-2" data-testid="session-info">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#BFBFBF]">Usuário:</span>
                  <span className="text-sm text-white font-medium">{sessionData?.user}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#BFBFBF]">Access Token:</span>
                  <span className="text-xs text-white font-mono truncate max-w-[200px]" data-testid="access-token">
                    {sessionData?.accessToken.substring(0, 30)}...
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#BFBFBF]">Refresh Token:</span>
                  <span className="text-xs text-white font-mono" data-testid="refresh-token">
                    {sessionData?.refreshToken}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#BFBFBF]">Login:</span>
                  <span className="text-xs text-white">{sessionData?.loginTime}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#BFBFBF]">Expira em:</span>
                  <span className={`text-sm font-bold ${
                    sessionExpiry && sessionExpiry <= 10 ? "text-red-400" : "text-green-400"
                  }`} data-testid="session-expiry">
                    {sessionExpiry}s
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#BFBFBF]">Tokens Renovados:</span>
                  <span className="text-sm font-medium text-[#FF6803]" data-testid="refresh-count">
                    {refreshTokens}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button onClick={handleRefreshToken} data-testid="refresh-token-button">
                  Renovar Token
                </Button>
                <Button onClick={() => handleLogout()} variant="secondary" data-testid="logout-button">
                  Sair
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// 16. SIMULAÇÃO DE PAGAMENTOS
// 16. SIMULAÇÃO DE PAGAMENTOS - Gateway Completo
export function SimulacaoPagamentosSection({ onComplete, isComplete }: SectionCompletionProps) {
  const [cardData, setCardData] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });
  const [paymentMethod, setPaymentMethod] = useState<"credit" | "debit" | "pix">("credit");
  const [installments, setInstallments] = useState(1);
  const [isInstallmentsOpen, setIsInstallmentsOpen] = useState(false);
  const [total, setTotal] = useState(1000.00);
  const [discount, setDiscount] = useState(0);
  const [coupon, setCoupon] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "3ds" | "success" | "failed">("idle");
  const [threeDSCode, setThreeDSCode] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [cardErrors, setCardErrors] = useState<string[]>([]);
  const [attempts, setAttempts] = useState(0);
  const reportedRef = useRef(false);

  const validCoupons = {
    "DESCONTO10": 10,
    "PROMO20": 20,
    "BLACK30": 30,
  };

  const formatCardNumber = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    return numbers.replace(/(\d{4})/g, "$1 ").trim().slice(0, 19);
  };

  const formatExpiry = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length >= 2) {
      return numbers.slice(0, 2) + "/" + numbers.slice(2, 4);
    }
    return numbers;
  };

  // Algoritmo de Luhn para validação de cartão
  const validateCardNumber = (number: string): boolean => {
    const digits = number.replace(/\s/g, "");
    if (!/^\d{13,19}$/.test(digits)) return false;

    let sum = 0;
    let isEven = false;

    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = parseInt(digits[i]);

      if (isEven) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0;
  };

  const validateCardData = (): string[] => {
    const errors: string[] = [];

    if (!cardData.number) {
      errors.push("Número do cartão obrigatório");
    } else if (!validateCardNumber(cardData.number)) {
      errors.push("Número de cartão inválido (Luhn)");
    }

    if (!cardData.name || cardData.name.length < 3) {
      errors.push("Nome do titular obrigatório");
    }

    if (!cardData.expiry || cardData.expiry.length !== 5) {
      errors.push("Data de validade inválida");
    } else {
      const [month, year] = cardData.expiry.split("/").map(n => parseInt(n));
      const now = new Date();
      const currentMonth = now.getMonth() + 1;
      const currentYear = now.getFullYear() % 100;

      if (month < 1 || month > 12) {
        errors.push("Mês inválido");
      } else if (year < currentYear || (year === currentYear && month < currentMonth)) {
        errors.push("Cartão expirado");
      }
    }

    if (!cardData.cvv || !/^\d{3,4}$/.test(cardData.cvv)) {
      errors.push("CVV inválido");
    }

    return errors;
  };

  const applyCoupon = () => {
    const upperCoupon = coupon.toUpperCase();
    if (validCoupons[upperCoupon as keyof typeof validCoupons]) {
      setDiscount(validCoupons[upperCoupon as keyof typeof validCoupons]);
      setCardErrors([`Cupom aplicado! ${validCoupons[upperCoupon as keyof typeof validCoupons]}% de desconto`]);
    } else {
      setCardErrors(["Cupom inválido"]);
      setDiscount(0);
    }
  };

  const processPayment = () => {
    const errors = paymentMethod === "pix" ? [] : validateCardData();
    
    if (errors.length > 0) {
      setCardErrors(errors);
      setPaymentStatus("failed");
      setAttempts(prev => prev + 1);
      return;
    }

    setCardErrors([]);
    setPaymentStatus("processing");
    
    setTimeout(() => {
      // Simular 3D Secure apenas para cartao
      if (paymentMethod !== "pix" && getFinalTotal() > 500) {
        setPaymentStatus("3ds");
      } else {
        finalizePayment();
      }
    }, 2000);
  };

  const verify3DS = () => {
    if (threeDSCode === "123456") {
      finalizePayment();
    } else {
      setCardErrors(["Código 3DS inválido"]);
      setPaymentStatus("failed");
      setAttempts(prev => prev + 1);
    }
  };

  const finalizePayment = () => {
    setPaymentStatus("success");
    setTransactionId(`TXN-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`);
    if (!reportedRef.current) {
      reportedRef.current = true;
      onComplete?.();
    }
  };

  const resetPayment = () => {
    setPaymentStatus("idle");
    setCardData({ number: "", name: "", expiry: "", cvv: "" });
    setThreeDSCode("");
    setCoupon("");
    setDiscount(0);
    setCardErrors([]);
  };

  const getFinalTotal = () => {
    const discountAmount = total * (discount / 100);
    const finalTotal = total - discountAmount;
    return finalTotal / installments;
  };

  const isDone = paymentStatus === "success" && attempts >= 0;

  useEffect(() => {
    if (isComplete) reportedRef.current = true;
  }, [isComplete]);

  useEffect(() => {
    if (!reportedRef.current && isDone) {
      reportedRef.current = true;
      onComplete?.();
    }
  }, [isDone, onComplete]);

  return (
    <div className="space-y-6" data-testid="section-pagamentos">
      <Card>
        <CardHeader>
          <CardTitle>Gateway de Pagamento Avançado</CardTitle>
          <CardDescription>
            Múltiplas formas de pagamento + Validação Luhn + 3D Secure + Cupons
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 text-sm">
            <strong>Dados validos para teste:</strong><br />
            Cartao: 4242 4242 4242 4242<br />
            Nome: MICHAEL MAIA (ou qualquer nome com 3+ caracteres)
          </div>
          {paymentStatus === "idle" || paymentStatus === "failed" ? (
            <>
              {/* Payment Method Selection */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setPaymentMethod("credit")}
                  className={`p-3 rounded-xl border-2 transition-all ${
                    paymentMethod === "credit"
                      ? "border-[#FF6803] bg-[#FF6803]/10 text-[#FF6803]"
                      : "border-white/10 bg-white/5 text-white hover:bg-white/10"
                  }`}
                  data-testid="payment-credit"
                >
                  <CreditCard className="w-5 h-5 mx-auto mb-1" />
                  <span className="text-xs font-medium">Crédito</span>
                </button>
                <button
                  onClick={() => setPaymentMethod("debit")}
                  className={`p-3 rounded-xl border-2 transition-all ${
                    paymentMethod === "debit"
                      ? "border-[#FF6803] bg-[#FF6803]/10 text-[#FF6803]"
                      : "border-white/10 bg-white/5 text-white hover:bg-white/10"
                  }`}
                  data-testid="payment-debit"
                >
                  <CreditCard className="w-5 h-5 mx-auto mb-1" />
                  <span className="text-xs font-medium">Débito</span>
                </button>
                <button
                  onClick={() => setPaymentMethod("pix")}
                  className={`p-3 rounded-xl border-2 transition-all ${
                    paymentMethod === "pix"
                      ? "border-[#FF6803] bg-[#FF6803]/10 text-[#FF6803]"
                      : "border-white/10 bg-white/5 text-white hover:bg-white/10"
                  }`}
                  data-testid="payment-pix"
                >
                  <DollarSign className="w-5 h-5 mx-auto mb-1" />
                  <span className="text-xs font-medium">PIX</span>
                </button>
              </div>

              {/* Card Details */}
              {(paymentMethod === "credit" || paymentMethod === "debit") && (
                <div className="space-y-3 p-4 rounded-xl bg-white/5 border border-white/10">
                  <Input
                    label="Número do Cartão"
                    value={cardData.number}
                    onChange={(e) => setCardData({ ...cardData, number: formatCardNumber(e.target.value) })}
                    placeholder="000 000 000 000" 
                    data-testid="card-number"
                    maxLength={19}
                  />
                  <Input
                    label="Nome do Titular"
                    value={cardData.name}
                    onChange={(e) => setCardData({ ...cardData, name: e.target.value.toUpperCase() })}
                    placeholder="MICHAEL MAIA"
                    data-testid="card-name"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      label="Validade (MM/AA)"
                      value={cardData.expiry}
                      onChange={(e) => setCardData({ ...cardData, expiry: formatExpiry(e.target.value) })}
                      placeholder="12/25"
                      data-testid="card-expiry"
                      maxLength={5}
                    />
                    <Input
                      label="CVV"
                      value={cardData.cvv}
                      onChange={(e) => setCardData({ ...cardData, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) })}
                      placeholder="123"
                      type="password"
                      data-testid="card-cvv"
                      maxLength={4}
                    />
                  </div>
                </div>
              )}

              {/* Installments (only for credit) */}
              {paymentMethod === "credit" && (
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <label className="text-sm font-medium text-white block mb-2">Parcelamento</label>
                  <div className="relative">
                    <button
                      onClick={() => setIsInstallmentsOpen((prev) => !prev)}
                      className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white/5 border border-white/12 text-white hover:border-white/20 transition-colors"
                      data-testid="installments-select"
                      aria-expanded={isInstallmentsOpen}
                    >
                      <span className="text-white">
                        {installments}x de R$ {((total - total * (discount / 100)) / installments).toFixed(2)} {installments === 1 ? "(sem juros)" : ""}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${isInstallmentsOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                    {isInstallmentsOpen && (
                      <div
                        className="absolute top-full left-0 right-0 mt-2 py-2 rounded-xl bg-[#1a1a1a] border border-white/12 shadow-xl z-[60] max-h-60 overflow-y-auto"
                        data-testid="installments-menu"
                      >
                        {[1, 2, 3, 6, 12].map((i) => (
                          <button
                            key={i}
                            onClick={() => {
                              setInstallments(i);
                              setIsInstallmentsOpen(false);
                            }}
                            className={`w-full px-4 py-2 text-left transition-colors ${
                              installments === i
                                ? "text-[#FF6803] bg-white/5"
                                : "text-[#BFBFBF] hover:text-white hover:bg-white/5"
                            }`}
                            data-testid={`installments-option-${i}`}
                          >
                            {i}x de R$ {((total - total * (discount / 100)) / i).toFixed(2)} {i === 1 ? "(sem juros)" : ""}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Coupon */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <label className="text-sm font-medium text-white block mb-2">Cupom de Desconto</label>
                <div className="flex gap-2">
                  <Input
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                    placeholder="DESCONTO10"
                    data-testid="coupon-input"
                  />
                  <Button onClick={applyCoupon} variant="secondary" data-testid="apply-coupon">
                    Aplicar
                  </Button>
                </div>
                <p className="text-xs text-[#BFBFBF] mt-2">
                  Cupons válidos: DESCONTO10, PROMO20, BLACK30
                </p>
              </div>

              {/* Total */}
              <div className="p-4 rounded-xl bg-[#FF6803]/10 border border-[#FF6803]/30">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-white">Subtotal:</span>
                  <span className="text-sm text-white">R$ {total.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-green-400">Desconto ({discount}%):</span>
                    <span className="text-sm text-green-400">- R$ {(total * (discount / 100)).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-[#FF6803]/30">
                  <span className="text-lg font-bold text-[#FF6803]">Total:</span>
                  <span className="text-lg font-bold text-[#FF6803]" data-testid="final-total">
                    R$ {getFinalTotal().toFixed(2)}
                  </span>
                </div>
                {installments > 1 && (
                  <p className="text-xs text-[#FF6803] text-right mt-1">
                    ({installments}x sem juros)
                  </p>
                )}
              </div>

              {/* Errors */}
              {cardErrors.length > 0 && (
                <div className="space-y-1" data-testid="payment-errors">
                  {cardErrors.map((error, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center gap-2 p-2 rounded-lg text-sm ${
                        error.includes("aplicado")
                          ? "bg-green-500/10 text-green-400"
                          : "bg-red-500/10 text-red-400"
                      }`}
                      data-testid={`error-${idx}`}
                    >
                      {error.includes("aplicado") ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                      {error}
                    </div>
                  ))}
                </div>
              )}

              {/* Attempts Counter */}
              {attempts > 0 && (
                <div className="text-xs text-[#BFBFBF]" data-testid="payment-attempts">
                  Tentativas: {attempts}
                </div>
              )}

              {/* Pay Button */}
              <Button onClick={processPayment} data-testid="pay-button" className="w-full">
                <CreditCard className="w-4 h-4 mr-2" />
                Pagar {paymentMethod === "pix" ? "com PIX" : `R$ ${getFinalTotal().toFixed(2)}`}
              </Button>
            </>
          ) : paymentStatus === "processing" ? (
            <div className="text-center py-12" data-testid="payment-processing">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6803] mb-4"></div>
              <p className="text-lg text-white font-medium">Processando pagamento...</p>
              <p className="text-sm text-[#BFBFBF]">Comunicando com a operadora</p>
            </div>
          ) : paymentStatus === "3ds" ? (
            <div className="space-y-4" data-testid="payment-3ds">
              <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-400">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  Autenticação 3D Secure
                </h4>
                <p className="text-sm">
                  Para sua segurança, digite o código enviado para seu celular.
                </p>
              </div>
              <Input
                label="Código 3D Secure"
                value={threeDSCode}
                onChange={(e) => setThreeDSCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="123456"
                data-testid="3ds-code"
                maxLength={6}
              />
              <p className="text-xs text-[#BFBFBF]">
                Código para teste: <span className="text-[#FF6803]">123456</span>
              </p>
              <Button onClick={verify3DS} data-testid="verify-3ds" className="w-full">
                Verificar Código
              </Button>
            </div>
          ) : (
            <div className="text-center py-12" data-testid="payment-success">
              <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <p className="text-xl font-bold text-white mb-2">Pagamento Aprovado!</p>
              <p className="text-sm text-[#BFBFBF] mb-4">Sua compra foi processada com sucesso.</p>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 mb-4">
                <p className="text-sm text-white mb-1">
                  <strong>ID da Transação:</strong>
                </p>
                <p className="text-xs font-mono text-[#FF6803]" data-testid="transaction-id">
                  {transactionId}
                </p>
                <p className="text-sm text-white mt-2">
                  <strong>Valor:</strong> R$ {getFinalTotal().toFixed(2)}
                </p>
                <p className="text-sm text-white">
                  <strong>Método:</strong> {paymentMethod === "credit" ? "Cartão de Crédito" : paymentMethod === "debit" ? "Cartão de Débito" : "PIX"}
                </p>
              </div>
              <Button onClick={resetPayment} variant="secondary" data-testid="new-payment-button">
                Nova Transação
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// 17. MÚLTIPLAS JANELAS E ABAS - Comunicação entre contextos
export function MultiJanelasAbasSection({ onComplete, isComplete }: SectionCompletionProps) {
  const [windows, setWindows] = useState<{ id: string; type: string; opened: boolean }[]>([]);
  const [messages, setMessages] = useState<string[]>([]);
  const [broadcastText, setBroadcastText] = useState("");
  const [sharedData, setSharedData] = useState("");
  const [hasSharedUpdate, setHasSharedUpdate] = useState(false);
  const [receivedData, setReceivedData] = useState<string[]>([]);
  const windowRefs = useRef<{ [key: string]: Window | null }>({});
  const reportedRef = useRef(false);

  useEffect(() => {
    // Listener para mensagens de outras janelas
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "child-message") {
        setMessages((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${event.data.message}`]);
        setReceivedData((prev) => [...prev, event.data.message]);
      } else if (event.data?.type === "child-connected") {
        setMessages((prev) => [...prev, `[${new Date().toLocaleTimeString()}] Nova janela conectada: ${event.data.windowId}`]);
        setReceivedData((prev) => [...prev, `Conectado: ${event.data.windowId}`]);
      } else if (event.data?.type === "parent-message" || event.data?.type === "parent-broadcast") {
        const reply = event.data?.message ? `Resposta: ${event.data.message}` : "Resposta recebida";
        setMessages((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${reply}`]);
        if (event.source && typeof (event.source as Window).postMessage === "function") {
          (event.source as Window).postMessage({ type: "child-message", message: reply }, "*");
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  useEffect(() => {
    if (window.opener && typeof window.opener.postMessage === "function") {
      window.opener.postMessage({ type: "child-connected", windowId: window.name || "child" }, "*");
    }
  }, []);

  useEffect(() => {
    // Sincronizar com localStorage
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "shared-data" && e.newValue) {
        setSharedData(e.newValue);
        setMessages((prev) => [...prev, `[${new Date().toLocaleTimeString()}] LocalStorage atualizado: ${e.newValue}`]);
        setHasSharedUpdate(true);
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const openNewTab = () => {
    const windowId = `tab-${Date.now()}`;
    const newTab = window.open("/playground", windowId);
    
    if (newTab) {
      windowRefs.current[windowId] = newTab;
      setWindows((prev) => [...prev, { id: windowId, type: "tab", opened: true }]);
      setMessages((prev) => [...prev, `[${new Date().toLocaleTimeString()}] Nova aba aberta: ${windowId}`]);

      // Enviar mensagem após carregar
      setTimeout(() => {
        newTab.postMessage(
          { type: "parent-message", message: `Conexão estabelecida com ${windowId}`, windowId },
          "*"
        );
      }, 1000);
    } else {
      setMessages((prev) => [...prev, `[${new Date().toLocaleTimeString()}] Popup bloqueado pelo navegador`]);
    }
  };

  const openPopup = () => {
    const windowId = `popup-${Date.now()}`;
    const popup = window.open(
      "/playground",
      windowId,
      "width=600,height=400,left=100,top=100,menubar=no,toolbar=no,location=no,status=no"
    );

    if (popup) {
      windowRefs.current[windowId] = popup;
      setWindows((prev) => [...prev, { id: windowId, type: "popup", opened: true }]);
      setMessages((prev) => [...prev, `[${new Date().toLocaleTimeString()}] Popup aberto: ${windowId}`]);

      setTimeout(() => {
        popup.postMessage(
          { type: "parent-message", message: `Popup ${windowId} conectado`, windowId },
          "*"
        );
      }, 1000);
    } else {
      setWindows((prev) => [...prev, { id: windowId, type: "popup", opened: false }]);
      setMessages((prev) => [...prev, `[${new Date().toLocaleTimeString()}] Popup bloqueado pelo navegador`]);
    }
  };

  const broadcastMessage = (message: string) => {
    let hasActiveWindow = false;
    Object.values(windowRefs.current).forEach((win) => {
      if (win && !win.closed) {
        hasActiveWindow = true;
        win.postMessage(
          { type: "parent-broadcast", message },
          "*"
        );
      }
    });
    setMessages((prev) => [...prev, `[${new Date().toLocaleTimeString()}] Broadcast: ${message}`]);
    if (!hasActiveWindow) {
      const loopback = `Resposta: ${message}`;
      setMessages((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${loopback}`]);
      setReceivedData((prev) => [...prev, loopback]);
    }
  };

  const updateSharedStorage = (data: string) => {
    localStorage.setItem("shared-data", data);
    setSharedData(data);
    if (data.trim()) {
      setHasSharedUpdate(true);
    }
    setMessages((prev) => [...prev, `[${new Date().toLocaleTimeString()}] LocalStorage atualizado: ${data}`]);
  };

  const closeAllWindows = () => {
    Object.values(windowRefs.current).forEach((win) => {
      if (win && !win.closed) {
        win.close();
      }
    });
    windowRefs.current = {};
    setWindows([]);
    setMessages((prev) => [...prev, `[${new Date().toLocaleTimeString()}] Todas as janelas fechadas`]);
  };

  const isDone = windows.length >= 1 && receivedData.length >= 1 && hasSharedUpdate;

  useEffect(() => {
    if (isComplete) reportedRef.current = true;
  }, [isComplete]);

  useEffect(() => {
    if (!reportedRef.current && isDone) {
      reportedRef.current = true;
      onComplete?.();
    }
  }, [isDone, onComplete]);

  useEffect(() => {
    return () => {
      // Cleanup: fechar todas as janelas ao desmontar
      Object.values(windowRefs.current).forEach((win) => {
        if (win && !win.closed) {
          win.close();
        }
      });
    };
  }, []);

  return (
    <div className="space-y-6" data-testid="section-multiplas-janelas">
      <Card>
        <CardHeader>
          <CardTitle>Multi-Window & Comunicação</CardTitle>
          <CardDescription>
            Abas, popups, postMessage e LocalStorage sync
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Window Management */}
          <div className="grid grid-cols-2 gap-3">
            <Button onClick={openNewTab} data-testid="open-new-tab">
              <ExternalLink className="w-4 h-4 mr-2" />
              Abrir Nova Aba
            </Button>
            <Button onClick={openPopup} variant="secondary" data-testid="open-popup">
              Abrir Popup
            </Button>
          </div>

          {/* Active Windows */}
          {windows.length > 0 && (
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <h4 className="text-sm font-medium text-white mb-2">Janelas Abertas ({windows.length})</h4>
              <div className="space-y-1" data-testid="windows-list">
                {windows.map((win, idx) => (
                  <div key={win.id} className="flex items-center justify-between text-xs text-[#BFBFBF]">
                    <span data-testid={`window-${idx}`}>
                      {win.type === "tab" ? "🌐" : "💬"} {win.id}
                    </span>
                    {win.opened ? (
                      <span className="text-green-400">✓ Ativa</span>
                    ) : (
                      <span className="text-yellow-400">⚠ Bloqueada</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Communication Controls */}
          <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30 space-y-3">
            <h4 className="text-sm font-medium text-blue-400">Comunicação entre Janelas</h4>
            <div className="flex gap-2">
              <Input
                placeholder="Mensagem para broadcast..."
                  value={broadcastText}
                  onChange={(e) => setBroadcastText(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter" && broadcastText.trim()) {
                      broadcastMessage(broadcastText.trim());
                      setBroadcastText("");
                  }
                }}
                data-testid="broadcast-input"
              />
              <Button
                size="sm"
                onClick={(e) => {
                    if (broadcastText.trim()) {
                      broadcastMessage(broadcastText.trim());
                      setBroadcastText("");
                  }
                }}
                data-testid="broadcast-button"
              >
                Enviar
              </Button>
            </div>
          </div>

          {/* LocalStorage Sync */}
          <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30 space-y-3">
            <h4 className="text-sm font-medium text-purple-400">LocalStorage Compartilhado</h4>
            <div className="flex gap-2">
              <Input
                value={sharedData}
                onChange={(e) => setSharedData(e.target.value)}
                placeholder="Dados compartilhados..."
                data-testid="shared-data-input"
              />
              <Button
                size="sm"
                onClick={() => updateSharedStorage(sharedData)}
                data-testid="update-storage"
              >
                Salvar
              </Button>
            </div>
            <p className="text-xs text-purple-400">
              Dados sincronizam automaticamente entre janelas
            </p>
          </div>

          {/* Message Log */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-white">Log de Eventos</h4>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setMessages([])}
                data-testid="clear-log"
              >
                Limpar
              </Button>
            </div>
            <div
              className="space-y-1 max-h-48 overflow-y-auto modal-scrollbar"
              data-testid="message-log"
            >
              {messages.length === 0 ? (
                <p className="text-xs text-[#BFBFBF] text-center py-4">Nenhum evento registrado</p>
              ) : (
                messages.slice(-10).reverse().map((msg, idx) => (
                  <div
                    key={idx}
                    className="text-xs text-white/80 font-mono p-2 rounded bg-white/5"
                    data-testid={`message-${idx}`}
                  >
                    {msg}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
              <p className="text-xs text-[#BFBFBF] mb-1">Janelas</p>
              <p className="text-lg font-bold text-[#FF6803]" data-testid="windows-count">
                {windows.length}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
              <p className="text-xs text-[#BFBFBF] mb-1">Mensagens</p>
              <p className="text-lg font-bold text-[#FF6803]" data-testid="messages-count">
                {messages.length}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
              <p className="text-xs text-[#BFBFBF] mb-1">Recebidas</p>
              <p className="text-lg font-bold text-[#FF6803]" data-testid="received-count">
                {receivedData.length}
              </p>
            </div>
          </div>

          {/* Close All */}
          {windows.length > 0 && (
            <Button
              onClick={closeAllWindows}
              variant="secondary"
              data-testid="close-all"
              className="w-full"
            >
              <X className="w-4 h-4 mr-2" />
              Fechar Todas as Janelas
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
