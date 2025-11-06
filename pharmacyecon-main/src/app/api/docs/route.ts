import { NextRequest, NextResponse } from 'next/server';

const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Pharmacy Management API',
    version: '1.0.0',
    description: 'API documentation for Pharmacy Management Service',
  },
  servers: [
    {
      url: 'http://localhost:3003',
      description: 'Development server',
    },
  ],
  paths: {
    '/api/health': {
      get: {
        summary: 'Health check endpoint',
        responses: {
          '200': {
            description: 'Service is healthy',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string' },
                    message: { type: 'string' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/medicines': {
      get: {
        summary: 'Get all medicines',
        responses: {
          '200': {
            description: 'List of medicines',
          },
        },
      },
      post: {
        summary: 'Create new medicine',
        responses: {
          '201': {
            description: 'Medicine created',
          },
        },
      },
    },
    '/api/pharmacies': {
      get: {
        summary: 'Get all pharmacies',
        responses: {
          '200': {
            description: 'List of pharmacies',
          },
        },
      },
    },
  },
};

export async function GET() {
  return NextResponse.json(swaggerDocument);
}