# Checklist do Projeto - Arbeitsplan

![Randstad Logo](./assets/randstad-logo.png)

## 1. Preparação Inicial
- [ ] Criar repositório Git
- [ ] Configurar ambiente de desenvolvimento
- [ ] Criar documentação base
- [ ] Configurar IDE (VSCode)
  - [ ] Extensões recomendadas
  - [ ] Snippets personalizados
  - [ ] ESLint + Prettier
- [ ] Configurar Ambiente de Acompanhamento:
  - [ ] GitHub:
    - [ ] Criar repositório público
    - [ ] Configurar GitHub Projects (Kanban)
    - [ ] Criar templates de Issues/PRs
    - [ ] Configurar GitHub Actions
    - [ ] Iniciar Wiki do projeto
  - [ ] Vercel:
    - [ ] Conectar com GitHub
    - [ ] Configurar deploys automáticos
    - [ ] Configurar variáveis de ambiente
    - [ ] Habilitar previews
  - [ ] Discord:
    - [ ] Criar servidor dedicado
    - [ ] Configurar canais
    - [ ] Integrar com GitHub/Vercel
    - [ ] Configurar bot de notificações

## 2. Backend (Supabase)
- [ ] Criar projeto gratuito
- [ ] Configurar autenticação:
  - [ ] Email/senha
  - [ ] Recuperação de senha
  - [ ] Tokens JWT
- [ ] Criar tabelas:
  - [ ] users (com campos expandidos)
  - [ ] groups
  - [ ] shifts (com motivos)
  - [ ] changes
  - [ ] notifications
- [ ] Configurar políticas RLS
- [ ] Configurar backups
- [ ] Configurar notificações

## 3. Frontend
- [ ] Criar projeto Vite
- [ ] Configurar TailwindCSS
- [ ] Configurar temas (claro/escuro)
- [ ] Instalar dependências:
  - [ ] react-router-dom
  - [ ] @supabase/supabase-js
  - [ ] date-fns
  - [ ] zustand
  - [ ] react-query
  - [ ] react-hook-form
  - [ ] recharts

## 4. Design System
- [ ] Implementar temas:
  - [ ] Tema claro
  - [ ] Tema escuro
  - [ ] Toggle de tema
- [ ] Configurar fonte Inter
- [ ] Criar componentes:
  - [ ] Layout base responsivo
  - [ ] Sidebar recolhível
  - [ ] Header fixo
  - [ ] Botões modernos
  - [ ] Inputs validados
  - [ ] Cards com sombra
  - [ ] Tabelas responsivas
  - [ ] Modais/Drawers
  - [ ] Dropdowns
  - [ ] Loading states

## 5. Páginas
- [ ] Autenticação:
  - [ ] Login
  - [ ] Recuperar senha
  - [ ] Redefinir senha
- [ ] Dashboard:
  - [ ] Menu lateral
  - [ ] Resumo de turnos
  - [ ] Gráficos
  - [ ] Notificações
- [ ] Escalas:
  - [ ] Diária
  - [ ] Semanal
  - [ ] Mensal
  - [ ] Anual (calendário completo)
- [ ] Alterações:
  - [ ] Lista de solicitações
  - [ ] Formulário de alteração
  - [ ] Histórico
- [ ] Relatórios:
  - [ ] Filtros avançados
  - [ ] Exportação PDF/Excel
- [ ] Configurações:
  - [ ] Perfil
  - [ ] Preferências
  - [ ] Notificações

## 6. Funcionalidades
- [ ] Sistema de autenticação completo
- [ ] Gestão de usuários:
  - [ ] CRUD completo
  - [ ] Permissões
- [ ] Gestão de turnos:
  - [ ] Visualização por período
  - [ ] Filtros avançados
  - [ ] Motivos de ausência
- [ ] Sistema de alterações:
  - [ ] Solicitação
  - [ ] Aprovação/Rejeição
  - [ ] Notificações
- [ ] Relatórios dinâmicos
- [ ] Notificações:
  - [ ] Email
  - [ ] WhatsApp
  - [ ] Sistema

## 7. Testes
- [ ] Testes unitários
- [ ] Testes de integração
- [ ] Testes E2E
- [ ] Validações de formulário
- [ ] Testes de responsividade

## 8. Deploy e CI/CD
- [ ] Configurar CI/CD na Vercel
- [ ] Deploy automático
- [ ] Variáveis de ambiente
- [ ] Monitoramento
- [ ] Logs de erro
- [ ] Integrações:
  - [ ] GitHub Actions com Discord
  - [ ] Vercel com Discord
  - [ ] Supabase com Discord 