# MCP Feishu Table

飞书表格操作工具包

## 安装
### [5ire APP (推荐)](https://5ire.app/)

1. 工具 - 新建
2. 命令处填入 `npx -y @topfullstack/mcp-feishu-table`
3. 环境变量 - 新增以下变量：
   - `FEISHU_TABLE_URL`: 飞书多维表格的URL (例如: `https://docs.feishu.cn/base/xxx`)
   - `FEISHU_TABLE_TOKEN`: 飞书多维表格的访问令牌，获取方式参考[飞书文档](https://feishu.feishu.cn/docx/S1pMdbckEooVlhx53ZMcGGnMnKc)

### Claude Desktop

- 参考文档: https://modelcontextprotocol.io/quickstart/user#2-add-the-filesystem-mcp-server

## 功能

### 获取表格列表

```javascript
// 获取所有多维表格列表
await mcp.tool("get_table_list");
```

### 读取表格内容

```javascript
// 读取指定表格的内容
await mcp.tool("read_table", {
  tableName: "表格名称"
});
```
