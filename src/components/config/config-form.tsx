"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { UpdateProviderConfigInput, updateProviderConfigSchema } from "@/lib/validations/config";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { revalidateConfig } from "@/lib/actions/revalidate";
import { formatPhoneNumber, cleanPhoneNumber } from "@/lib/utils";

interface ProviderConfig {
  id: number;
  name: string;
  businessName: string;
  publicUrl: string;
  email: string;
  phone: string;
  isWhatsapp: boolean;
  address: string;
}

export default function ConfigForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<UpdateProviderConfigInput>({
    resolver: zodResolver(updateProviderConfigSchema),
    defaultValues: {
      name: "",
      businessName: "",
      publicUrl: "",
      email: "",
      phone: "",
      isWhatsapp: false,
      address: "",
    },
  });

  const phoneValue = watch("phone");
  const isWhatsappValue = watch("isWhatsapp");

  const loadProviderConfig = useCallback(async () => {
    try {
      setIsLoadingData(true);
      const response = await fetch("/api/config");
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao carregar configurações");
      }

      const data: ProviderConfig = await response.json();
      // Format phone for display
      const formattedData = {
        ...data,
        phone: data.phone,
      };
      reset(formattedData);
    } catch (error) {
      console.error("Erro ao carregar configurações:", error);
      toast.error(error instanceof Error ? error.message : "Erro ao carregar configurações");
    } finally {
      setIsLoadingData(false);
    }
  }, [reset]);

  useEffect(() => {
    loadProviderConfig();
  }, [loadProviderConfig]);

  const onSubmit = async (data: UpdateProviderConfigInput) => {
    try {
      setIsLoading(true);
      
      // Clean phone number before sending
      const dataToSend = {
        ...data,
        phone: cleanPhoneNumber(data.phone),
      };
      
      const response = await fetch("/api/config", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao atualizar configurações");
      }

      toast.success("Configurações atualizadas com sucesso!");
      
      // Revalidate the pages to update session data
      await revalidateConfig();
      
      // Give a moment for the toast to show, then reload
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
    } catch (error) {
      console.error("Erro ao atualizar configurações:", error);
      toast.error(error instanceof Error ? error.message : "Erro ao atualizar configurações");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingData) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Carregando configurações...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-6">
        Informações Básicas
      </h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <Label htmlFor="name">Nome Completo</Label>
          <Input
            id="name"
            type="text"
            {...register("name")}
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="businessName">Nome do Negócio</Label>
          <Input
            id="businessName"
            type="text"
            {...register("businessName")}
            className={errors.businessName ? "border-red-500" : ""}
          />
          {errors.businessName && (
            <p className="mt-1 text-sm text-red-600">{errors.businessName.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="publicUrl">URL Pública</Label>
          <Input
            id="publicUrl"
            type="text"
            {...register("publicUrl")}
            className={errors.publicUrl ? "border-red-500" : ""}
            placeholder="meu-negocio"
          />
          {errors.publicUrl && (
            <p className="mt-1 text-sm text-red-600">{errors.publicUrl.message}</p>
          )}
          <p className="mt-1 text-sm text-gray-500">
            Esta URL será usada para que clientes acessem sua página de agendamento
          </p>
        </div>

        <div>
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            type="email"
            {...register("email")}
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="phone">Telefone</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="(11) 99999-9999"
            value={formatPhoneNumber(phoneValue || "")}
            onChange={(e) => {
              const formatted = formatPhoneNumber(e.target.value);
              const cleaned = cleanPhoneNumber(formatted);
              setValue("phone", cleaned, { shouldValidate: true });
            }}
            className={errors.phone ? "border-red-500" : ""}
            maxLength={15}
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
          )}
          <div className="flex items-center space-x-2 mt-2">
            <Checkbox
              id="isWhatsapp"
              checked={isWhatsappValue}
              onCheckedChange={(checked) => {
                setValue("isWhatsapp", checked as boolean);
              }}
            />
            <label
              htmlFor="isWhatsapp"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              Este número é WhatsApp
            </label>
          </div>
        </div>

        <div>
          <Label htmlFor="address">Endereço</Label>
          <Textarea
            id="address"
            {...register("address")}
            className={errors.address ? "border-red-500" : ""}
            rows={3}
            placeholder="Rua, número, bairro, cidade, estado"
          />
          {errors.address && (
            <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? "Salvando..." : "Salvar Alterações"}
        </Button>
      </form>
    </div>
  );
}
