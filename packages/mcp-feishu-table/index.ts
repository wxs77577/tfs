#!/usr/bin/env node
import { BaseClient, LoggerLevel } from "@lark-base-open/node-sdk";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import "dotenv/config";
import Fuse from "fuse.js";
import { z } from "zod";

// Create an MCP server
const version = require("./package.json").version;
const server = new McpServer({
  name: "飞书多维表格",
  version,
});

function getClient() {
  const parsedUrl = new URL(process.env.FEISHU_TABLE_URL!);
  const appToken = parsedUrl.pathname.split("/").pop()!;
  if (!process.env.FEISHU_TABLE_URL || !process.env.FEISHU_TABLE_TOKEN) {
    server.server.sendLoggingMessage({
      level: "error",
      message: "环境变量 FEISHU_TABLE_URL 或 FEISHU_TABLE_TOKEN 未设置",
    });
    throw new Error("环境变量 FEISHU_TABLE_URL 或 FEISHU_TABLE_TOKEN 未设置");
  }
  const client = new BaseClient({
    appToken,
    personalBaseToken: process.env.FEISHU_TABLE_TOKEN,
    loggerLevel: LoggerLevel.error,
  });
  return client;
}

const client = getClient();

server.tool("get_table_list", "获取所有多维表格", async () => {
  const res = await client.base.appTable.list();
  return {
    content: [{ type: "text", text: JSON.stringify(res.data?.items) }],
  };
});

// Add a tool to read first column from Feishu docs
server.tool(
  "read_table",
  "读取飞书多维表格内容",
  {
    tableName: z.string().describe("表格名称"),
  },
  async ({ tableName }) => {
    const tables = await client.base.appTable.list().then((res) => {
      return new Fuse(res.data?.items || [], {
        keys: ["name"],
      });
    });
    const [table] = tables.search(tableName, { limit: 1 }) ?? [];
    if (!table?.item?.table_id) {
      throw new Error(`未找到表格 ${tableName}`);
    }
    const tableId = table.item.table_id!;
    const rows: any[] = [];
    // 遍历记录
    for await (const data of await client.base.appTableRecord.listWithIterator({
      params: { page_size: 50 },
      path: { table_id: tableId },
    })) {
      const records = data?.items || [];
      for (const record of records) {
        rows.push(record.fields);
      }
    }

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            table,
            rows,
          }),
        },
      ],
    };
  }
);

const transport = new StdioServerTransport();
server.connect(transport);
