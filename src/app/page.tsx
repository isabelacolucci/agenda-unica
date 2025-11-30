import Link from "next/link";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 py-8">
      <main className="text-center space-y-6 sm:space-y-8 max-w-2xl mx-auto">
        {/* Ícone da aplicação */}
        <div className="flex justify-center">
          <div className="p-3 sm:p-4 bg-primary rounded-full shadow-lg">
            <Calendar className="h-12 w-12 sm:h-16 sm:w-16 text-primary-foreground" />
          </div>
        </div>

        {/* Nome do projeto */}
        <div className="space-y-3 sm:space-y-4">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight">
            Agenda Única
          </h1>
          
          {/* Frase de propósito */}
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-md mx-auto px-4">
            Agende serviços de forma simples, rápida e segura.
          </p>
        </div>

        {/* Botões de navegação */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center pt-6 sm:pt-8 max-w-sm sm:max-w-none mx-auto">
          <Button asChild size="lg" className="w-full sm:w-auto min-w-[120px] h-12 sm:h-10 text-base sm:text-sm">
            <Link href="/login">
              Login
            </Link>
          </Button>
          
          <Button asChild variant="outline" size="lg" className="w-full sm:w-auto min-w-[120px] h-12 sm:h-10 text-base sm:text-sm">
            <Link href="/register">
              Registro
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
