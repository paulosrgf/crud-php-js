# CRUD Produtos — PHP + JS

Projeto de CRUD (Create, Read, Update, Delete) de produtos, com backend em PHP puro (API REST) e frontend em JavaScript puro (sem framework), consumindo a API via `axios`. Desenvolvido como projeto de curso.

## Stack

- **Backend**: PHP 8.3 (sem framework), SQLite via PDO
- **Frontend**: JavaScript puro (ES Modules), Vite (bundler), Axios, Bootstrap 5
- **Infraestrutura**: Docker + Docker Compose (containers separados para frontend e backend)

## Funcionalidades

- CRUD completo de produtos (nome, preço, estoque, categoria)
- Validação de dados no backend (campos obrigatórios, regras de negócio)
- Persistência em banco SQLite
- Busca de produtos por nome via query string (`?name=...`)
- Modal de confirmação (Bootstrap) para exclusão, no lugar do `confirm()` nativo
- Edição parcial (PATCH) e completa (PUT)

## Arquitetura

O backend segue uma arquitetura em camadas, com separação de responsabilidades:

index.php → roteamento + CORS
api.php → despacho por método HTTP
controllers.php → camada de controle (entrada/saída HTTP)
services.php → camada de negócio (validação, regras)
data.php → camada de acesso a dados (SQLite/PDO)


## Endpoints da API

| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/products` | Lista todos os produtos |
| GET | `/api/products?name=termo` | Filtra produtos por nome |
| POST | `/api/products` | Cria um novo produto |
| PUT | `/api/products?id=1` | Atualiza um produto (substituição completa) |
| PATCH | `/api/products?id=1` | Atualiza um produto (parcial) |
| DELETE | `/api/products?id=1` | Remove um produto |

### Corpo esperado (POST/PUT)

```json
{
  "name": "Notebook Gamer",
  "price": 4599.90,
  "stock": 12,
  "category": "Electronics"
}
```

## Como rodar

Pré-requisitos: Docker e Docker Compose instalados.

### Backend

```bash
cd crud-api
docker compose up -d --build
```

A API sobe em `http://localhost:8000`.

### Frontend

```bash
cd crud-frontend-axios
docker compose up -d --build
```

A aplicação sobe em `http://localhost:8080`.

## Estrutura do projeto

projeto-crud-php-js/
├── crud-api/ # Backend PHP
│ ├── data/ # Banco SQLite (persistido via volume)
│ ├── src/
│ │ ├── config/ # Configuração (CORS, caminho do banco)
│ │ ├── public/ # index.php (entrypoint)
│ │ └── src/ # Controllers, services, validation, data
│ ├── Dockerfile
│ └── compose.yaml
└── crud-frontend-axios/ # Frontend JS
├── src/
│ ├── scripts/
│ │ ├── api/ # Chamadas à API (create, read, update, delete)
│ │ └── dom/ # Renderização de produtos
│ └── app.js # Lógica principal da aplicação
├── Dockerfile
└── compose.yaml


## Melhorias futuras

- Autenticação/autorização
- Testes automatizados
- Migração de SQLite para um banco cliente-servidor (MySQL/PostgreSQL)
- Paginação na listagem de produtos

Uma observação: ajustei a seção "Como rodar" pra portas 8000 (backend) e 8080 (frontend), que foi o que usamos nas correções — confirma se são essas mesmas antes de colar, caso você tenha mudado algo depois.

Quer ser notificado quando Claude responder?
