
# Plano Detalhado de Refatoração para Responsividade e Design Mobile

## Objetivo
Adaptar toda a aplicação para garantir experiência fluida e intuitiva em dispositivos móveis, mantendo a identidade visual do desktop (cores, ícones, fontes, etc.), com foco em usabilidade, acessibilidade e performance.

---

## Etapas e Detalhamento

### 1. Diagnóstico e Mapeamento
- Listar todas as páginas e componentes (dashboard, login, cadastro, agendamento, etc.).
- Usar ferramentas como Chrome DevTools para identificar quebras de layout e pontos críticos em breakpoints (sm, md, lg).
- Criar checklist de componentes que exigem maior adaptação (ex: tabelas, sidebars, cards, formulários).

#### Critérios de Aceitação
- Todas as páginas/componentes mapeados.
- Relatório de pontos críticos documentado.

---

### 2. Definição e Implementação do Tema Mobile
- Revisar e ajustar breakpoints do Tailwind no arquivo de configuração.
- Definir tokens de espaçamento, tamanhos de fonte, padding/margin para mobile.
- Garantir que cores, fontes e ícones sigam o padrão visual do desktop.
- Criar variáveis/utilitários para facilitar manutenção do tema.

#### Exemplo prático
```js
// tailwind.config.js
theme: {
	extend: {
		screens: {
			'xs': '375px',
			// ...demais breakpoints
		},
		fontSize: {
			'mobile-base': ['1rem', '1.5rem'],
		},
	},
}
```

#### Critérios de Aceitação
- Tema mobile documentado e aplicado globalmente.
- Identidade visual mantida.

---

### 3. Refatoração por Página/Componente

#### 3.1 Layout Base (Header, Sidebar, Navegação)
- Header fixo, logo redimensionável, ícones de ação visíveis em mobile.
- Sidebar oculta em telas pequenas, substituída por menu hambúrguer/drawer.
- Navegação principal acessível via menu colapsável.

**Ações:**
- Implementar componente de menu hambúrguer.
- Garantir que header ocupe altura reduzida em mobile.
- Testar navegação por teclado e toque.

**Critérios de Aceitação:**
- Navegação funcional e acessível em todos os tamanhos de tela.

#### 3.2 Login/Cadastro
- Formulário centralizado, largura máxima adaptada (ex: max-w-xs).
- Inputs e botões em coluna única, áreas de toque ampliadas (>44px).
- Mensagens de erro legíveis e visíveis.

**Ações:**
- Refatorar grid para flex-col em mobile.
- Ajustar espaçamento entre campos.

**Critérios de Aceitação:**
- Login/cadastro utilizável com uma mão em mobile.

#### 3.3 Dashboard
- Cards empilhados verticalmente em mobile.
- Gráficos responsivos (width 100%, altura adaptativa).
- Estatísticas em grid de 1 coluna no mobile.

**Ações:**
- Usar flex-col ou grid-cols-1 em mobile.
- Garantir que gráficos usem width: 100%.

**Critérios de Aceitação:**
- Informações do dashboard legíveis e acessíveis em mobile.

#### 3.4 Listagens (Serviços, Agendamentos)
- Tabelas substituídas por listas/cards empilhados em mobile.
- Ações (editar, excluir) como ícones ou menu de contexto.
- Filtros e buscas acima da lista, formato compacto.

**Ações:**
- Criar componente CardList para mobile.
- Esconder colunas não essenciais em mobile.

**Critérios de Aceitação:**
- Listagens navegáveis e ações acessíveis em mobile.

#### 3.5 Formulários (Serviços, Agendamento, Configurações)
- Inputs em coluna única, labels sempre visíveis.
- Botões grandes, feedback visual claro.

**Ações:**
- Refatorar para grid-cols-1 em mobile.
- Garantir espaçamento adequado entre campos.

**Critérios de Aceitação:**
- Formulários fáceis de preencher em mobile.

#### 3.6 Página Pública do Prestador
- Informações principais em cards empilhados.
- Botão de agendamento sempre visível.
- Layout adaptativo para fotos/ícones.

**Ações:**
- Ajustar ordem dos elementos para priorizar informações principais.

**Critérios de Aceitação:**
- Página pública legível e com CTA visível em mobile.

#### 3.7 Agendamento
- Passos em coluna única.
- Inputs grandes, navegação fácil.
- Confirmação visual clara.

**Ações:**
- Refatorar fluxo para mobile-first.

**Critérios de Aceitação:**
- Processo de agendamento rápido e sem fricção em mobile.

#### 3.8 Configurações/Perfil
- Seções empilhadas, inputs e botões adaptados.
- Feedback visual para ações.

**Ações:**
- Garantir que todas as ações sejam acessíveis por toque.

**Critérios de Aceitação:**
- Configurações facilmente editáveis em mobile.

#### 3.9 Esqueci/Redefinir Senha
- Formulário centralizado, inputs grandes, mensagens claras.

**Ações:**
- Ajustar layout para centralização e legibilidade.

**Critérios de Aceitação:**
- Recuperação de senha simples e clara em mobile.

#### 3.10 Componentes Reutilizáveis
- Cards: padding e fontes adaptativos, largura 100% em mobile.
- Modais: centralizados, largura máxima limitada, rolagem interna se necessário.
- Botões: tamanho mínimo de toque, fontes legíveis.
- Inputs: largura total, espaçamento adequado.

**Ações:**
- Revisar todos os componentes compartilhados para responsividade.

**Critérios de Aceitação:**
- Componentes reutilizáveis adaptados para mobile.

---

### 4. Testes e Ajustes
- Testar em múltiplos tamanhos de tela (emuladores e dispositivos reais).
- Corrigir sobreposições, quebras de layout e problemas de rolagem.
- Validar contraste, legibilidade e acessibilidade (uso de Lighthouse, axe, etc.).

#### Critérios de Aceitação
- Nenhum bloqueio de navegação em mobile.
- Pontuação mínima de 90 em Lighthouse para mobile.

---

### 5. Documentação e Padronização
- Documentar padrões de responsividade adotados (ex: uso de breakpoints, grid, flex, etc.).
- Criar exemplos de uso dos principais componentes em mobile e desktop.

#### Critérios de Aceitação
- Documentação disponível para onboarding de novos devs.

---

### 6. Deploy e Validação Final
- Submeter para validação com usuários reais ou stakeholders.
- Ajustar detalhes finais conforme feedback.

#### Critérios de Aceitação
- Aprovação dos stakeholders e usuários-chave.

---

## Prioridades Sugeridas
1. Layout base (header, sidebar, navegação)
2. Login/cadastro
3. Dashboard e cards principais
4. Listagens e formulários
5. Ajustes finos e testes cross-device

---

## Observações Gerais
- Usar breakpoints do Tailwind para todas as adaptações.
- Garantir acessibilidade (contraste, navegação por teclado, foco visível).
- Manter identidade visual do desktop em todos os tamanhos de tela.
