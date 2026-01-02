<div align="center">

<img src="https://files.catbox.moe/vumztw.png" alt="AIDEN Logo" width="100" />

<br/>

# AIDEN - AI-Powered Crypto Intelligence Agent

**A multi-platform crypto intelligence agent powered by the `@iqai/adk`
framework.**

_Telegram Bot • HTTP API • English/Korean/Chinese Support • Real-time Crypto
Data_

---

</div>

AIDEN is an intelligent agent system designed to provide cryptocurrency
information, prices, and insights across multiple platforms. Built with the ADK
TypeScript framework, it supports both Telegram bot interactions and HTTP API
access.

## 🌟 Features

### Core Capabilities

- **Multi-language Support**: Automatic language detection for English, Korean,
  and Chinese
- **Crypto Price Tracking**: Real-time cryptocurrency prices from CoinGecko (via
  IQ.wiki Gateway)
- **IQ AI Agent Data**: Access to IQ AI agent marketplace data including agent
  prices, market stats, holders, and portfolio tracking
- **Token Information**: Detailed token data, market stats, and trending coins
- **DeFi Protocol Data**: Integration with DeBank and DeFiLlama for DeFi
  protocol information
- **Blockchain Explorer**: Etherscan integration for on-chain data

### Platform Support

- **Telegram Bot**: Interactive bot with custom commands
  - Polling mode for development
  - Webhook mode for production
- **HTTP REST API**: RESTful endpoints for programmatic access
  - API key authentication
  - Query processing

### Architecture

- **Multi-agent System**: Language detection → Workflow routing → Specialized
  Agents
- **MCP Server Integration**: Modular cryptocurrency data providers
- **Stateless Design**: Each request processed independently for scalability
- **Database Persistence**: PostgreSQL storage for analytics and history

## 🚀 Quick Start

### Prerequisites

```bash
node >= 18.0.0
pnpm >= 8.0.0
PostgreSQL >= 14.0
```

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/IQAIcom/aiden
cd aiden
pnpm install
```

2. **Configure environment variables**

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```bash
# Required API Keys
OPENROUTER_API_KEY=your_openrouter_key
COINGECKO_PRO_API_KEY=your_coingecko_key
IQ_GATEWAY_URL=https://api.iq.wiki/graphql
IQ_GATEWAY_KEY=your_iq_gateway_key
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_key

# Database (optional but recommended)
DATABASE_URL=postgresql://user:password@localhost:5432/aiden

# Telegram Bot (optional)
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_MODE=polling  # or "webhook"

# HTTP API (optional)
API_ENABLED=true
API_PORT=3000

