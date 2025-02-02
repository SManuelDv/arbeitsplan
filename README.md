# Arbeitsplan - Sistema de Gestão de Turnos

![Randstad Logo](./assets/randstad-logo.png)

## 📋 Sobre o Projeto

O Arbeitsplan é um sistema moderno de gestão de escalas de trabalho. Ele permite o gerenciamento eficiente de turnos, funcionários e suas escalas de trabalho.

## 🚀 Funcionalidades

- ✅ Autenticação segura
- ✅ Gestão de funcionários
- ✅ Controle de turnos
- ✅ Dashboard com métricas
- ✅ Interface moderna e responsiva
- ✅ Tema claro/escuro

## 🛠️ Tecnologias

- React + Vite
- TypeScript
- TailwindCSS
- Supabase
- React Query
- React Router
- Zustand
- date-fns

## 📦 Instalação

1. Clone o repositório:
```bash
git clone [url-do-repositorio]
cd arbeitsplan
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
- Copie o arquivo `.env.example` para `.env`
- Preencha com suas credenciais do Supabase

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

## 🗄️ Estrutura do Projeto

```
src/
├── assets/        # Imagens e recursos
├── components/    # Componentes reutilizáveis
├── config/        # Configurações (Supabase, etc)
├── layouts/       # Layouts da aplicação
├── pages/         # Páginas da aplicação
├── providers/     # Providers (Auth, etc)
├── routes/        # Configuração de rotas
├── services/      # Serviços de API
└── styles/        # Estilos globais
```

## 🔐 Banco de Dados

O projeto utiliza Supabase como backend, com as seguintes tabelas:

- `employees`: Funcionários
- `shifts`: Turnos
- `shift_changes`: Alterações de turno
- `notifications`: Notificações

## 👥 Papéis de Usuário

- **Administrador**: Acesso total ao sistema
- **Gestor**: Gerencia turnos e funcionários
- **Funcionário**: Visualiza turnos e solicita alterações

## 🔒 Segurança

- Autenticação via Supabase
- Políticas de segurança (RLS)
- Proteção de rotas
- Backup automático

## 📱 Responsividade

O sistema é totalmente responsivo e funciona em:

- 💻 Desktop
- 📱 Tablet
- 📱 Mobile

## 🤝 Contribuição

1. Faça um Fork do projeto
2. Crie uma branch para sua feature
3. Faça commit das alterações
4. Faça push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

## 🆘 Suporte

Para suporte, envie um email para [seu-email] ou abra uma issue no GitHub.
