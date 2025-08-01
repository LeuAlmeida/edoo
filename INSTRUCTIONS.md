# Instruções de Execução

Este documento descreve como executar a API de Benefícios usando Docker.

## Pré-requisitos

- Docker
- Docker Compose
- Postman (para testes)

## Executando a API

1. Clone o repositório
2. Na raiz do projeto, execute:
```bash
docker-compose up -d
```

A API estará disponível em `http://localhost:3000`.

## Verificando o Status

Para verificar se a API está funcionando:
```bash
curl http://localhost:3000/health
```

## Documentação da API

A documentação completa da API está disponível através do Swagger UI:

```
http://localhost:3000/api/v1/swagger
```

O Swagger fornece uma interface interativa onde você pode:
- Visualizar todos os endpoints disponíveis
- Testar as requisições diretamente pelo navegador
- Ver os modelos de dados e parâmetros aceitos
- Entender as respostas e códigos de status

## Métricas

A API expõe métricas no formato Prometheus em:

```
http://localhost:3000/metrics
```

### Métricas Disponíveis

1. **Métricas HTTP**:
   - `http_request_duration_seconds`: Duração das requisições HTTP
     - Labels: method, route, status_code
     - Tipo: Histogram

2. **Métricas de Negócio**:
   - `benefit_operations_total`: Total de operações por tipo
     - Labels: operation (list, create, activate, deactivate, delete)
     - Tipo: Counter

3. **Métricas do Sistema**:
   - Uso de CPU
   - Uso de memória
   - Métricas do Event Loop
   - Métricas do Garbage Collector

### Exemplo de Consulta Prometheus

```promql
# Taxa de requisições por minuto
rate(http_request_duration_seconds_count[1m])

# Total de benefícios criados
benefit_operations_total{operation="create"}
```

## Testando a API

### Usando Postman

1. Importe o arquivo `edoo-nodejs.postman_collection.json` no Postman
2. A coleção contém todos os endpoints disponíveis:
   - `GET /benefits` - Lista todos os benefícios (com paginação e ordenação)
   - `POST /benefits` - Cria um novo benefício
   - `PUT /benefits/:id/activate` - Ativa um benefício
   - `PUT /benefits/:id/deactivate` - Desativa um benefício
   - `DELETE /benefits/:id` - Remove um benefício

### Parâmetros de Listagem

O endpoint `GET /benefits` suporta os seguintes parâmetros de query:

- `page` (opcional, padrão: 1): Número da página
- `limit` (opcional, padrão: 10): Itens por página (máx: 100)
- `sortBy` (opcional): Campo para ordenação
  - Valores válidos: `id`, `name`, `description`, `isActive`, `createdAt`, `updatedAt`
- `sortOrder` (opcional, padrão: ASC): Direção da ordenação
  - Valores válidos: `ASC`, `DESC`

Exemplos:
```bash
# Listagem padrão (primeira página, 10 itens)
GET http://localhost:3000/benefits

# Segunda página com 5 itens por página
GET http://localhost:3000/benefits?page=2&limit=5

# Ordenado por nome em ordem decrescente
GET http://localhost:3000/benefits?sortBy=name&sortOrder=DESC

# Combinando paginação e ordenação
GET http://localhost:3000/benefits?page=1&limit=5&sortBy=name&sortOrder=DESC
```

### Exemplo de Criação de Benefício

```json
POST http://localhost:3000/benefits
Content-Type: application/json

{
    "name": "Health Insurance",
    "description": "Complete medical coverage for employees"
}
```

### Respostas

A API retorna os seguintes formatos de resposta:

#### Sucesso na Listagem
```json
{
    "items": [...],
    "total": 50,
    "page": 1,
    "limit": 10,
    "totalPages": 5
}
```

#### Erro de Validação
```json
{
    "error": "Mensagem de erro específica"
}
```
