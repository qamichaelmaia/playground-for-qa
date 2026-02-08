"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Button, Input, Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui";
import { Zap, TrendingUp, Eye, Globe2, Code, Database, ShoppingCart, Loader2, Package, CheckCircle2, AlertCircle, Infinity, Activity, ChevronDown } from "lucide-react";

type SectionCompletionProps = {
  onComplete?: () => void;
  isComplete?: boolean;
};

type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
  stock: number;
};

// 18. CONTEÚDO DINÂMICO - Infinite Scroll + Virtual List + Lazy Loading
export function ConteudoDinamicoSection({ onComplete, isComplete }: SectionCompletionProps) {
  const [items, setItems] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 20 });
  const [liveUpdates, setLiveUpdates] = useState<string[]>([]);
  const [hasInteracted, setHasInteracted] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastItemRef = useRef<HTMLDivElement | null>(null);
  const pollInterval = useRef<NodeJS.Timeout | null>(null);
  const reportedRef = useRef(false);

  const generateProducts = (page: number, count: number = 20): Product[] => {
    return Array.from({ length: count }, (_, i) => {
      const id = (page - 1) * count + i + 1;
      return {
        id,
        name: `Produto ${id}`,
        price: Math.random() * 1000 + 50,
        category: ["Eletrônicos", "Livros", "Roupas", "Alimentos"][Math.floor(Math.random() * 4)],
        stock: Math.floor(Math.random() * 100),
      };
    });
  };

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    setLiveUpdates((prev) => [...prev, `Carregando página ${page}...`]);

    // Simular API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newProducts = generateProducts(page);
    setItems((prev) => [...prev, ...newProducts]);
    setPage((prev) => prev + 1);

    if (page >= 10) {
      setHasMore(false);
      setLiveUpdates((prev) => [...prev, "Fim da lista alcançado"]);
    }

    setIsLoading(false);
  }, [page, isLoading, hasMore]);

  useEffect(() => {
    loadMore();
  }, []);

  useEffect(() => {
    // Intersection Observer para infinite scroll
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !isLoading) {
        loadMore();
      }
    }, { threshold: 1.0 });

    observerRef.current = observer;

    return () => observer.disconnect();
  }, [loadMore, hasMore, isLoading]);

  useEffect(() => {
    if (lastItemRef.current && observerRef.current) {
      observerRef.current.observe(lastItemRef.current);
    }
  }, [items.length]);

  useEffect(() => {
    // Polling para simular atualizações em tempo real
    pollInterval.current = setInterval(() => {
      const randomUpdate = [
        "Novo produto adicionado ao catálogo",
        "Preço atualizado em tempo real",
        "Estoque modificado",
        "Categoria reorganizada",
      ][Math.floor(Math.random() * 4)];
      setLiveUpdates((prev) => [...prev.slice(-9), randomUpdate]);
    }, 5000);

    return () => {
      if (pollInterval.current) clearInterval(pollInterval.current);
    };
  }, []);

  const isDone = hasInteracted && items.length >= 40 && liveUpdates.length >= 3;

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
    <div className="space-y-6" data-testid="section-conteudo-dinamico">
      <Card>
        <CardHeader>
          <CardTitle>
            <Infinity className="w-5 h-5 inline mr-2" />
            Conteúdo Dinâmico Avançado
          </CardTitle>
          <CardDescription>
            Infinite Scroll + Virtual List + Lazy Loading + Polling em Tempo Real
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
              <p className="text-xs text-[#BFBFBF] mb-1">Itens Carregados</p>
              <p className="text-lg font-bold text-[#FF6803]" data-testid="items-count">
                {items.length}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
              <p className="text-xs text-[#BFBFBF] mb-1">Página Atual</p>
              <p className="text-lg font-bold text-[#FF6803]" data-testid="current-page">
                {page - 1}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
              <p className="text-xs text-[#BFBFBF] mb-1">Atualizações</p>
              <p className="text-lg font-bold text-[#FF6803]" data-testid="updates-count">
                {liveUpdates.length}
              </p>
            </div>
          </div>

          {/* Live Updates Stream */}
          {liveUpdates.length > 0 && (
            <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-blue-400 animate-pulse" />
                <h4 className="text-sm font-medium text-blue-400">Atualizações em Tempo Real</h4>
              </div>
              <div className="space-y-1 max-h-24 overflow-y-auto modal-scrollbar" data-testid="live-updates">
                {liveUpdates.slice(-5).map((update, idx) => (
                  <p key={idx} className="text-xs text-blue-300" data-testid={`update-${idx}`}>
                    • {update}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Virtual List with Infinite Scroll */}
          <div className="border border-white/10 rounded-xl">
            <div className="p-3 bg-white/5 border-b border-white/10">
              <h4 className="text-sm font-medium text-white">Lista Virtual de Produtos (Infinite Scroll)</h4>
            </div>
            <div
              className="max-h-96 overflow-y-auto modal-scrollbar"
              data-testid="virtual-list"
              onScroll={() => setHasInteracted(true)}
            >
              <div className="p-4 space-y-2">
                {items.map((product, index) => (
                  <div
                    key={product.id}
                    ref={index === items.length - 1 ? lastItemRef : null}
                    className="p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                    data-testid={`product-${product.id}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h5 className="text-sm font-medium text-white">{product.name}</h5>
                        <p className="text-xs text-[#BFBFBF]">{product.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-[#FF6803]">
                          R$ {product.price.toFixed(2)}
                        </p>
                        <p className="text-xs text-[#BFBFBF]">Est: {product.stock}</p>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Loading Indicator */}
                {isLoading && (
                  <div className="p-6 text-center" data-testid="loading-indicator">
                    <Loader2 className="w-6 h-6 text-[#FF6803] mx-auto animate-spin mb-2" />
                    <p className="text-sm text-[#BFBFBF]">Carregando mais itens...</p>
                  </div>
                )}

                {/* End of List */}
                {!hasMore && (
                  <div className="p-6 text-center" data-testid="end-of-list">
                    <CheckCircle2 className="w-6 h-6 text-green-400 mx-auto mb-2" />
                    <p className="text-sm text-green-400">Todos os itens foram carregados!</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <Button
            onClick={() => {
              setHasInteracted(true);
              loadMore();
            }}
            disabled={isLoading || !hasMore}
            data-testid="load-more-manual"
            variant="secondary"
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Carregando...
              </>
            ) : hasMore ? (
              "Carregar Mais Itens"
            ) : (
              "Fim da Lista"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// 19. TESTES E2E COMPLETOS
export function TestesE2ESection({ onComplete, isComplete }: SectionCompletionProps) {
  const steps = [
    "Cadastro",
    "Login",
    "Catálogo",
    "Carrinho",
    "Checkout",
    "Revisão",
    "Confirmação",
  ];

  const products: Product[] = [
    { id: 1, name: "Curso Playwright", price: 299.9, category: "Educação", stock: 5 },
    { id: 2, name: "Livro QA Avançado", price: 159.9, category: "Livros", stock: 3 },
    { id: 3, name: "Kit Automação", price: 499.0, category: "Ferramentas", stock: 2 },
    { id: 4, name: "Assinatura Pro", price: 89.9, category: "Serviços", stock: 10 },
  ];

  const [workflow, setWorkflow] = useState<string[]>([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);
  const [registeredUser, setRegisteredUser] = useState<{ name: string; email: string; password: string } | null>(null);
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [cart, setCart] = useState<{ id: number; qty: number }[]>([]);
  const [coupon, setCoupon] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [shipping, setShipping] = useState({ zip: "", address: "", method: "standard" });
  const [payment, setPayment] = useState({
    method: "card",
    cardNumber: "",
    expiry: "",
    cvv: "",
    pixKey: "",
    threeDS: "",
  });
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isShippingOpen, setIsShippingOpen] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const reportedRef = useRef(false);

  const categoryOptions = [
    { value: "all", label: "Todas" },
    { value: "Educação", label: "Educação" },
    { value: "Livros", label: "Livros" },
    { value: "Ferramentas", label: "Ferramentas" },
    { value: "Serviços", label: "Serviços" },
  ];

  const shippingOptions = [
    { value: "standard", label: "Standard (R$ 14,90)" },
    { value: "express", label: "Express (R$ 29,90)" },
  ];

  const addLog = (message: string) => {
    setWorkflow((prev) => [...prev, message]);
  };

  const resetFlow = () => {
    setWorkflow([]);
    setStepIndex(0);
    setErrors([]);
    setRegisteredUser(null);
    setRegisterData({ name: "", email: "", password: "", confirmPassword: "", terms: false });
    setLoginData({ email: "", password: "" });
    setIsLoggedIn(false);
    setSearch("");
    setCategory("all");
    setSelectedProductId(null);
    setCart([]);
    setCoupon("");
    setCouponDiscount(0);
    setShipping({ zip: "", address: "", method: "standard" });
    setPayment({ method: "card", cardNumber: "", expiry: "", cvv: "", pixKey: "", threeDS: "" });
    setOrderId(null);
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "all" || product.category === category;
    return matchesSearch && matchesCategory;
  });

  const cartItems = cart.map((item) => {
    const product = products.find((p) => p.id === item.id);
    return product ? { ...product, qty: item.qty } : null;
  }).filter(Boolean) as Array<Product & { qty: number }>;

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const discountValue = subtotal * (couponDiscount / 100);
  const shippingFee = shipping.method === "express" ? 29.9 : 14.9;
  const total = Math.max(0, subtotal - discountValue + shippingFee);

  const validateRegister = () => {
    const validationErrors: string[] = [];

    if (registerData.name.trim().length < 3) validationErrors.push("Nome completo inválido");
    if (!registerData.email.includes("@")) validationErrors.push("Email inválido");
    if (registerData.email === "existing@qa.com") validationErrors.push("Email já cadastrado");
    if (registerData.password.length < 8) validationErrors.push("Senha fraca (mínimo 8 caracteres)");
    if (registerData.password !== registerData.confirmPassword) validationErrors.push("Senhas não coincidem");
    if (!registerData.terms) validationErrors.push("Aceite os termos para continuar");

    setErrors(validationErrors);
    return validationErrors.length === 0;
  };

  const handleRegister = () => {
    if (!validateRegister()) return;

    setRegisteredUser({
      name: registerData.name,
      email: registerData.email,
      password: registerData.password,
    });
    addLog("Cadastro concluído com sucesso");
    setStepIndex(1);
  };

  const handleLogin = () => {
    const validationErrors: string[] = [];

    if (!registeredUser) {
      validationErrors.push("Nenhum usuário cadastrado");
    } else {
      if (loginData.email !== registeredUser.email) validationErrors.push("Email inválido");
      if (loginData.password !== registeredUser.password) validationErrors.push("Senha incorreta");
    }

    setErrors(validationErrors);
    if (validationErrors.length > 0) return;

    setIsLoggedIn(true);
    addLog("Login realizado com sucesso");
    setStepIndex(2);
  };

  const addToCart = (id: number) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === id);
      if (existing) {
        return prev.map((item) => item.id === id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { id, qty: 1 }];
    });
    addLog(`Produto ${id} adicionado ao carrinho`);
  };

  const updateQty = (id: number, qty: number) => {
    setCart((prev) => prev.map((item) => item.id === id ? { ...item, qty } : item));
  };

  const removeItem = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
    addLog(`Produto ${id} removido do carrinho`);
  };

  const applyCoupon = () => {
    if (coupon === "QA10") {
      setCouponDiscount(10);
      addLog("Cupom QA10 aplicado");
      setErrors([]);
    } else if (coupon) {
      setCouponDiscount(0);
      setErrors(["Cupom inválido"]);
    }
  };

  const validateShipping = () => {
    const validationErrors: string[] = [];
    if (shipping.zip !== "01310-000") validationErrors.push("CEP inválido ou não encontrado");
    if (!shipping.address) validationErrors.push("Endereço obrigatório");
    setErrors(validationErrors);
    return validationErrors.length === 0;
  };

  const validatePayment = () => {
    const validationErrors: string[] = [];
    if (payment.method === "card") {
      if (payment.cardNumber !== "4111 1111 1111 1111") validationErrors.push("Número do cartão inválido");
      if (payment.expiry.length !== 5) validationErrors.push("Validade inválida");
      if (payment.cvv.length !== 3) validationErrors.push("CVV inválido");
      if (total > 500 && payment.threeDS !== "123456") validationErrors.push("3DS inválido");
    }
    if (payment.method === "pix" && payment.pixKey.length < 5) validationErrors.push("Chave PIX inválida");
    setErrors(validationErrors);
    return validationErrors.length === 0;
  };

  const proceedFromCatalog = () => {
    if (cart.length === 0) {
      setErrors(["Adicione ao menos um produto ao carrinho"]);
      return;
    }
    setErrors([]);
    addLog("Carrinho criado");
    setStepIndex(3);
  };

  const proceedFromCart = () => {
    if (cart.length === 0) {
      setErrors(["Carrinho vazio"]);
      return;
    }
    setErrors([]);
    addLog("Carrinho revisado");
    setStepIndex(4);
  };

  const proceedFromCheckout = () => {
    if (!validateShipping() || !validatePayment()) return;
    addLog("Checkout concluído");
    setStepIndex(5);
  };

  const confirmOrder = () => {
    const id = `ORD-${Date.now()}`;
    setOrderId(id);
    addLog("Pedido confirmado");
    setStepIndex(6);
    if (!reportedRef.current) {
      reportedRef.current = true;
      onComplete?.();
    }
  };

  const isDone = orderId !== null && workflow.includes("Pedido confirmado");

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
    <div className="space-y-6" data-testid="section-e2e">
      <Card>
        <CardHeader>
          <CardTitle>
            <ShoppingCart className="w-5 h-5 inline mr-2" />
            Fluxo E2E Completo
          </CardTitle>
          <CardDescription>
            Cadastro → Login → Catálogo → Carrinho → Checkout → Revisão → Confirmação
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-[#BFBFBF]">
              Etapa atual:
              <span className="text-[#FF6803] font-medium" data-testid="current-step">
                {steps[stepIndex]}
              </span>
            </div>
            <Button size="sm" variant="secondary" onClick={resetFlow} data-testid="reset-e2e">
              Reiniciar Fluxo
            </Button>
          </div>

          {workflow.length > 0 && (
            <div className="space-y-2 p-4 rounded-xl bg-white/5 border border-white/10" data-testid="workflow-log">
              {workflow.slice(-6).map((step, index) => (
                <div key={`${step}-${index}`} className="flex items-center gap-2 text-sm">
                  <div className="w-5 h-5 rounded-full bg-[#FF6803]/20 border border-[#FF6803] flex items-center justify-center text-[10px] text-[#FF6803]">
                    {workflow.length - (workflow.slice(-6).length - index - 1)}
                  </div>
                  <span className="text-white">{step}</span>
                </div>
              ))}
            </div>
          )}

          {errors.length > 0 && (
            <div className="space-y-1 p-3 rounded-xl bg-red-500/10 border border-red-500/30" data-testid="e2e-errors">
              {errors.map((error, idx) => (
                <div key={idx} className="text-sm text-red-400 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              ))}
            </div>
          )}

          {stepIndex === 0 && (
            <div className="space-y-3" data-testid="step-register">
              <Input
                label="Nome Completo"
                value={registerData.name}
                onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                data-testid="e2e-register-name"
              />
              <Input
                label="Email"
                type="email"
                value={registerData.email}
                onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                placeholder="novo@qa.com"
                data-testid="e2e-register-email"
              />
              <Input
                label="Senha"
                type="password"
                value={registerData.password}
                onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                data-testid="e2e-register-password"
              />
              <Input
                label="Confirmar Senha"
                type="password"
                value={registerData.confirmPassword}
                onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                data-testid="e2e-register-confirm"
              />
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={registerData.terms}
                  onChange={(e) => setRegisterData({ ...registerData, terms: e.target.checked })}
                  className="w-4 h-4 rounded border-white/20 bg-white/5 text-[#FF6803]"
                  data-testid="e2e-register-terms"
                />
                <span className="text-sm text-white">Aceito os termos</span>
              </label>
              <Button onClick={handleRegister} data-testid="e2e-register-submit">
                Finalizar Cadastro
              </Button>
            </div>
          )}

          {stepIndex === 1 && (
            <div className="space-y-3" data-testid="step-login">
              <Input
                label="Email"
                type="email"
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                data-testid="e2e-login-email"
              />
              <Input
                label="Senha"
                type="password"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                data-testid="e2e-login-password"
              />
              <Button onClick={handleLogin} data-testid="e2e-login-submit">
                Entrar
              </Button>
            </div>
          )}

          {stepIndex === 2 && (
            <div className="space-y-3" data-testid="step-catalog">
              <div className="grid md:grid-cols-2 gap-3">
                <Input
                  label="Buscar"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  data-testid="e2e-search"
                />
                <div className="relative z-30">
                  <label className="text-sm font-medium text-white block mb-2">Categoria</label>
                  <div className="relative">
                    <button
                      onClick={() => setIsCategoryOpen((prev) => !prev)}
                      className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white/5 border border-white/12 text-white hover:border-white/20 transition-colors"
                      data-testid="e2e-category"
                      aria-expanded={isCategoryOpen}
                    >
                      <span className={category ? "text-white" : "text-[#BFBFBF]"}>
                        {categoryOptions.find((option) => option.value === category)?.label || "Selecione"}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${isCategoryOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                    {isCategoryOpen && (
                      <div
                        className="absolute top-full left-0 right-0 mt-2 py-2 rounded-xl bg-[#1a1a1a] border border-white/12 shadow-xl z-[60] max-h-60 overflow-y-auto"
                        data-testid="e2e-category-menu"
                      >
                        {categoryOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => {
                              setCategory(option.value);
                              setIsCategoryOpen(false);
                            }}
                            className={`w-full px-4 py-2 text-left transition-colors ${
                              category === option.value
                                ? "text-[#FF6803] bg-white/5"
                                : "text-[#BFBFBF] hover:text-white hover:bg-white/5"
                            }`}
                            data-testid={`e2e-category-${option.value}`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-3" data-testid="e2e-product-list">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-white">{product.name}</p>
                        <p className="text-xs text-[#BFBFBF]">{product.category}</p>
                        <p className="text-xs text-[#BFBFBF]">Estoque: {product.stock}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-[#FF6803]">R$ {product.price.toFixed(2)}</p>
                        <Button
                          size="sm"
                          onClick={() => addToCart(product.id)}
                          data-testid={`e2e-add-${product.id}`}
                        >
                          Adicionar
                        </Button>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => setSelectedProductId(product.id)}
                      className="mt-2 w-full"
                      data-testid={`e2e-details-${product.id}`}
                    >
                      Ver detalhes
                    </Button>
                  </div>
                ))}
              </div>

              {selectedProductId && (
                <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30" data-testid="e2e-product-details">
                  <p className="text-sm text-blue-400">
                    Detalhes do produto ID: {selectedProductId}
                  </p>
                </div>
              )}

              <Button onClick={proceedFromCatalog} data-testid="e2e-to-cart" className="w-full">
                Ir para o carrinho
              </Button>
            </div>
          )}

          {stepIndex === 3 && (
            <div className="space-y-3" data-testid="step-cart">
              {cartItems.length === 0 ? (
                <div className="text-sm text-[#BFBFBF]">Carrinho vazio</div>
              ) : (
                <div className="space-y-2">
                  {cartItems.map((item) => (
                    <div key={item.id} className="p-3 rounded-xl bg-white/5 border border-white/10">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-white">{item.name}</p>
                          <p className="text-xs text-[#BFBFBF]">R$ {item.price.toFixed(2)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Input
                            value={String(item.qty)}
                            onChange={(e) => updateQty(item.id, Number(e.target.value) || 1)}
                            data-testid={`e2e-qty-${item.id}`}
                          />
                          <Button size="sm" variant="secondary" onClick={() => removeItem(item.id)} data-testid={`e2e-remove-${item.id}`}>
                            Remover
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-2">
                <Input
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                  placeholder="QA10"
                  data-testid="e2e-coupon"
                />
                <Button onClick={applyCoupon} variant="secondary" data-testid="e2e-coupon-apply">
                  Aplicar
                </Button>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="flex justify-between text-sm text-[#BFBFBF]">
                  <span>Subtotal</span>
                  <span>R$ {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-[#BFBFBF]">
                  <span>Desconto</span>
                  <span>R$ {discountValue.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-[#BFBFBF]">
                  <span>Frete</span>
                  <span>R$ {shippingFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-white font-medium">
                  <span>Total</span>
                  <span>R$ {total.toFixed(2)}</span>
                </div>
              </div>

              <Button onClick={proceedFromCart} data-testid="e2e-to-checkout" className="w-full">
                Ir para checkout
              </Button>
            </div>
          )}

          {stepIndex === 4 && (
            <div className="space-y-4" data-testid="step-checkout">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                <h4 className="text-sm font-medium text-white">Entrega</h4>
                <Input
                  label="CEP"
                  value={shipping.zip}
                  onChange={(e) => setShipping({ ...shipping, zip: e.target.value })}
                  placeholder="01310-000"
                  data-testid="e2e-zip"
                />
                <Input
                  label="Endereço"
                  value={shipping.address}
                  onChange={(e) => setShipping({ ...shipping, address: e.target.value })}
                  placeholder="Av. Paulista, 1000"
                  data-testid="e2e-address"
                />
                <div className="relative z-30">
                  <label className="text-sm font-medium text-white block mb-2">Método de envio</label>
                  <div className="relative">
                    <button
                      onClick={() => setIsShippingOpen((prev) => !prev)}
                      className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white/5 border border-white/12 text-white hover:border-white/20 transition-colors"
                      data-testid="e2e-shipping-method"
                      aria-expanded={isShippingOpen}
                    >
                      <span className="text-white">
                        {shippingOptions.find((option) => option.value === shipping.method)?.label}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${isShippingOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                    {isShippingOpen && (
                      <div
                        className="absolute top-full left-0 right-0 mt-2 py-2 rounded-xl bg-[#1a1a1a] border border-white/12 shadow-xl z-[60]"
                        data-testid="e2e-shipping-menu"
                      >
                        {shippingOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => {
                              setShipping({ ...shipping, method: option.value });
                              setIsShippingOpen(false);
                            }}
                            className={`w-full px-4 py-2 text-left transition-colors ${
                              shipping.method === option.value
                                ? "text-[#FF6803] bg-white/5"
                                : "text-[#BFBFBF] hover:text-white hover:bg-white/5"
                            }`}
                            data-testid={`e2e-shipping-${option.value}`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                <h4 className="text-sm font-medium text-white">Pagamento</h4>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    size="sm"
                    variant={payment.method === "card" ? "primary" : "secondary"}
                    onClick={() => setPayment({ ...payment, method: "card" })}
                    data-testid="e2e-payment-card"
                  >
                    Cartão
                  </Button>
                  <Button
                    size="sm"
                    variant={payment.method === "pix" ? "primary" : "secondary"}
                    onClick={() => setPayment({ ...payment, method: "pix" })}
                    data-testid="e2e-payment-pix"
                  >
                    PIX
                  </Button>
                </div>

                {payment.method === "card" ? (
                  <div className="space-y-2">
                    <Input
                      label="Número do cartão"
                      value={payment.cardNumber}
                      onChange={(e) => setPayment({ ...payment, cardNumber: e.target.value })}
                      placeholder="4111 1111 1111 1111"
                      data-testid="e2e-card-number"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        label="Validade"
                        value={payment.expiry}
                        onChange={(e) => setPayment({ ...payment, expiry: e.target.value })}
                        placeholder="12/29"
                        data-testid="e2e-card-expiry"
                      />
                      <Input
                        label="CVV"
                        value={payment.cvv}
                        onChange={(e) => setPayment({ ...payment, cvv: e.target.value })}
                        placeholder="123"
                        data-testid="e2e-card-cvv"
                      />
                    </div>
                    {total > 500 && (
                      <Input
                        label="3DS"
                        value={payment.threeDS}
                        onChange={(e) => setPayment({ ...payment, threeDS: e.target.value })}
                        placeholder="123456"
                        data-testid="e2e-card-3ds"
                      />
                    )}
                  </div>
                ) : (
                  <Input
                    label="Chave PIX"
                    value={payment.pixKey}
                    onChange={(e) => setPayment({ ...payment, pixKey: e.target.value })}
                    placeholder="chave@pix.com"
                    data-testid="e2e-pix-key"
                  />
                )}
              </div>

              <Button onClick={proceedFromCheckout} data-testid="e2e-to-review" className="w-full">
                Ir para revisão
              </Button>
            </div>
          )}

          {stepIndex === 5 && (
            <div className="space-y-3" data-testid="step-review">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <h4 className="text-sm font-medium text-white mb-2">Resumo do Pedido</h4>
                <div className="text-xs text-[#BFBFBF] space-y-1">
                  <p>Itens: {cartItems.length}</p>
                  <p>Entrega: {shipping.address || "-"}</p>
                  <p>Pagamento: {payment.method === "card" ? "Cartão" : "PIX"}</p>
                  <p>Total: R$ {total.toFixed(2)}</p>
                </div>
              </div>
              <Button onClick={confirmOrder} data-testid="e2e-confirm-order" className="w-full">
                Confirmar Pedido
              </Button>
            </div>
          )}

          {stepIndex === 6 && (
            <div className="space-y-3 text-center" data-testid="step-confirmation">
              <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto" />
              <p className="text-white font-medium">Pedido confirmado com sucesso!</p>
              <p className="text-sm text-[#BFBFBF]" data-testid="order-id">
                ID do pedido: {orderId}
              </p>
            </div>
          )}

          <div className="flex justify-between">
            <Button
              variant="secondary"
              disabled={stepIndex === 0}
              onClick={() => setStepIndex((prev) => Math.max(0, prev - 1))}
              data-testid="e2e-back"
            >
              Voltar
            </Button>
            <div className="text-xs text-[#BFBFBF]">
              Status: {isLoggedIn ? "Sessão ativa" : "Sessão inativa"}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// 20. TESTES DE PERFORMANCE
export function TestesPerformanceSection({ onComplete, isComplete }: SectionCompletionProps) {
  const [loadTime, setLoadTime] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [memoryUsage, setMemoryUsage] = useState<string>("");
  const reportedRef = useRef(false);

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

  useEffect(() => {
    if (isComplete) {
      reportedRef.current = true;
    }
  }, [isComplete]);

  useEffect(() => {
    if (!reportedRef.current && loadTime !== null) {
      reportedRef.current = true;
      onComplete?.();
    }
  }, [loadTime, onComplete]);

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
export function TestesAcessibilidadeSection({ onComplete, isComplete }: SectionCompletionProps) {
  const [focusedElement, setFocusedElement] = useState("");
  const [ariaLiveMessage, setAriaLiveMessage] = useState("");
  const [hasFocused, setHasFocused] = useState(false);
  const [hasAnnounced, setHasAnnounced] = useState(false);
  const [accessibleSelectValue, setAccessibleSelectValue] = useState("Opção 1");
  const [isAccessibleSelectOpen, setIsAccessibleSelectOpen] = useState(false);
  const reportedRef = useRef(false);

  const accessibleOptions = ["Opção 1", "Opção 2", "Opção 3"];

  const announceMessage = (message: string) => {
    setAriaLiveMessage(message);
    setTimeout(() => setAriaLiveMessage(""), 3000);
    setHasAnnounced(true);
  };

  const isDone = hasFocused && hasAnnounced;

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
              onFocus={() => {
                setFocusedElement("Botão 1");
                setHasFocused(true);
              }}
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
              onFocus={() => {
                setFocusedElement("Input");
                setHasFocused(true);
              }}
            />
            <p id="input-help" className="text-xs text-[#BFBFBF]">
              Este campo possui descrição ARIA
            </p>

            <div className="relative z-30">
              <button
                type="button"
                aria-label="Seleção acessível"
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white/5 border border-white/12 text-white hover:border-white/20 transition-colors"
                data-testid="accessible-select"
                aria-expanded={isAccessibleSelectOpen}
                onClick={() => setIsAccessibleSelectOpen((prev) => !prev)}
                onFocus={() => {
                  setFocusedElement("Select");
                  setHasFocused(true);
                }}
              >
                <span className="text-white">{accessibleSelectValue}</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${isAccessibleSelectOpen ? "rotate-180" : ""}`}
                />
              </button>
              {isAccessibleSelectOpen && (
                <div
                  className="absolute top-full left-0 right-0 mt-2 py-2 rounded-xl bg-[#1a1a1a] border border-white/12 shadow-xl z-[60]"
                  data-testid="accessible-select-menu"
                >
                  {accessibleOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => {
                        setAccessibleSelectValue(option);
                        setIsAccessibleSelectOpen(false);
                      }}
                      className={`w-full px-4 py-2 text-left transition-colors ${
                        accessibleSelectValue === option
                          ? "text-[#FF6803] bg-white/5"
                          : "text-[#BFBFBF] hover:text-white hover:bg-white/5"
                      }`}
                      data-testid={`accessible-option-${option.toLowerCase().replace(" ", "-")}`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div
              tabIndex={0}
              role="button"
              aria-pressed="false"
              className="p-3 rounded-xl bg-white/5 border border-white/12 cursor-pointer hover:bg-white/10 focus:border-[#FF6803] focus:outline-none focus:ring-2 focus:ring-[#FF6803]/50"
              data-testid="focusable-div"
              onFocus={() => {
                setFocusedElement("Div Focável");
                setHasFocused(true);
              }}
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
export function TestesInternacionalizacaoSection({ onComplete, isComplete }: SectionCompletionProps) {
  const [locale, setLocale] = useState("pt-BR");
  const [currency, setCurrency] = useState(1234.56);
  const reportedRef = useRef(false);

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

  const isDone = locale !== "pt-BR";

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
export function IntegracaoGraphQLSection({ onComplete, isComplete }: SectionCompletionProps) {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const reportedRef = useRef(false);

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
        name: "Michael Maia",
        email: "michael@exemplo.com",
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

  useEffect(() => {
    if (isComplete) {
      reportedRef.current = true;
    }
  }, [isComplete]);

  useEffect(() => {
    if (!reportedRef.current && result) {
      reportedRef.current = true;
      onComplete?.();
    }
  }, [result, onComplete]);

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
              className="w-full h-32 px-4 py-3 rounded-xl bg-white/5 border border-white/12 text-white font-mono text-sm placeholder:text-[#BFBFBF] focus:border-[#FF6803] focus:outline-none resize-none modal-scrollbar"
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
              <pre className="text-xs text-[#BFBFBF] overflow-x-auto modal-scrollbar">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
