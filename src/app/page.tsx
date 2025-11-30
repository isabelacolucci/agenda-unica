import Link from "next/link";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <main className="text-center space-y-8 max-w-2xl mx-auto">
        {/* Ícone da aplicação */}
        <div className="flex justify-center">
          <div className="p-4 bg-primary rounded-full shadow-lg">
            <Calendar className="h-16 w-16 text-primary-foreground" />
          </div>
        </div>

        {/* Nome do projeto */}
        <div className="space-y-4">
          <h1 className="text-6xl font-bold text-foreground tracking-tight">
            Agenda Única
          </h1>
          
          {/* Frase de propósito */}
          <p className="text-xl text-muted-foreground max-w-md mx-auto">
            Agende serviços de forma simples, rápida e segura.
          </p>
        </div>

        {/* Botões de navegação */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
          <Button asChild size="lg" className="w-full sm:w-auto min-w-[120px]">
            <Link href="/login">
              Login
            </Link>
          </Button>
          
          <Button asChild variant="outline" size="lg" className="w-full sm:w-auto min-w-[120px]">
            <Link href="/register">
              Registro
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
