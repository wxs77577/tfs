#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import "dotenv/config";
import { z } from "zod";

// Get Feishu bot webhook URL from environment variable
const FEISHU_BOT_URL = process.env.FEISHU_BOT_URL;
if (!FEISHU_BOT_URL) {
  throw new Error("FEISHU_BOT_URL environment variable is not set");
}

// Create an MCP server
const version = require("./package.json").version;
const server = new McpServer({
  name: "Feishu Bot",
  version,
});

// Add a call tool to send message to Feishu bot
server.tool(
  "send_feishu_message",
  "通过飞书机器人发送消息",
  { text: z.string() },
  async ({ text }) => {
    try {
      const response = await fetch(FEISHU_BOT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          msg_type: "text",
          content: { text: text },
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to send message: ${response.statusText}`);
      }

      const result = await response.json();
      return {
        content: [{ type: "text", text: JSON.stringify(result) }],
      };
    } catch (error) {
      throw new Error(`Failed to send message: ${(error as Error).message}`);
    }
  }
);

// Start receiving messages on stdin and sending messages on stdout
const transport = new StdioServerTransport();
server.connect(transport);
