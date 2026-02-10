# AgentDesk: AI-Powered Customer Support System 🤖

![AgentDesk Banner](https://via.placeholder.com/1200x400?text=AgentDesk+AI+Support+System)

> **AgentDesk** is a next-generation customer support platform powered by a multi-agent AI architecture. It intelligently routes queries to specialized agents, maintains conversation context, and provides real-time streaming responses.

## 🚀 Features

- **Multi-Agent Architecture**:
  - **Router Agent**: Analyzes intent and delegates tasks.
  - **Support Agent**: Handles general inquiries and troubleshooting.
  - **Order Agent**: Manages order tracking, status, and modifications.
  - **Billing Agent**: Resolves payment issues and refund requests.
- **Real-time Streaming**: AI responses are streamed for a responsive user experience.
- **Context-Aware**: Maintains conversation history for personalized support.
- **Type-Safe API**: End-to-end type safety using Hono RPC.
- **Modern UI**: Built with React, TailwindCSS, and shadcn/ui.

## 🛠️ Tech Stack

**Backend**
- [Hono.dev](https://hono.dev) - Ultrafast web framework
- [PostgreSQL](https://www.postgresql.org/) - Relational database
- [Prisma](https://www.prisma.io/) - Next-generation ORM
- [Vercel AI SDK](https://sdk.vercel.ai/docs) - AI integration

**Frontend**
- [React](https://react.dev/) - UI Library
- [Vite](https://vitejs.dev/) - Build tool
- [TailwindCSS](https://tailwindcss.com/) - Utility-first CSS
- [TanStack Query](https://tanstack.com/query/latest) - Async state management

**Monorepo**
- [TurboRepo](https://turbo.build/) - High-performance build system

## 📂 Project Structure

```bash
.
├── apps
│   ├── api        # Hono backend
│   └── web        # React frontend
├── packages
│   ├── db         # Shared Prisma schema & client
│   └── config     # Shared ESLint/TSConfig
└── README.md
```

## 🚦 Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL Database URL
- OpenAI/Anthropic API Key

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

## 📜 License

MIT
