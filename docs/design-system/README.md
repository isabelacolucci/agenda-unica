# Design System – Agenda Única

## Visão Geral
Este documento apresenta o Design System do Agenda Única, com foco em responsividade, consistência visual e acessibilidade. Ele serve como referência para desenvolvedores e designers, garantindo uma experiência coesa em todas as plataformas.

---

## Princípios do Design
- **Consistência:** Elementos visuais e interações padronizadas.
- **Responsividade:** Layouts e componentes adaptáveis a diferentes tamanhos de tela (mobile-first).
- **Acessibilidade:** Contraste, navegação por teclado e uso de ARIA.
- **Simplicidade:** Interfaces limpas, objetivas e fáceis de usar.

---

## Tokens de Design
- **Cores:**
  - Primária: #2563eb
  - Secundária: #f1f5f9
  - Sucesso: #22c55e
  - Erro: #ef4444
  - Fundo: #ffffff
  - Texto: #0f172a
- **Tipografia:**
  - Fonte principal: Inter, sans-serif
  - Tamanhos: 0.875rem (sm), 1rem (base), 1.25rem (lg), 1.5rem (xl)
- **Espaçamento:**
  - 4px, 8px, 16px, 24px, 32px
- **Raios de borda:**
  - 4px, 8px
- **Sombreamento:**
  - shadow-sm, shadow-md, shadow-lg

---

## Breakpoints (Tailwind)
- xs: 375px
- sm: 640px
- md: 768px
- lg: 1024px
- xl: 1280px

---

## Componentes Base
- **Botão:** Primário, secundário, desabilitado, loading
- **Input:** Text, email, telefone, textarea
- **Card:** Usado em serviços, agendamentos, dashboards
- **Modal:** Para formulários e confirmações
- **Navbar/Sidebar:** Navegação responsiva
- **Toast:** Feedback de ações

---

## Guidelines de Responsividade
- Utilize classes utilitárias do Tailwind para adaptar paddings, margins, fontes e grids conforme breakpoints.
- Priorize o mobile: desenvolva e teste primeiro em telas pequenas.
- Evite tabelas fixas; use listas, cards ou grids flexíveis.
- Esconda elementos não essenciais em telas pequenas.
- Teste navegação e interações em dispositivos reais e simuladores.

---

## Exemplos de Uso

### Botão Responsivo
```jsx
<button className="px-4 py-2 text-base md:text-lg bg-blue-600 text-white rounded-md w-full md:w-auto">Agendar</button>
```

### Card de Serviço
```jsx
<div className="p-4 rounded-lg shadow-md bg-white flex flex-col md:flex-row gap-4">
  <div className="flex-1">
    <h3 className="text-lg font-semibold">Corte de Cabelo</h3>
    <p className="text-sm text-slate-600">Descrição do serviço...</p>
  </div>
  <div className="flex items-center md:justify-end">
    <span className="text-blue-600 font-bold text-base">R$ 50,00</span>
  </div>
</div>
```

---

## Acessibilidade
- Sempre use labels em inputs.
- Garanta contraste mínimo de 4.5:1.
- Elementos interativos devem ser acessíveis por teclado.
- Utilize atributos ARIA quando necessário.

---

## Referências
- [Tailwind CSS Docs](https://tailwindcss.com/docs/responsive-design)
- [WCAG 2.1](https://www.w3.org/WAI/standards-guidelines/wcag/)
- [shadcn/ui](https://ui.shadcn.com/)
