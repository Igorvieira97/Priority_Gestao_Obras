<div align="center">

# Priority Engenharia — Gestão de Obras

**Sistema completo de gestão de obras da construção civil com controle de custos, materiais, equipe e diárias.**

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-4169E1?logo=postgresql&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss&logoColor=white)

</div>

---

## Sobre o Projeto

O **Priority Engenharia — Gestão de Obras** é um sistema web full-stack desenvolvido para empresas de construção civil que precisam gerenciar múltiplas obras simultaneamente. Ele centraliza o controle de canteiros, equipe de campo, diárias, materiais/estoque e despesas financeiras em uma única plataforma responsiva.

---

## Funcionalidades

### Dashboard
- Cards com métricas em tempo real (total de obras, colaboradores, despesas)
- Gráfico de barras com despesas dos últimos 6 meses (Recharts)
- Gráfico de pizza com distribuição de obras por status

### Obras (Canteiros)
- Cadastro de obras com nome, endereço e status (Em Andamento / Concluída / Pausada)
- Edição inline e exclusão com confirmação
- Visualização detalhada com 3 abas: **Equipe**, **Diárias** e **Estoque**
- Badge de status dinâmico com cores

### Equipe & Diárias
- Alocação de colaboradores por obra
- Registro de diárias com 3 estados: **Presença**, **Meia** e **Falta**
- Controle de valor de diária por colaborador
- Histórico de pagamentos com quantidade de diárias quitadas

### Estoque & Materiais
- Catálogo global de materiais (dicionário com categoria e unidade de medida)
- Vinculação de materiais por obra com controle de saldo
- Indicadores de status: OK / Baixo / Crítico
- Pesquisa e filtragem por nome ou categoria

### Financeiro (Custos & Despesas)
- Lançamento de despesas com categoria, data e observação
- Upload de comprovantes (imagem/PDF) com compressão automática via Canvas
- Edição e exclusão de lançamentos
- **Controle de contas pagas** — botão de check com toggle visual (verde = paga)
- Pesquisa por descrição ou categoria

### Gestão de Acessos (Usuários)
- Cadastro de administradores com senha padrão criptografada (bcrypt)
- Fluxo de troca obrigatória de senha no primeiro acesso
- Ativação/desativação de usuários

### Login
- Autenticação com e-mail e senha via API
- Opção "Lembrar meus dados" com persistência em localStorage
- Fluxo de primeiro acesso com redefinição de senha

---

## Tecnologias

| Camada | Stack |
|--------|-------|
| **Frontend** | React 19, TypeScript, Vite 6, Tailwind CSS (CDN), Recharts, Lucide React, Axios |
| **Backend** | Node.js, Express 5, ES Modules |
| **Banco de Dados** | PostgreSQL (Supabase) |
| **Autenticação** | bcryptjs (hash de senhas) |

---

## Estrutura do Projeto

```
├── pages/                  # Páginas React
│   ├── Dashboard.tsx       # Dashboard com gráficos e métricas
│   ├── Obras.tsx           # Gestão de obras + abas (Equipe/Diárias/Estoque)
│   ├── Pessoas.tsx         # Cadastro de colaboradores
│   ├── Materiais.tsx       # Catálogo global de materiais
│   ├── Financeiro.tsx      # Custos e despesas
│   ├── Usuarios.tsx        # Gestão de acessos
│   ├── Login.tsx           # Tela de login
│   └── InstallApp.tsx      # PWA install prompt
│
├── components/
│   ├── Layout.tsx          # Layout principal com Sidebar
│   └── Sidebar.tsx         # Menu lateral de navegação
│
├── src/
│   ├── server.js           # Servidor Express (entry point)
│   ├── db.js               # Conexão com PostgreSQL (Supabase)
│   ├── controllers/        # Lógica de negócio (10 controllers)
│   └── routes/             # Rotas da API REST (10 arquivos)
│
├── .env                    # Variáveis de ambiente (NÃO commitado)
├── .env.example            # Modelo das variáveis necessárias
├── App.tsx                 # Roteamento principal
├── vite.config.ts          # Configuração do Vite
└── package.json
```

---

## Pré-requisitos

- **Node.js** 18+
- **npm** ou **yarn**
- Conta no **Supabase** (ou PostgreSQL local)

---

## Instalação

```bash
# 1. Clone o repositório
git clone https://github.com/Igorvieira97/Priority_Gestao_Obras.git
cd Priority_Gestao_Obras

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com suas credenciais do Supabase
```

---

## Configuração do Banco de Dados

Crie as seguintes tabelas no seu banco PostgreSQL/Supabase:

