"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Header, Footer } from "@/components/layout";
import { Card, Input, Button } from "@/components/ui";
import { Linkedin, Upload } from "lucide-react";
import { validators } from "@/lib/validators";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, status, update } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errors, setErrors] = useState<{ linkedinUrl?: string; image?: string; general?: string }>({});
  const [formData, setFormData] = useState({
    linkedinUrl: "",
    image: "",
  });

  const maxImageSizeBytes = 512 * 1024;
  const maxImageDimension = 256;

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [router, status]);

  useEffect(() => {
    if (status !== "authenticated") return;

    const loadProfile = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/profile");
        const data = await response.json();

        if (data.success) {
          setFormData({
            linkedinUrl: data.profile.linkedinUrl || "",
            image: data.profile.image || "",
          });
        }
      } catch {
        setErrors({ general: "Erro ao carregar perfil. Tente novamente." });
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [status]);

  const resizeImage = (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = typeof reader.result === "string" ? reader.result : "";
        const img = new Image();
        img.onload = () => {
          const scale = Math.min(
            maxImageDimension / img.width,
            maxImageDimension / img.height,
            1
          );
          const width = Math.floor(img.width * scale);
          const height = Math.floor(img.height * scale);

          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            reject(new Error("Canvas nao suportado"));
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
          resolve(dataUrl);
        };
        img.onerror = () => reject(new Error("Erro ao carregar imagem"));
        img.src = result;
      };
      reader.onerror = () => reject(new Error("Erro ao ler arquivo"));
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({ ...prev, image: "Selecione uma imagem valida." }));
      return;
    }

    try {
      setErrors((prev) => ({ ...prev, image: undefined }));
      const dataUrl = file.size > maxImageSizeBytes ? await resizeImage(file) : await resizeImage(file);

      if (dataUrl.length > maxImageSizeBytes * 2) {
        setErrors((prev) => ({
          ...prev,
          image: "A imagem ficou muito grande. Use um arquivo menor.",
        }));
        return;
      }

      setFormData((prev) => ({ ...prev, image: dataUrl }));
    } catch (error) {
      console.error("Erro ao processar imagem:", error);
      setErrors((prev) => ({ ...prev, image: "Erro ao processar imagem." }));
    }
  };

  const validateForm = () => {
    const newErrors: { linkedinUrl?: string } = {};
    const linkedinError = validators.linkedin.validate(formData.linkedinUrl);
    if (linkedinError) newErrors.linkedinUrl = linkedinError;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateForm()) return;

    setIsSaving(true);
    setErrors({});
    setSuccessMessage("");

    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: formData.image || null,
          linkedinUrl: formData.linkedinUrl || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Erro ao salvar perfil:", data);
        setErrors({ general: data.error || "Erro ao salvar perfil." });
        return;
      }

      console.log("Perfil atualizado com sucesso:", data);
      setSuccessMessage("Perfil atualizado com sucesso.");

      if (update) {
        await update({ name: session?.user?.name });
      }
    } catch (error) {
      console.error("Erro ao salvar perfil:", error);
      setErrors({ general: "Erro ao salvar perfil. Tente novamente." });
    } finally {
      setIsSaving(false);
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-[#0B0501]">
        <Header />
        <div className="pt-28 pb-20 px-6">
          <div className="max-w-3xl mx-auto text-center text-[#BFBFBF]">
            Carregando perfil...
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0501]">
      <Header />
      <main className="pt-28 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white">Editar perfil</h1>
            <p className="text-sm text-[#BFBFBF]">
              Atualize sua foto de perfil e seu LinkedIn para aparecer no Power Ranking.
            </p>
          </div>

          {errors.general && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
              <p className="text-sm text-red-400 text-center">{errors.general}</p>
            </div>
          )}

          {successMessage && (
            <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20">
              <p className="text-sm text-green-400 text-center">{successMessage}</p>
            </div>
          )}

          <Card className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-medium text-white">Foto de perfil</label>
                <div className="flex items-center gap-4">
                  {formData.image ? (
                    <img
                      src={formData.image}
                      alt="Preview do perfil"
                      className="w-16 h-16 rounded-full object-cover border border-white/10"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                      <Upload className="w-5 h-5 text-[#BFBFBF]" />
                    </div>
                  )}
                  <div className="flex-1">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      error={errors.image}
                      helperText="Envie uma imagem quadrada para melhor resultado"
                    />
                  </div>
                </div>
              </div>

              <Input
                label="LinkedIn (opcional)"
                name="linkedinUrl"
                placeholder="https://linkedin.com/in/seu-perfil"
                value={formData.linkedinUrl}
                onChange={(event) =>
                  setFormData((prev) => ({ ...prev, linkedinUrl: event.target.value }))
                }
                error={errors.linkedinUrl}
                data-testid="profile-linkedin"
              />

              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-[#BFBFBF]">
                  <Linkedin className="w-4 h-4 text-blue-400" />
                  O LinkedIn aparece no Power Ranking.
                </div>
                <Button type="submit" isLoading={isSaving}>
                  Salvar alterações
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
