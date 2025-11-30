# Checklist de Correções e Recomendações – Design System

## Componentes Base

### Button (`src/components/ui/button.tsx`)
- ✔️ Usa variantes, tamanhos e tokens do design system.
- ✔️ Responsivo via utilitários Tailwind.
- ✔️ Acessibilidade: foco visível, `aria-invalid`.
- **Recomendação:** Certifique-se de que todos os usos do botão em páginas estejam usando as variantes e tamanhos definidos.

### Input/Textarea/Label (`src/components/ui/input.tsx`, `textarea.tsx`, `label.tsx`)
- ✔️ Utilizam tokens de cor, radius, tipografia e responsividade.
- ✔️ Inputs e textareas usam `w-full`, `md:text-sm`, foco visível, `aria-invalid`.
- ✔️ Label usa `peer-disabled`, `font-medium`, gap.
- **Recomendação:** Sempre associe `Label` ao input via `htmlFor`/`id` para acessibilidade.

### Card (`src/components/ui/card.tsx`)
- ✔️ Layout flexível, tokens de cor, radius, shadow.
- ✔️ Responsivo com `flex-col`, `gap-6`.
- **Recomendação:** Use sempre que possível para agrupamento visual, evitando `div` soltas.

### Dialog/Modal (`src/components/ui/dialog.tsx`)
- ✔️ Usa Radix, tokens de cor, radius, shadow.
- ✔️ Overlay e foco visível.
- **Recomendação:** Testar navegação por teclado e uso de `aria-modal`, `aria-labelledby`.

---

## Dashboard

### DashboardLayout (`src/components/dashboard-layout.tsx`)
- ✔️ Sidebar responsiva (menu mobile/desktop).
- ✔️ Tokens de cor, espaçamento, tipografia.
- **Recomendação:** Certifique-se de que o menu mobile seja acessível por teclado e tenha foco visível.

### DashboardContent, Cards, Charts
- ✔️ Cards usam componentes reutilizáveis, tokens e responsividade.
- ✔️ Gráficos e estatísticas usam cores e ícones do design system.
- **Recomendação:** Testar visualização em telas pequenas e garantir que tooltips/gráficos sejam legíveis.

---

## Páginas

### Home (`src/app/page.tsx`)
- ✔️ Usa `flex-col`, `sm:flex-row`, `w-full`, `sm:w-auto` nos botões.
- ✔️ Tokens de cor, tipografia, espaçamento.
- **Recomendação:** Certifique-se de que o contraste do texto e botões esteja sempre adequado.

### Dashboard (`src/app/dashboard/page.tsx`)
- ✔️ Usa layout e componentes padronizados.
- **Recomendação:** Garantir que todos os cards e gráficos estejam visíveis e legíveis em mobile.

### Services (`src/app/dashboard/services/page.tsx`)
- ✔️ Usa layout padrão, lista de serviços responsiva.
- **Recomendação:** Testar formulários de cadastro/edição em mobile.

---

## Acessibilidade

- ✔️ Uso de `aria-*`, foco visível, labels.
- **Recomendação:** Rodar Lighthouse/axe periodicamente para garantir 100% de acessibilidade.

---

## Tipografia

- **Ponto de atenção:** Não há referência explícita à fonte "Inter". Se for padrão, importe no `globals.css` ou via Tailwind config.

---

## Checklist Geral

- [ ] Importar fonte "Inter" globalmente, se for padrão do design system.
- [ ] Garantir uso consistente dos componentes do design system em todas as páginas.
- [ ] Testar todos os fluxos em mobile, tablet e desktop.
- [ ] Validar acessibilidade com ferramentas automáticas e navegação por teclado.
- [ ] Documentar variações customizadas de componentes, se existirem.
