# @topfullstack/mcp-feishu-bot

一个基于 MCP 协议的飞书机器人工具，可以方便地将消息发送到飞书群聊。

## 安装

> 需要安装 `node` https://nodejs.org/

`npx -y @topfullstack/mcp-feishu-bot`

### [5ire APP (推荐) ](https://5ire.app/)

1.  工具 - 新建
1.  命令处填入`npx @topfullstack/mcp-feishu-bot`
1.  环境变量 - 新增名称为`FEISHU_BOT_URL` - 变量值填入你的[飞书机器人 Webhook URL](https://open.feishu.cn/document/client-docs/bot-v3/bot-overview) (例如: `https://open.feishu.cn/open-apis/bot/v2/hook/478be3c7...`)

### Claude Desktop

- 参考文档: https://modelcontextprotocol.io/quickstart/user#2-add-the-filesystem-mcp-server
