# Desafio: API de Gerenciamento de Benefícios (Node.js)

## 1. Introdução

O objetivo deste desafio é criar uma **API REST** utilizando **Node.js com Express.js** que permita gerenciar benefícios. A aplicação deve ser simples, mas funcional, com endpoints que possibilitem:

* Criar
* Listar
* Ativar
* Desativar
* Excluir benefícios

Utilize um banco de dados em memória (ex.: SQLite ou NeDB) para facilitar os testes e **implemente testes automatizados** para validar o funcionamento dos endpoints.

---

## 2. Configuração Inicial

### Dependências sugeridas:

* `express` – Para criar a API REST.
* `sequelize` – Para abstração de banco (caso use SQLite).
* `sqlite3` ou `nedb` – Banco de dados simples em memória.
* `dotenv` – Para configuração de variáveis de ambiente.

---

## 3. Modelo: `Benefit`

A entidade **Benefit** deve conter:

* `id` (`Number`): Identificador único (auto incremento).
* `name` (`String`): Nome do benefício (**obrigatório**).
* `description` (`String`): Descrição opcional do benefício.
* `isActive` (`Boolean`): Indica se o benefício está ativo (default: `true`).

---

## 4. Rotas da API

### 1. `GET /benefits`

* **Objetivo:** Listar todos os benefícios cadastrados.
* **Resposta:** JSON com array de benefícios.

---

### 2. `POST /benefits`

* **Objetivo:** Adicionar um novo benefício.
* **Entrada:**

```json
{
  "name": "Plano de Saúde",
  "description": "Cobertura completa"
}
```

* **Resposta:** Benefício criado com `id`.

---

### 3. `PUT /benefits/:id/deactivate`

* **Objetivo:** Marcar um benefício como **inativo**.
* **Resposta:** Objeto atualizado com `isActive = false`.

---

### 4. `PUT /benefits/:id/activate`

* **Objetivo:** Marcar um benefício como **ativo novamente**.
* **Resposta:** Objeto atualizado com `isActive = true`.

---

### 5. `DELETE /benefits/:id`

* **Objetivo:** Remover um benefício do sistema.
* **Resposta:** HTTP 204 (No Content).

---

## 5. Regras e Validações

### `name`

* Não pode ser nulo ou vazio.
* Deve ter entre **3 e 100 caracteres**.

### `description`

* Máximo **255 caracteres**.

### Respostas:

* Retornar **HTTP 400 (Bad Request)** quando as validações falharem.

---

## 6. Testes Automatizados

Crie testes que verifiquem:

* ✅ Listagem de benefícios
* ✅ Criação **válida e inválida**
* ✅ Ativação e desativação
* ✅ Exclusão de benefício
* ✅ Cenários de erro:

  * ID inexistente
  * Payload inválido

---

## 7. Extensões (Opcional)

* [ ] Adicionar **paginação e ordenação** no `GET /benefits`.
* [ ] Adicionar **Swagger** para documentação da API.
* [ ] Incluir **métricas básicas** (ex.: usando `prom-client`).
* [ ] **Containerizar** a aplicação com **Docker**.
* [ ] Criar um pipeline `.yaml` que rode no **Azure DevOps** com CI/CD:

  * Instale o serviço containerizado em um **Cloud Run** do **GCP**.

---

Se quiser, posso converter isso em um arquivo `.md` ou gerar o template do projeto também.
