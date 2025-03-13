#!/usr/bin/env node
import 'dotenv/config'
import {
  McpServer,
  ResourceTemplate,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// Get Feishu bot webhook URL from environment variable
const FEISHU_BOT_URL = process.env.FEISHU_BOT_URL;
if (!FEISHU_BOT_URL) {
  throw new Error("FEISHU_BOT_URL environment variable is not set");
}

// Create an MCP server
const server = new McpServer({
  name: "Feishu Bot",
  version: "1.0.0",
});

// Add a call tool to send message to Feishu bot
server.tool("send_feishu_message", { message: z.string() }, async ({ message }) => {
  try {
    const response = await fetch(FEISHU_BOT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        msg_type: "text",
        content: { text: message },
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to send message: ${response.statusText}`);
    }

    const result = await response.json();
    return {
      content: [
        { type: "text", text: `Message sent successfully: ${message}` },
      ],
    };
  } catch (error) {
    throw new Error(`Failed to send message: ${(error as Error).message}`);
  }
});

// Start receiving messages on stdin and sending messages on stdout
const transport = new StdioServerTransport();
await server.connect(transport);
