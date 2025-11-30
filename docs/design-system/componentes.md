# Componentes do Design System – Agenda Única

Este documento detalha os principais componentes reutilizáveis do sistema, com foco em responsividade e boas práticas de UI/UX.

---

## Botão (`Button`)
- Variações: primário, secundário, desabilitado, loading
- Responsivo: largura total em mobile (`w-full`), largura automática em desktop (`md:w-auto`)
- Exemplo:
```jsx
<button className="px-4 py-2 text-base md:text-lg bg-blue-600 text-white rounded-md w-full md:w-auto">Agendar</button>
```

## Input (`Input`)
- Tipos: texto, email, telefone, textarea
- Responsivo: fonte e padding ajustados por breakpoint
- Exemplo:
```jsx
<input className="block w-full px-3 py-2 border rounded-md text-base md:text-lg" type="text" placeholder="Seu nome" />
```

## Card (`Card`)
- Usado para serviços, agendamentos, dashboards
- Layout flexível: `flex-col` em mobile, `flex-row` em desktop
- Exemplo:
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

## Modal (`Modal`)
- Usado para formulários e confirmações
- Centralizado, com fundo semitransparente
- Responsivo: largura máxima limitada em mobile
- Exemplo:
```jsx
<div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
  <div className="bg-white rounded-lg p-6 w-full max-w-md mx-2">
    <!-- Conteúdo do modal -->
  </div>
</div>
```

## Navbar/Sidebar
- Navegação principal do dashboard
- Sidebar colapsa em mobile, vira menu superior ou drawer
- Exemplo:
```jsx
<nav className="bg-blue-600 text-white p-4 flex flex-col md:flex-row">
  <a className="py-2 px-4 hover:bg-blue-700 rounded" href="/dashboard">Dashboard</a>
  <a className="py-2 px-4 hover:bg-blue-700 rounded" href="/dashboard/services">Serviços</a>
</nav>
```

## Toast/Feedback
- Mensagens de sucesso, erro, loading
- Sempre visíveis e acessíveis
- Exemplo:
```jsx
<div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow-lg">
  Agendamento realizado com sucesso!
</div>
```

---

## Boas Práticas
- Sempre testar componentes em diferentes tamanhos de tela
- Usar utilitários do Tailwind para responsividade
- Garantir contraste e acessibilidade
- Documentar variações e exemplos reais