# LLM Configuration
LLM_MODEL=openai/gpt-4.1-mini  # or other OpenRouter models
```

3. **Set up the database** (if using persistence)

```bash
pnpm prisma generate
pnpm prisma db push
```

4. **Start the application**

```bash
pnpm start
```

## 📱 Telegram Bot Usage

### Setup

1. Create a bot via [@BotFather](https://t.me/BotFather)
2. Copy the bot token to `TELEGRAM_BOT_TOKEN` in `.env`
3. Choose your mode:
   - **Polling** (development): `TELEGRAM_MODE=polling`
   - **Webhook** (production): `TELEGRAM_MODE=webhook`

### Available Commands

#### Public Commands

- `/start` - Initialize the bot and get welcome message
- `/help` - Display available commands and usage
- `/price [token]` - Get current price of a cryptocurrency
  - Examples: `/price btc`, `/price ethereum`
  - Without args: shows last tracked token price
- `/summary` - Get a summary of recent activity

#### Admin Commands (Private chats only)

- `/auth <api_key>` - Authenticate with your team API key
- `/link <url>` - Add a tracked token (CoinGecko or IQ.wiki URL)
- `/unlink <provider> [indices]` - Remove tracked token links
- `/list` - View tracked tokens

### Features

- **Automatic Language Detection**: Responds in detected language
- **Token Price Tracking**: Link tokens for quick price checks
- **Group Chat Support**: Works in both private and group chats
- **Persistent Sessions**: Chat history and preferences saved

## 🔌 HTTP API Usage

### Setup

Enable the API in your `.env`:

```bash
API_ENABLED=true
API_PORT=3000
```

### Authentication

All `/api/*` endpoints require an API key in the `X-API-Key` header. API keys
are managed in the database:

```sql
INSERT INTO "Team" (name, "apiKeys")
VALUES ('Default Team', ARRAY['your-secret-key']);
```

**Note:** The `/api/query` endpoint requires `DATABASE_URL` to be configured. For testing the agent without a database, use the web interface (`adk web`) instead, which works without database configuration.

### Endpoints

#### 1. Query the Agent

```bash
POST /api/query
Content-Type: application/json
X-API-Key: your-api-key

{
  "query": "What is the price of Bitcoin?",
  "userId": "user_123",
  "metadata": {
    "source": "web-app"
  }
}
```

**Response:**

```json
{
	"success": true,
	"data": {
		"answer": "The current price of Bitcoin is $43,250 USD...",
		"detectedLanguage": "English",
		"duration": 1250,
		"messageId": 12345
	}
}
```

#### 2. Health Check

```bash
GET /health
```

See [API_SETUP.md](API_SETUP.md) for complete API documentation.

## 📁 Project Structure

```
├── src/
│   ├── agents/
│   │   ├── agent.ts                      # Root agent definition
│   │   └── sub-agents/
│   │       ├── language-detector-agent/   # Detects user language
│   │       └── workflow-agent/            # Routes to specialized handlers
│   ├── api/
│   │   ├── server.ts                     # Unified HTTP server
│   │   ├── agent-runner.ts               # API agent session manager
│   │   ├── middleware/
│   │   │   └── auth.ts                   # API key authentication
│   │   └── routes/
│   │       ├── query.ts                  # Query endpoint handler
│   │       └── telegram-webhook.ts       # Telegram webhook handler
│   ├── telegram/
│   │   ├── bot.ts                        # Telegram bot entry point
│   │   ├── telegram-agent-runner.ts      # Telegram agent sessions
│   │   ├── handlers.ts                   # Message processing logic
│   │   ├── commands/                     # Telegram command handlers
│   │   │   ├── auth.ts                   # Authentication
│   │   │   ├── price.ts                  # Price lookup
│   │   │   ├── links.ts                  # Token tracking
│   │   │   └── help.ts                   # Help command
│   │   └── modes/
│   │       ├── polling.ts                # Long-polling mode
│   │       └── webhook.ts                # Webhook mode setup
│   ├── mcp-servers/                      # MCP server integrations
│   │   ├── coingecko-mcp/                # CoinGecko data provider
│   │   ├── debank-mcp/                   # DeBank DeFi data
│   │   ├── defillama-mcp/                # DeFiLlama protocol data
│   │   ├── etherscan-mcp/                # Etherscan blockchain data
│   │   └── iqai/                         # IQ.wiki knowledge data
│   ├── lib/
│   │   ├── db.ts                         # Prisma database client
│   │   └── db-service.ts                 # Database operations
│   ├── env.ts                            # Environment validation
│   └── index.ts                          # Application entry point
├── prisma/
│   └── schema.prisma                     # Database schema
└── API_SETUP.md                          # API documentation
```

## 🏗️ Architecture

### Agent Pipeline

```
User Input
    ↓
Language Detector Agent
    ↓ (detects language)
Workflow Agent
    ↓ (routes to appropriate handler)
Specialized Sub-agents
    ↓ (processes query)
Response Generation
    ↓
Database Persistence (optional)
    ↓
User Output
```

### Platform Flow

**Telegram (Polling Mode):**

```
Telegram API → Long Polling → Message Handler → Agent → (Optional) Database → Response
```

**Telegram (Webhook Mode):**

```
Telegram API → HTTP Server → Webhook Handler → Agent → (Optional) Database → Response
```

**HTTP API:**

```
Client → API Server → Auth Middleware → Query Handler → Agent → (Optional) Database → Response
```

### Key Design Principles

- **Stateless Requests**: Each query creates a fresh agent session
- **Language Support**: Automatic detection across English, Korean, and Chinese
- **Multi-platform**: Unified agent logic across Telegram and HTTP
- **Persistence Optional**: Works with or without database
- **Modular MCP Servers**: Easy to add new data sources

## 🧰 Development

### Running Different Modes

**Development (Polling + API):**

```bash
TELEGRAM_MODE=polling API_ENABLED=true pnpm start
```

**Production (Webhook + API):**

```bash
TELEGRAM_MODE=webhook API_ENABLED=true pnpm start
```

**API Only:**

```bash
API_ENABLED=true pnpm start
# Don't set TELEGRAM_BOT_TOKEN
```

### Database Management

**Generate Prisma Client:**

```bash
pnpm prisma generate
```

**Apply Schema Changes:**

```bash
pnpm prisma db push
```

**View Database:**

```bash
pnpm prisma studio
```

### Testing

**Test Telegram Bot:**

1. Start in polling mode
2. Message your bot on Telegram
3. Try commands: `/start`, `/help`, `/price btc`

**Test HTTP API:**

```bash
# Health check
curl http://localhost:3000/health

# Query (with API key)
curl -X POST http://localhost:3000/api/query \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-key" \
  -d '{"query": "What is the price of Ethereum?"}'
```

## 🔧 Configuration

### Environment Variables

| Variable                       | Required | Default               | Description                                                                    |
| ------------------------------ | -------- | --------------------- | ------------------------------------------------------------------------------ |
| `ADK_DEBUG`                    | No       | `false`               | Enable ADK debug logging                                                       |
| `OPENROUTER_API_KEY`           | Yes      | -                     | OpenRouter API key for LLM access                                              |
| `COINGECKO_PRO_API_KEY`        | Yes      | -                     | CoinGecko API key                                                              |
| `COINGECKO_ENVIRONMENT`        | No       | `demo`                | `pro` or `demo` environment toggle                                             |
| `LLM_MODEL`                    | No       | `openai/gpt-4.1-mini` | OpenRouter model to use                                                        |
| `IQ_GATEWAY_URL`               | Yes      | -                     | IQ.wiki GraphQL endpoint                                                       |
| `IQ_GATEWAY_KEY`               | Yes      | -                     | IQ.wiki API key                                                                |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Yes      | -                     | Google Gemini API key                                                          |
| `LOG_LEVEL`                    | No       | -                     | Logging level (debug, info, warn, error)                                       |
| `LANGFUSE_PUBLIC_KEY`          | No       | -                     | Langfuse public key (telemetry)                                                |
| `LANGFUSE_SECRET_KEY`          | No       | -                     | Langfuse secret key (telemetry)                                                |
| `LANGFUSE_BASEURL`             | No       | -                     | Langfuse base URL (telemetry)                                                  |
| `TELEGRAM_BOT_TOKEN`           | No       | -                     | Telegram bot token                                                             |
| `TELEGRAM_MODE`                | No       | `polling`             | `polling` or `webhook`                                                         |
| `API_ENABLED`                  | No       | `false`               | Enable HTTP API server                                                         |
| `API_PORT`                     | No       | `3000`                | HTTP server port                                                               |
| `DATABASE_URL`                 | No*      | -                     | PostgreSQL connection string (*required for `/api/query` endpoint; optional for `adk web`) |

### Supported Languages

- English (en)
- Korean (ko)
- Chinese (zh)

## 📊 Database Schema

Key models:

- **Bot**: Platform instances (Telegram, HTTP)
- **Chat**: Conversation threads
- **Message**: Query-response pairs with metadata
- **Team**: Organizations with API keys and settings
- **AnswerSources**: Source attribution for responses

See [prisma/schema.prisma](prisma/schema.prisma) for complete schema.

## 🌐 Deployment

### Telegram Webhook Setup

1. Deploy to a server with HTTPS
2. Set webhook URL:

```bash
curl -X POST "https://api.telegram.org/bot<TOKEN>/setWebhook" \
  -d "url=https://your-domain.com/telegram/webhook"
```

### Docker Deployment (TODO)

```bash
docker build -t aiden .
docker run -p 3000:3000 --env-file .env aiden
```

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📚 Resources

- [ADK Documentation](https://adk.iqai.com)
- [ADK GitHub](https://github.com/IQAIcom/adk-ts)
- [CoinGecko API](https://www.coingecko.com/en/api)
- [IQ.wiki](https://iq.wiki)
- [Telegram Bot API](https://core.telegram.org/bots/api)

## 📄 License

[Add your license here]

## 🆘 Support

For issues or questions:

- Create an issue in this repository
- Check [API_SETUP.md](API_SETUP.md) for API documentation
- Review the ADK documentation

---

Built with the [ADK TypeScript Framework](https://adk.iqai.com) by IQ.wiki
