# MCP n8n Server Usage Examples

This document contains examples of how to use the n8n MCP server with Claude AI or Claude Desktop.

## Setting Up as a Remote MCP Server

You can use the n8n MCP server as a remote service with Claude AI. Here's how to set it up:

1. Install the package globally:

   ```bash
   npm install -g mcp-n8n-server
   ```

2. Create a `.env` file in your working directory with your n8n connection details:

   ```
   N8N_HOST_URL=https://your-n8n-instance.com
   PROJECT_ID=your_project_id_here
   N8N_API_KEY=your_api_key_here
   ```

3. Verify your connection:

   ```bash
   mcp-n8n-verify
   ```

4. Use the connection string when configuring your MCP client.

## Conversation Examples

Here are some example conversations you can have with Claude when the MCP n8n server is connected:

### Listing Workflows

**User**: "Can you list all the available n8n workflows?"

Claude will use the `list-workflows` tool to fetch and display all workflows from your n8n instance.

### Listing Workflow Webhooks

**User**: "Can you show me all webhooks in workflow with ID '123'?"

Claude will use the `list-workflow-webhooks` tool to fetch and display all webhooks from the specified workflow.

### Calling Webhooks

**User**: "Can you call the webhook at 'https://example.com/webhook/path'?"

Claude will use the `call-webhook-get` tool to make a GET request to the specified webhook URL.

**User**: "I need to send this data to my webhook: { 'customerId': '12345', 'action': 'update' }"

Claude will use the `call-webhook-post` tool to make a POST request to the webhook with the provided data.

## Prompting Best Practices

When working with the n8n MCP server, consider these best practices:

1. **Be specific about workflow IDs and webhook URLs**: Include these directly in your request when possible.

2. **Format data as JSON**: When providing data for webhooks, format it as valid JSON to ensure proper parsing.

3. **Ask for confirmation**: When calling webhooks that make changes, consider asking Claude to describe what will happen before confirming the execution.

## Troubleshooting

If you encounter issues:

1. **Check n8n connectivity**: Make sure your n8n instance is running and accessible.

2. **Verify API key**: Ensure your API key in the `.env` file is correct and has sufficient permissions.

3. **Check logs**: If tools aren't appearing or returning errors, check the logs in your terminal.

4. **Restart services**: Try restarting both the n8n instance and the MCP server.
