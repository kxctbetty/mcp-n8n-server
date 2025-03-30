#!/usr/bin/env node

import dotenv from 'dotenv';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
// Initialize dotenv
dotenv.config();

import axios from 'axios';

// Create server instance
const server = new McpServer({
  name: 'n8n',
  version: '1.0.2',
});

// n8n API configuration
const n8nApi = axios.create({
  baseURL: process.env.N8N_HOST_URL + '/api/v1',
  headers: {
    'X-N8N-API-KEY': process.env.N8N_API_KEY,
  },
});

// List all workflows tool
server.tool('list-workflows', {}, async () => {
  try {
    const response = await n8nApi.get(
      process.env.PROJECT_ID
        ? `/workflows?projectId=${process.env.PROJECT_ID}`
        : '/workflows'
    );
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(response.data, null, 2),
        },
      ],
    };
  } catch (error: any) {
    return {
      content: [
        {
          type: 'text',
          text: `Error fetching workflows: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
});

// List all webhooks in a workflow
server.tool(
  'list-workflow-webhooks',
  {
    id: z.string().describe('The ID of the workflow to get webhooks from'),
  },
  async ({ id }) => {
    try {
      const response = await n8nApi.get(`/workflows/${id}`);
      const workflow = response.data;

      if (!workflow.nodes) {
        return {
          content: [
            {
              type: 'text',
              text: 'No nodes found in this workflow.',
            },
          ],
        };
      }

      const webhookNodes = workflow.nodes
        .filter(
          (node: any) =>
            node.webhookId !== undefined && node.parameters?.path !== undefined
        )
        .map((node: any) => ({
          id: node.webhookId,
          name: node.name,
          path: node.parameters.path,
          url: `${process.env.N8N_HOST_URL}/webhook/${node.parameters.path}`,
          test_url: `${process.env.N8N_HOST_URL}/webhook-test/${node.parameters.path}`,
        }));

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(webhookNodes, null, 2),
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: 'text',
            text: `Error fetching workflow webhooks: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  }
);

// GET webhook tool
server.tool(
  'call-webhook-get',
  {
    url: z.string().describe('The webhook URL to call'),
  },
  async ({ url }) => {
    try {
      const response = await axios.get(url);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(response.data, null, 2),
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: 'text',
            text: `Error calling webhook: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  }
);

// POST webhook tool
server.tool(
  'call-webhook-post',
  {
    url: z.string().describe('The webhook URL to call'),
    data: z
      .object({})
      .passthrough()
      .describe('Data to send in the POST request body'),
  },
  async ({ url, data }) => {
    try {
      const response = await axios.post(url, data);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(response.data, null, 2),
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: 'text',
            text: `Error calling webhook: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('n8n MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error in main():', error);
  process.exit(1);
});
