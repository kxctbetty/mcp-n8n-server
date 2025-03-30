# MCP n8n API Server

A Node.js server that provides an interface to interact with n8n workflows through the Model Context Protocol (MCP).

## Features

- List all n8n workflows
- Trigger specific workflows with custom data
- Integration with Claude Desktop and other MCP clients

## Installation

### Global Installation (Recommended for Remote Usage)

```bash
npm install -g mcp-n8n-server
```

Then configure your n8n connection:

1. Create a `.env` file in your working directory
2. Add your n8n API information (see Configuration section below)

### Local Installation

```bash
git clone https://github.com/yourusername/mcp-n8n-server.git
cd mcp-n8n-server
npm install
```

## Configuration

Create a `.env` file with the following variables:

```
# n8n Host URL (required)
N8N_HOST_URL=https://your-n8n-instance.com

# n8n Project ID (optional - only needed for cloud instances)
PROJECT_ID=your_project_id_here

# n8n API Key (required)
N8N_API_KEY=your_api_key_here
```

## Usage

### As a Remote MCP Server

After installing globally, you can use it as a remote MCP server with Claude AI:

1. Configure Claude AI to use this as a remote MCP server
2. Add the following to your prompt or instructions to Claude:

```
You have access to a remote MCP server for n8n integration. Use it to:
- List all n8n workflows
- Trigger webhooks and workflows
- Get information about available webhooks
```

### As a Local MCP Server

You can run the server locally and connect to it from Claude Desktop:

```bash
# Start the server
npm start
```

Then configure Claude Desktop to use this MCP server:

Edit `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "n8n-server": {
      "command": "node",
      "args": ["/ABSOLUTE/PATH/TO/server-n8n/build/index.js"]
    }
  }
}
```

### REST API (Local Only)

For local development, the server also exposes a REST API:

```bash
# Start the local server
npm start
```

## Setup

1. Install dependencies:

```bash
npm install
```

2. Configure environment variables:

- Copy `.env.example` to `.env` (if not already done)
- Update the following variables in `.env`:
  - `N8N_API_URL`: Your n8n instance URL (default: http://localhost:5678)
  - `N8N_API_KEY`: Your n8n API key

3. Start the server:

```bash
# Start the regular Express API server
npm start

# Start the MCP server (for integration with Claude Desktop and other MCP clients)
npm run mcp
```

For development with auto-reload:

```bash
npm run dev
```

## API Endpoints (Express Server)

### List Workflows

```
GET /api/workflows
```

Returns a list of all workflows from your n8n instance.

### Trigger Workflow

```
POST /api/workflows/:id/trigger
```

Triggers a specific workflow by ID. Optionally send workflow data in the request body.

### Health Check

```
GET /health
```

Returns server health status.

## MCP Tools (for LLM Integration)

The MCP server exposes the following tools for use with Claude Desktop or other MCP clients:

### List Workflows

The `list-workflows` tool returns a list of all available n8n workflows.

### List Workflow Webhooks

The `list-workflow-webhooks` tool returns all webhooks from a specific workflow.

Parameters:

- `id`: The ID of the workflow to get webhooks from

### Call Webhook (GET)

The `call-webhook-get` tool allows calling a webhook with a GET request.

Parameters:

- `url`: The webhook URL to call

### Call Webhook (POST)

The `call-webhook-post` tool allows calling a webhook with a POST request.

Parameters:

- `url`: The webhook URL to call
- `data`: Data to send in the POST request body

## Example Usage (REST API)

### List Workflows

```bash
curl http://localhost:3000/api/workflows
```

### Trigger Workflow

```bash
curl -X POST http://localhost:3000/api/workflows/123/trigger \
  -H "Content-Type: application/json" \
  -d '{"data": "example"}'
```
