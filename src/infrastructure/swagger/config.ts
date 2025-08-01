import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Edoo API',
      version: '1.0.0',
      description: 'API for managing benefits',
      contact: {
        name: 'Leu Almeida',
        email: 'leo@webid.net.br'
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Local server'
      }
    ],
    tags: [
      {
        name: 'Benefits',
        description: 'Benefits management endpoints'
      },
      {
        name: 'Health',
        description: 'Health check endpoint'
      }
    ],
    paths: {
      '/health': {
        get: {
          tags: ['Health'],
          summary: 'Check API health status',
          responses: {
            200: {
              description: 'API is healthy',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      status: {
                        type: 'string',
                        example: 'ok'
                      },
                      timestamp: {
                        type: 'string',
                        format: 'date-time',
                        example: '2024-03-14T12:00:00.000Z'
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      '/benefits': {
        get: {
          tags: ['Benefits'],
          summary: 'List all benefits with pagination and sorting',
          parameters: [
            {
              in: 'query',
              name: 'page',
              schema: {
                type: 'integer',
                minimum: 1,
                default: 1
              },
              description: 'Page number'
            },
            {
              in: 'query',
              name: 'limit',
              schema: {
                type: 'integer',
                minimum: 1,
                maximum: 100,
                default: 10
              },
              description: 'Number of items per page'
            },
            {
              in: 'query',
              name: 'sortBy',
              schema: {
                type: 'string',
                enum: ['id', 'name', 'description', 'isActive', 'createdAt', 'updatedAt']
              },
              description: 'Field to sort by'
            },
            {
              in: 'query',
              name: 'sortOrder',
              schema: {
                type: 'string',
                enum: ['ASC', 'DESC'],
                default: 'ASC'
              },
              description: 'Sort order (ascending or descending)'
            }
          ],
          responses: {
            200: {
              description: 'List of benefits with pagination info',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      items: {
                        type: 'array',
                        items: {
                          $ref: '#/components/schemas/Benefit'
                        }
                      },
                      total: {
                        type: 'integer',
                        description: 'Total number of items',
                        example: 50
                      },
                      page: {
                        type: 'integer',
                        description: 'Current page number',
                        example: 1
                      },
                      limit: {
                        type: 'integer',
                        description: 'Number of items per page',
                        example: 10
                      },
                      totalPages: {
                        type: 'integer',
                        description: 'Total number of pages',
                        example: 5
                      }
                    }
                  }
                }
              }
            },
            400: {
              description: 'Invalid parameters',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error'
                  }
                }
              }
            },
            500: {
              description: 'Internal server error',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error'
                  }
                }
              }
            }
          }
        },
        post: {
          tags: ['Benefits'],
          summary: 'Create a new benefit',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['name'],
                  properties: {
                    name: {
                      type: 'string',
                      minLength: 3,
                      maxLength: 100
                    },
                    description: {
                      type: 'string',
                      maxLength: 255
                    }
                  }
                }
              }
            }
          },
          responses: {
            201: {
              description: 'Benefit created successfully',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Benefit'
                  }
                }
              }
            },
            400: {
              description: 'Invalid input',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error'
                  }
                }
              }
            },
            500: {
              description: 'Internal server error',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error'
                  }
                }
              }
            }
          }
        }
      },
      '/benefits/{id}/activate': {
        put: {
          tags: ['Benefits'],
          summary: 'Activate a benefit',
          parameters: [
            {
              in: 'path',
              name: 'id',
              required: true,
              schema: {
                type: 'integer'
              },
              description: 'Benefit ID'
            }
          ],
          responses: {
            200: {
              description: 'Benefit activated successfully',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Benefit'
                  }
                }
              }
            },
            404: {
              description: 'Benefit not found',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error'
                  }
                }
              }
            },
            500: {
              description: 'Internal server error',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error'
                  }
                }
              }
            }
          }
        }
      },
      '/benefits/{id}/deactivate': {
        put: {
          tags: ['Benefits'],
          summary: 'Deactivate a benefit',
          parameters: [
            {
              in: 'path',
              name: 'id',
              required: true,
              schema: {
                type: 'integer'
              },
              description: 'Benefit ID'
            }
          ],
          responses: {
            200: {
              description: 'Benefit deactivated successfully',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Benefit'
                  }
                }
              }
            },
            404: {
              description: 'Benefit not found',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error'
                  }
                }
              }
            },
            500: {
              description: 'Internal server error',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error'
                  }
                }
              }
            }
          }
        }
      },
      '/benefits/{id}': {
        delete: {
          tags: ['Benefits'],
          summary: 'Delete a benefit',
          parameters: [
            {
              in: 'path',
              name: 'id',
              required: true,
              schema: {
                type: 'integer'
              },
              description: 'Benefit ID'
            }
          ],
          responses: {
            204: {
              description: 'Benefit deleted successfully'
            },
            404: {
              description: 'Benefit not found',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error'
                  }
                }
              }
            },
            500: {
              description: 'Internal server error',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error'
                  }
                }
              }
            }
          }
        }
      }
    },
    components: {
      schemas: {
        Benefit: {
          type: 'object',
          required: ['name'],
          properties: {
            id: {
              type: 'integer',
              description: 'Benefit unique identifier',
              example: 1
            },
            name: {
              type: 'string',
              description: 'Benefit name',
              minLength: 3,
              maxLength: 100,
              example: 'Health Insurance'
            },
            description: {
              type: 'string',
              description: 'Benefit description',
              maxLength: 255,
              example: 'Complete medical coverage for employees'
            },
            isActive: {
              type: 'boolean',
              description: 'Whether the benefit is active',
              default: true,
              example: true
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Error message',
              example: 'Benefit not found'
            }
          }
        }
      }
    }
  },
  apis: []
};

export const swaggerSpec = swaggerJsdoc(options);
