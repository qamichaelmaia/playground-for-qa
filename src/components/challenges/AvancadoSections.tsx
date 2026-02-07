"use client";

import { useState } from "react";
import { Button, Input, Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui";
import { Move, Lock, DollarSign, ExternalLink, CheckCircle2, AlertCircle, CreditCard, Globe } from "lucide-react";

// 12. DRAG & DROP
export function DragDropSection() {
  const initialItems = [
    { id: 1, text: "Item 1", zone: "source" },
    { id: 2, text: "Item 2", zone: "source" },
    { id: 3, text: "Item 3", zone: "source" },
  ];

  const [items, setItems] = useState(initialItems);
  const [draggedItem, setDraggedItem] = useState<number | null>(null);

  const handleDragStart = (id: number) => {
    setDraggedItem(id);
  };

  const handleDrop = (zone: string) => {
    if (draggedItem !== null) {
      setItems(
        items.map((item) =>
          item.id === draggedItem ? { ...item, zone } : item
        )
      );
      setDraggedItem(null);
    }
  };

  return (
    <div className="space-y-6" data-testid="section-drag-drop">
      <Card>
        <CardHeader>
          <CardTitle>Drag & Drop</CardTitle>
          <CardDescription>Arraste itens entre zonas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop("source")}
              className="p-6 rounded-xl bg-white/5 border-2 border-dashed border-white/20 min-h-[200px]"
              data-testid="drop-zone-source"
            >
              <h3 className="text-sm font-medium text-[#BFBFBF] mb-4">Zona Origem</h3>
              <div className="space-y-2">
                {items
                  .filter((item) => item.zone === "source")
                  .map((item) => (
                    <div
                      key={item.id}
                      draggable
                      onDragStart={() => handleDragStart(item.id)}
                      className="p-3 rounded-lg bg-white/10 cursor-move hover:bg-white/15 flex items-center gap-2"
                      data-testid={`draggable-${item.id}`}
                    >
                      <Move className="w-4 h-4 text-[#BFBFBF]" />
                      <span className="text-white">{item.text}</span>
                    </div>
                  ))}
              </div>
            </div>

            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop("target")}
              className="p-6 rounded-xl bg-[#FF6803]/5 border-2 border-dashed border-[#FF6803]/30 min-h-[200px]"
              data-testid="drop-zone-target"
            >
              <h3 className="text-sm font-medium text-[#FF6803] mb-4">Zona Destino</h3>
              <div className="space-y-2">
                {items
                  .filter((item) => item.zone === "target")
                  .map((item) => (
                    <div
                      key={item.id}
                      draggable
                      onDragStart={() => handleDragStart(item.id)}
                      className="p-3 rounded-lg bg-[#FF6803]/10 cursor-move hover:bg-[#FF6803]/15 flex items-center gap-2"
                      data-testid={`draggable-${item.id}`}
                    >
                      <Move className="w-4 h-4 text-[#FF6803]" />
                      <span className="text-white">{item.text}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
          <div className="mt-4 text-sm text-[#BFBFBF]" data-testid="drop-count">
            {items.filter((i) => i.zone === "target").length} item(s) na zona destino
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// 13. IFRAMES E SHADOW DOM
export function IframesShadowDOMSection() {
  const [iframeInput, setIframeInput] = useState("");
  const [iframeOutput, setIframeOutput] = useState("");

  return (
    <div className="space-y-6" data-testid="section-iframes">
      <Card>
        <CardHeader>
          <CardTitle>Iframe Integrado</CardTitle>
          <CardDescription>Interação com conteúdo em iframe</CardDescription>
        </CardHeader>
        <CardContent>
          <iframe
            srcDoc={`
              <!DOCTYPE html>
              <html>
                <head>
                  <style>
                    body { 
                      margin: 0; 
                      padding: 20px; 
                      font-family: system-ui; 
                      background: #2a2a2a;
                      color: white;
                    }
                    input {
                      width: 100%;
                      padding: 12px;
                      border: 1px solid rgba(255,255,255,0.12);
                      border-radius: 12px;
                      background: rgba(255,255,255,0.05);
                      color: white;
                      font-size: 14px;
                      margin-bottom: 12px;
                    }
                    button {
                      padding: 10px 20px;
                      border: none;
                      border-radius: 12px;
                      background: #FF6803;
                      color: white;
                      cursor: pointer;
                      font-size: 14px;
                      font-weight: 500;
                    }
                    button:hover {
                      background: #e55f03;
                    }
                    .output {
                      margin-top: 16px;
                      padding: 12px;
                      border-radius: 12px;
                      background: rgba(255,104,3,0.1);
                      border: 1px solid rgba(255,104,3,0.3);
                      color: #FF6803;
                    }
                  </style>
                </head>
                <body>
                  <h3>Conteúdo do Iframe</h3>
                  <input 
                    type="text" 
                    id="iframe-input" 
                    placeholder="Digite algo aqui..."
                    data-testid="iframe-input"
                  />
                  <button onclick="processInput()" data-testid="iframe-button">
                    Processar
                  </button>
                  <div class="output" id="output" data-testid="iframe-output" style="display:none;"></div>
                  
                  <script>
                    function processInput() {
                      const input = document.getElementById('iframe-input').value;
                      const output = document.getElementById('output');
                      output.textContent = 'Você digitou: ' + input;
                      output.style.display = 'block';
                    }
                  </script>
                </body>
              </html>
            `}
            className="w-full border border-white/12 rounded-xl"
            style={{ height: "250px" }}
            data-testid="test-iframe"
          />
        </CardContent>
      </Card>
    </div>
  );
}

// 14. INTEGRAÇÃO COM API REST
export function IntegracaoAPISection() {
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("https://jsonplaceholder.typicode.com/users/1");
      const data = await response.json();
      setUserData(data);
    } catch (err) {
      setError("Erro ao buscar dados");
    }
    setIsLoading(false);
  };

  return (
    <div className="space-y-6" data-testid="section-api-rest">
      <Card>
        <CardHeader>
          <CardTitle>Requisições API</CardTitle>
          <CardDescription>Fetch de dados externos</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={fetchUser} isLoading={isLoading} data-testid="fetch-user">
            Buscar Usuário
          </Button>

          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400" data-testid="api-error">
              {error}
            </div>
          )}

          {userData && (
            <div className="p-4 rounded-xl bg-white/5 border border-white/12" data-testid="user-data">
              <h3 className="font-medium text-white mb-2">{userData.name}</h3>
              <p className="text-sm text-[#BFBFBF]" data-testid="user-email">{userData.email}</p>
              <p className="text-sm text-[#BFBFBF]" data-testid="user-phone">{userData.phone}</p>
              <p className="text-sm text-[#BFBFBF]" data-testid="user-website">{userData.website}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// 15. AUTENTICAÇÃO E SESSÕES
export function AutenticacaoSessoesSection() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [sessionData, setSessionData] = useState<any>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (credentials.email === "admin@test.com" && credentials.password === "senha123") {
      setIsLoggedIn(true);
      setError("");
      setSessionData({
        user: "Administrador",
        token: "abc123xyz",
        loginTime: new Date().toLocaleString(),
      });
    } else {
      setError("Credenciais inválidas");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setSessionData(null);
    setCredentials({ email: "", password: "" });
  };

  return (
    <div className="space-y-6" data-testid="section-autenticacao">
      <Card>
        <CardHeader>
          <CardTitle>Sistema de Login</CardTitle>
          <CardDescription>Autenticação com sessão</CardDescription>
        </CardHeader>
        <CardContent>
          {!isLoggedIn ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                label="Email"
                type="email"
                value={credentials.email}
                onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                placeholder="admin@test.com"
                data-testid="login-email"
              />
              <Input
                label="Senha"
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                placeholder="senha123"
                data-testid="login-password"
              />
              {error && (
                <div className="text-sm text-red-400" data-testid="login-error">
                  {error}
                </div>
              )}
              <Button type="submit" data-testid="login-button">
                <Lock className="w-4 h-4 mr-2" />
                Entrar
              </Button>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-green-400 mb-4" data-testid="login-status">
                <CheckCircle2 className="w-5 h-5" />
                <span>Login realizado com sucesso!</span>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/12" data-testid="session-info">
                <p className="text-sm text-white mb-1">
                  <strong>Usuário:</strong> {sessionData?.user}
                </p>
                <p className="text-sm text-white mb-1">
                  <strong>Token:</strong> {sessionData?.token}
                </p>
                <p className="text-sm text-white">
                  <strong>Login:</strong> {sessionData?.loginTime}
                </p>
              </div>
              <Button onClick={handleLogout} variant="secondary" data-testid="logout-button">
                Sair
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// 16. SIMULAÇÃO DE PAGAMENTOS
export function SimulacaoPagamentosSection() {
  const [cardNumber, setCardNumber] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "success" | "failed">("idle");

  const formatCardNumber = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    return numbers.replace(/(.{4})/g, "$1 ").trim().slice(0, 19);
  };

  const processPayment = () => {
    setPaymentStatus("processing");
    setTimeout(() => {
      if (cardNumber.replace(/\s/g, "").length === 16) {
        setPaymentStatus("success");
      } else {
        setPaymentStatus("failed");
      }
    }, 2000);
  };

  return (
    <div className="space-y-6" data-testid="section-pagamentos">
      <Card>
        <CardHeader>
          <CardTitle>Gateway de Pagamento</CardTitle>
          <CardDescription>Simulação de transação</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {paymentStatus === "idle" || paymentStatus === "failed" ? (
            <>
              <Input
                label="Número do Cartão"
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                placeholder="1234 5678 9012 3456"
                data-testid="card-number"
              />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Validade" placeholder="MM/AA" data-testid="card-expiry" />
                <Input label="CVV" placeholder="123" type="password" data-testid="card-cvv" />
              </div>
              {paymentStatus === "failed" && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400" data-testid="payment-failed">
                  <AlertCircle className="w-4 h-4" />
                  <span>Pagamento rejeitado. Verifique os dados.</span>
                </div>
              )}
              <Button onClick={processPayment} data-testid="pay-button">
                <CreditCard className="w-4 h-4 mr-2" />
                Pagar R$ 100,00
              </Button>
            </>
          ) : paymentStatus === "processing" ? (
            <div className="text-center py-8" data-testid="payment-processing">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF6803]"></div>
              <p className="mt-4 text-[#BFBFBF]">Processando pagamento...</p>
            </div>
          ) : (
            <div className="text-center py-8" data-testid="payment-success">
              <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-white mb-2">Pagamento aprovado!</p>
              <p className="text-sm text-[#BFBFBF]">ID da transação: TXN-{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
              <Button
                variant="secondary"
                onClick={() => {
                  setPaymentStatus("idle");
                  setCardNumber("");
                }}
                className="mt-4"
                data-testid="new-payment-button"
              >
                Nova Transação
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// 17. MÚLTIPLAS JANELAS E ABAS
export function MultiJanelasAbasSection() {
  const [popupOpen, setPopupOpen] = useState(false);

  const openNewTab = () => {
    window.open("/playground", "_blank");
  };

  const openPopup = () => {
    const popup = window.open(
      "/playground",
      "popup",
      "width=600,height=400,left=100,top=100"
    );
    setPopupOpen(true);
  };

  return (
    <div className="space-y-6" data-testid="section-multiplas-janelas">
      <Card>
        <CardHeader>
          <CardTitle>Gerenciamento de Janelas</CardTitle>
          <CardDescription>Abas e popups</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={openNewTab} data-testid="open-new-tab">
            <ExternalLink className="w-4 h-4 mr-2" />
            Abrir Nova Aba
          </Button>
          <Button onClick={openPopup} variant="secondary" data-testid="open-popup">
            Abrir Popup
          </Button>
          {popupOpen && (
            <div className="text-sm text-green-400" data-testid="popup-indicator">
              Popup aberto
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
