# To-Do List – API de Gerenciamento de Benefícios

## Etapa 1: Setup e desenvolvimento do projeto
[X] Finalizado
---

## Etapa 4: Validações

* [ ] Implementar validações:
  * `name`: obrigatório, 3 a 100 caracteres
  * `description`: até 255 caracteres
* [ ] Responder com **HTTP 400** em caso de erro

---

## Etapa 5: Testes Automatizados

* [ ] Testar `GET /benefits`
* [ ] Testar criação válida (`POST /benefits`)
* [ ] Testar criação inválida (`POST /benefits`)
* [ ] Testar ativação/desativação
* [ ] Testar exclusão
* [ ] Testar erros (ID inexistente, payload inválido)

---

## Etapa 6: Extensões Opcionais

## Funcionalidades Avançadas

* [ ] Paginação e ordenação em `GET /benefits`
* [ ] Adicionar documentação Swagger (`swagger-jsdoc`, `swagger-ui-express`)
* [ ] Adicionar métricas com `prom-client`

## Containerização e Deploy

* [ ] Criar `Dockerfile` para a aplicação
* [ ] Criar `docker-compose.yml` (se necessário)
* [ ] Testar aplicação containerizada localmente

## CI/CD

* [ ] Criar pipeline `.yaml` para Azure DevOps:

  * [ ] Instalar dependências
  * [ ] Rodar testes
  * [ ] Build da imagem Docker
  * [ ] Deploy no **Cloud Run** do GCP