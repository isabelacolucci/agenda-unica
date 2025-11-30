# Guia de Responsividade – Agenda Única

Este guia apresenta recomendações e exemplos práticos para garantir que todos os fluxos e componentes do Agenda Única sejam responsivos e funcionem bem em qualquer dispositivo.

---

## Estratégia Mobile-First
- Desenvolva e teste primeiro em telas pequenas (mobile).
- Expanda gradualmente para breakpoints maiores (tablet, desktop).

## Utilização de Breakpoints (Tailwind)
- xs: 375px
- sm: 640px
- md: 768px
- lg: 1024px
- xl: 1280px

## Recomendações Gerais
- Use `w-full` para inputs, botões e cards em mobile.
- Utilize `flex-col` em mobile e `md:flex-row` em desktop para layouts flexíveis.
- Esconda elementos não essenciais em telas pequenas com `hidden md:block`.
- Ajuste tamanhos de fonte e espaçamento com utilitários responsivos (`text-base md:text-lg`, `p-4 md:p-6`).
- Evite tabelas fixas; prefira listas ou grids adaptáveis.
- Teste navegação e interações em dispositivos reais e simuladores.

---

## Exemplos Práticos

### Formulário Responsivo
```jsx
<form className="space-y-4 md:space-y-0 md:grid md:grid-cols-2 md:gap-4">
  <input className="w-full px-3 py-2 border rounded-md" placeholder="Nome" />
  <input className="w-full px-3 py-2 border rounded-md" placeholder="Telefone" />
  <textarea className="w-full px-3 py-2 border rounded-md md:col-span-2" placeholder="Observações"></textarea>
  <button className="w-full md:w-auto px-4 py-2 bg-blue-600 text-white rounded-md md:col-span-2">Agendar</button>
</form>
```

### Lista de Cards
```jsx
<div className="flex flex-col gap-4 md:grid md:grid-cols-2 lg:grid-cols-3">
  {/* Card de serviço/agendamento */}
</div>
```

---

## Checklist de Responsividade
- [x] Todos os componentes testados em mobile, tablet e desktop
- [x] Navegação acessível em qualquer tamanho de tela
- [x] Inputs e botões com área de toque adequada (>48px)
- [x] Feedback visual claro em todas as interações
- [x] Layouts flexíveis, sem scroll horizontal

---

## Ferramentas Úteis
- Chrome DevTools (modo responsivo)
- [Responsively App](https://responsively.app/)
- [Tailwind Play](https://play.tailwindcss.com/)

---

## Referências
- [Tailwind CSS Responsive Design](https://tailwindcss.com/docs/responsive-design)
- [Google Material Responsive Layout Grid](https://material.io/design/layout/responsive-layout-grid.html)
