# Especificação Técnica - Arbeitsplan

![Randstad Logo](./assets/randstad-logo.png)

## 1. Visão Geral
O Arbeitsplan é um sistema moderno e responsivo de gestão de escalas de trabalho da Randstad.

O sistema visa facilitar o planeamento, gestão e consulta das escalas de trabalho para uma empresa que opera em turnos. Ele será usado por gestores e funcionários para visualizar horários, folgas, alterações e um calendário anual, promovendo organização, comunicação e eficiência operacional.

O sistema será acessível via web, responsivo para dispositivos móveis e terá funcionalidades de notificações e exportação de relatórios.

### 1.1 Objetivos
- Automatizar a gestão de escalas de trabalho
- Facilitar a visualização de turnos por grupo
- Permitir alterações e trocas de turno
- Manter histórico de mudanças
- Gerar relatórios detalhados
- Notificar alterações via email/WhatsApp

### 1.2 Público-Alvo
- Administradores do sistema
- Gestores de equipe
- Funcionários dos grupos de trabalho

## 2. Arquitetura do Sistema

### 2.1 Backend (Supabase)
- Banco de dados PostgreSQL gratuito
- Autenticação com email/senha e recuperação
- API REST automática
- Storage para fotos de perfil
- Notificações em tempo real
- Backup automático

### 2.2 Frontend (React + Vite)
- React 18+ para interface
- Vite para build rápido
- TailwindCSS para estilos
- React Router v6 para rotas
- Zustand para estado global
- React Query para cache
- date-fns para datas

## 3. Interface do Usuário

### 3.1 Design System
#### 3.1.1 Temas
##### Tema Claro
- Fundo: #FFFFFF
- Texto: #333333
- Primária: #0066CC (Azul Randstad)
- Secundária: #F5F5F5
- Sucesso: #10B981
- Erro: #EF4444
- Alerta: #F59E0B

##### Tema Escuro
- Fundo: #1F2937
- Texto: #F9FAFB
- Primária: #3B82F6
- Secundária: #374151
- Sucesso: #059669
- Erro: #DC2626
- Alerta: #D97706

#### 3.1.2 Tipografia
- Fonte: Inter (Google Fonts)
- Tamanhos:
  - xs: 12px
  - sm: 14px
  - base: 16px
  - lg: 18px
  - xl: 20px
  - 2xl: 24px
  - 3xl: 30px

### 3.2 Componentes
- Layout Responsivo:
  - Sidebar recolhível
  - Header fixo
  - Container fluido
- Componentes Base:
  - Botões modernos com hover states
  - Inputs com validação
  - Cards com sombras suaves
  - Tabelas responsivas
  - Modais e drawers
  - Dropdowns
  - Tooltips
  - Badges coloridos
  - Loading states e Spinners
  - Filtros avançados com auto-save
  - Sistema de cores para turnos
    - Manhã: Vermelho
    - Tarde: Verde
    - Noite: Azul
    - Folga: Cinza

### 3.3 Funcionalidades Específicas
#### 3.3.1 Gestão de Turnos
- Sistema de cores intuitivo
- Auto-save de alterações
- Filtros avançados por:
  - Nome
  - Departamento
  - Equipe
  - Período
- Indicadores visuais para:
  - Fins de semana
  - Feriados
  - Turnos especiais
- Modal de edição rápida
- Histórico de alterações

## 4. Páginas e Rotas

### 4.1 Autenticação (/auth)
- Login (/auth/login)
- Recuperar Senha (/auth/recover)
- Redefinir Senha (/auth/reset)

### 4.2 Dashboard (/)
- Menu Lateral
- Resumo de Turnos
- Gráficos e Estatísticas
- Notificações

### 4.3 Escalas
- Diária (/scales/daily)
- Semanal (/scales/weekly)
- Mensal (/scales/monthly)
- Anual (/scales/yearly)

### 4.4 Alterações (/changes)
- Lista de Solicitações
- Formulário de Nova Alteração
- Histórico

### 4.5 Relatórios (/reports)
- Geração de PDF/Excel
- Filtros Avançados
- Visualização Prévia

### 4.6 Configurações (/settings)
- Perfil do Usuário
- Preferências de Tema
- Notificações

## 5. Banco de Dados

### 5.1 Tabelas
#### users
- id: uuid
- email: string
- password: string
- full_name: string
- group_id: uuid
- department: string
- role: enum (admin, manager, employee)
- notifications: jsonb
- created_at: timestamp
- updated_at: timestamp

#### groups
- id: uuid
- name: string (A, B, C, D)
- created_at: timestamp

#### shifts
- id: uuid
- date: date
- period: enum (morning, afternoon, night, off)
- employee_id: uuid
- start_time: timestamp
- end_time: timestamp
- notes: string
- created_at: timestamp
- updated_at: timestamp

#### changes
- id: uuid
- user_id: uuid
- old_shift: uuid
- new_shift: uuid
- reason: string
- status: enum (pending, approved, rejected)
- created_at: timestamp
- updated_at: timestamp

#### notifications
- id: uuid
- user_id: uuid
- type: enum (email, whatsapp, system)
- message: string
- read: boolean
- created_at: timestamp

## 6. Segurança
- Autenticação JWT via Supabase
- Políticas RLS por função
- Backup automático diário
- Rate limiting
- CORS configurado
- Logs de auditoria

## 7. Hospedagem
- Frontend: Vercel (gratuito)
- Backend: Supabase (plano gratuito)
- Domínio: labor-agenda.vercel.app

## 8. Acompanhamento do Projeto

### 8.1 Plataformas (Todas Gratuitas)
- GitHub:
  - Repositório público
  - Projects para kanban
  - Issues para tarefas
  - Pull Requests para revisão
  - Actions para CI/CD
  - Wiki para documentação

- Vercel:
  - Deploy automático
  - Preview de cada PR
  - Analytics básicos
  - Logs em tempo real
  - Status do sistema

- Discord:
  - Canal geral para comunicação
  - Canal de desenvolvimento
  - Canal de deploys automáticos
  - Bot para notificações
  - Compartilhamento de tela

### 8.2 Fluxo de Trabalho
1. **Planejamento**:
   - Tasks no GitHub Projects
   - Milestones para fases
   - Labels para prioridades

2. **Desenvolvimento**:
   - Branches por feature
   - Commits frequentes
   - PRs com descrição detalhada
   - Review automático

3. **Deploy**:
   - Preview automático no PR
   - Deploy staging após merge
   - Deploy produção manual

4. **Monitoramento**:
   - Status em tempo real
   - Logs centralizados
   - Métricas de uso
   - Alertas automáticos

### 8.3 Comunicação
- Daily updates no Discord
- Review semanal de progresso
- Demonstrações de features
- Feedback em tempo real
- Documentação viva no Wiki 