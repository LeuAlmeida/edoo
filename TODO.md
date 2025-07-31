# To-Do List – API de Gerenciamento de Benefícios

## Setup e desenvolvimento do projeto
[X] Finalizado
---

## Validações

* [X] Implementar validações:
  * `name`: obrigatório, 3 a 100 caracteres
  * `description`: até 255 caracteres
* [X] Responder com **HTTP 400** em caso de erro

---

## Testes Automatizados

* [X] Testar `GET /benefits`
* [X] Testar criação válida (`POST /benefits`)
* [X] Testar criação inválida (`POST /benefits`)
* [X] Testar ativação/desativação
* [X] Testar exclusão
* [X] Testar erros (ID inexistente, payload inválido)

---

## Extensões Opcionais

## Funcionalidades avançadas

* [ ] Paginação e ordenação em `GET /benefits`
* [ ] Adicionar documentação Swagger (`swagger-jsdoc`, `swagger-ui-express`)
* [ ] Adicionar métricas com `prom-client`

## Containerização e Deploy

* [X] Criar `Dockerfile` para a aplicação
* [X] Criar `docker-compose.yml` (se necessário)
* [X] Testar aplicação containerizada localmente
* [X] Subir documentação para execução c/ Docker

## CI/CD

* [ ] Criar pipeline `.yaml` para Azure DevOps:
  * [ ] Instalar dependências
  * [ ] Rodar testes
  * [ ] Build da imagem Docker
  * [ ] Deploy no **Cloud Run** do GCP