import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Edoo Node.js API',
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
          summary: 'List all benefits',
          responses: {
            200: {
              description: 'List of all benefits',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/Benefit'
                    }
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
