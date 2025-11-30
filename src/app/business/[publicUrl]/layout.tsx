import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Prestador de Serviços - Agenda Única",
  description: "Conheça os serviços oferecidos pelo nosso prestador. Agende seus serviços de forma prática e rápida.",
  openGraph: {
    title: "Prestador de Serviços - Agenda Única",
    description: "Conheça os serviços oferecidos pelo nosso prestador.",
    type: 'website',
  }
}

export default function BusinessLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