```sql
-- Obras
CREATE TABLE obras (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  endereco VARCHAR(500),
  status VARCHAR(50) DEFAULT 'Em Andamento',
  progresso INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Pessoas (Colaboradores)
CREATE TABLE pessoas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  funcao VARCHAR(100),
  telefone VARCHAR(20),
  valor_diaria DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Catálogo de Materiais
CREATE TABLE materiais_catalogo (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  categoria VARCHAR(100),
  unidade_medida VARCHAR(20) DEFAULT 'Unid',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Estoque por Obra
CREATE TABLE estoque_obras (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  obra_id UUID REFERENCES obras(id) ON DELETE CASCADE,
  material_id UUID REFERENCES materiais_catalogo(id),
  quantidade DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Alocações (Colaborador ↔ Obra)
CREATE TABLE alocacoes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  obra_id UUID REFERENCES obras(id) ON DELETE CASCADE,
  pessoa_id UUID REFERENCES pessoas(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Diárias
CREATE TABLE diarias (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  alocacao_id UUID REFERENCES alocacoes(id) ON DELETE CASCADE,
  data DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'Presença',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Pagamentos de Diárias
CREATE TABLE pagamentos_diarias (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pessoa_id UUID REFERENCES pessoas(id) ON DELETE CASCADE,
  obra_id UUID REFERENCES obras(id) ON DELETE CASCADE,
  valor_pago DECIMAL(10,2) NOT NULL,
  qtd_diarias INTEGER NOT NULL,
  data_pagamento TIMESTAMP DEFAULT NOW()
);

-- Despesas
CREATE TABLE despesas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  descricao VARCHAR(500) NOT NULL,
  categoria VARCHAR(100),
  valor DECIMAL(10,2) NOT NULL,
  data_despesa DATE,
  observacao TEXT,
  comprovante TEXT,
  pago BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Usuários
CREATE TABLE usuarios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  senha_hash VARCHAR(255) NOT NULL,
  status VARCHAR(20) DEFAULT 'Ativo',
  primeiro_acesso BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## Executando

```bash
# Terminal 1 — Backend (porta 3000)
npm run server

# Terminal 2 — Frontend (porta 5173)
npm run dev
```

Acesse: **http://localhost:5173**

---

## Endpoints da API

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/dashboard` | Métricas e dados dos gráficos |
| GET/POST | `/api/obras` | Listar / Criar obras |
| PUT/DELETE | `/api/obras/:id` | Editar / Excluir obra |
| GET/POST | `/api/pessoas` | Listar / Criar colaboradores |
| PUT/DELETE | `/api/pessoas/:id` | Editar / Excluir colaborador |
| GET/POST | `/api/materiais` | Listar / Criar materiais |
| PUT/DELETE | `/api/materiais/:id` | Editar / Excluir material |
| GET | `/api/estoque/obra/:obraId` | Estoque de uma obra |
| POST | `/api/estoque` | Vincular material a obra |
| PATCH | `/api/estoque/:id` | Atualizar saldo |
| DELETE | `/api/estoque/:id` | Remover vínculo |
| GET/POST | `/api/alocacoes` | Listar / Criar alocações |
| DELETE | `/api/alocacoes/:id` | Remover alocação |
| GET/POST | `/api/diarias` | Listar / Registrar diárias |
| PATCH | `/api/diarias/:id` | Atualizar status da diária |
| GET/POST | `/api/pagamentos` | Listar / Registrar pagamentos |
| GET/POST | `/api/despesas` | Listar / Criar despesas |
| PUT | `/api/despesas/:id` | Editar despesa |
| PATCH | `/api/despesas/:id/pagamento` | Toggle pago/não pago |
| DELETE | `/api/despesas/:id` | Excluir despesa |
| GET/POST | `/api/usuarios` | Listar / Criar usuários |
| PATCH | `/api/usuarios/:id` | Ativar/desativar usuário |
| POST | `/api/usuarios/login` | Autenticação |
| POST | `/api/usuarios/primeiro-acesso` | Troca de senha obrigatória |
| GET | `/api/health` | Health check do banco |

---

## Variáveis de Ambiente

| Variável | Descrição |
|----------|-----------|
| `PORT` | Porta do servidor Express (padrão: 3000) |
| `DATABASE_URL` | Connection string do PostgreSQL/Supabase |
| `DEFAULT_PASSWORD` | Senha padrão para novos usuários (padrão: 123456) |

---

## Autor

**Igor Vieira** — [GitHub](https://github.com/Igorvieira97)

---

## Licença

Este projeto é de uso privado da **Priority Engenharia**.1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
