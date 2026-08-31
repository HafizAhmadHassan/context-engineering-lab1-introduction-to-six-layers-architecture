# Context Engineering Lab
*Created: 2026-08-31*

A **production-ready MERN stack** application for teaching Context Engineering by allowing users to experiment with different context layers and observe how they affect LLM response quality.

## Features

- **Six Context Layers** — System Prompt, User Input, Conversation History, RAG Knowledge, Recent Conversation, State & Memory
- **LLM Provider Support** — OpenAI (GPT-4o, GPT-4o-mini, GPT-4-turbo, GPT-3.5-turbo) & Gemini (Gemini 2.5 Pro, Gemini 2.5 Flash)
- **Monaco Editor** — Professional code editor for each context layer with syntax highlighting
- **Prompt Builder** — Concatenates enabled layers into a single prompt with live token/word/char counts
- **Automatic Quality Evaluation** — LLM-as-a-Judge evaluation across 8 criteria (Persona Adherence, Policy Accuracy, Empathy Tone, Context Awareness, Actionability, Personalisation, No Hallucination, Completeness)
- **Visual Analytics** — Radar chart, bar chart, circular gauge, token usage chart, quality trend chart
- **Experiment History** — Save, compare, favourite, and delete experiments
- **Authentication** — JWT-based auth with register/login
- **User Settings** — Default provider, favourite model, theme toggle, auto-save preferences
- **Export** — JSON, Markdown, PDF, CSV export options
- **Dark Mode** — Professional dark dashboard inspired by OpenAI Playground, LangSmith, and Anthropic Console

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS, shadcn/ui, Monaco Editor, Plotly.js, Framer Motion, Zustand, React Query, React Router |
| Backend | Node.js, Express.js, TypeScript, MongoDB, Mongoose |
| Auth | JWT, bcrypt |
| LLM | OpenAI SDK, Google Gemini SDK |
| Validation | Zod |
| Charts | Plotly.js, Recharts |
| Containers | Docker, docker-compose |

## Project Structure

```
ContextEngineeringLab/
├── client/                     # React frontend
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   └── ui/            # shadcn/ui primitives
│   │   ├── pages/             # Route pages
│   │   ├── layouts/           # Layout wrappers
│   │   ├── hooks/             # Custom React hooks
│   │   ├── services/          # API service layer
│   │   ├── store/             # Zustand state management
│   │   ├── types/             # TypeScript type definitions
│   │   ├── utils/             # Utility functions
│   │   ├── charts/            # Plotly chart components
│   │   └── context/           # React context providers
│   ├── Dockerfile
│   └── package.json
├── server/                     # Express backend
│   ├── src/
│   │   ├── config/            # App configuration
│   │   ├── controllers/       # Route controllers
│   │   ├── middleware/        # Express middleware
│   │   ├── models/            # Mongoose models
│   │   ├── routes/            # API route definitions
│   │   ├── services/          # Business logic
│   │   ├── utils/             # Helper utilities
│   │   ├── types/             # TypeScript types
│   │   └── validators/        # Zod validation schemas
│   ├── Dockerfile
│   └── package.json
├── shared/                     # Shared types
├── docker-compose.yml
└── README.md
```

## Quick Start

### Prerequisites

- Node.js 20+
- MongoDB 7+ (or Docker)
- npm

### Local Development

```bash
# Clone and install dependencies
git clone <repo-url>
cd ContextEngineeringLab

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install

# Configure environment
cp server/.env.example server/.env
# Edit server/.env with your API keys and JWT secret

# Start MongoDB (if not running)
mongod

# Start server (in one terminal)
cd server
npm run dev

# Start client (in another terminal)
cd client
npm run dev
```

The application will be available at:
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000/api

### Docker Deployment

```bash
docker compose up --build
```

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Sign in |
| GET | `/api/auth/profile` | Get profile (auth) |

### Generation

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/generate` | Generate LLM response with evaluation |

### Experiments

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/experiments` | List experiments (paginated) |
| GET | `/api/experiments/stats` | Aggregate statistics |
| GET | `/api/experiments/:id` | Get experiment by ID |
| DELETE | `/api/experiments/:id` | Delete experiment |
| PATCH | `/api/experiments/:id` | Update experiment (favourite, tags) |

### Settings

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/settings` | Get user settings |
| PUT | `/api/settings` | Update user settings |

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/context-engineering-lab` |
| `JWT_SECRET` | JWT signing secret | (required) |
| `JWT_EXPIRES_IN` | Token expiry | `7d` |
| `OPENAI_API_KEY` | OpenAI API key | (optional) |
| `GEMINI_API_KEY` | Google Gemini API key | (optional) |
| `NODE_ENV` | Environment mode | `development` |
| `CLIENT_URL` | CORS origin | `http://localhost:5173` |

## Context Layers

The application demonstrates six context layers that influence LLM responses:

1. **System Prompt** — Foundation instructions defining AI behaviour, persona, and constraints
2. **User Input** — The primary user query or instruction
3. **Conversation History** — Prior exchanges providing conversation continuity
4. **Retrieved Knowledge (RAG)** — Relevant documents from external knowledge sources
5. **Recent Conversation** — Latest exchanges for immediate context
6. **State & Memory** — User profile, preferences, session memory, runtime state

## Evaluation Criteria

Each generation is automatically evaluated across eight quality dimensions:

| Criterion | Description |
|-----------|-------------|
| Persona Adherence | How well the response maintains the assigned persona |
| Policy Accuracy | Factual and policy compliance |
| Empathy Tone | Appropriateness of emotional tone |
| Context Awareness | How well the response uses provided context |
| Actionability | How actionable the advice or information is |
| Personalisation | How tailored the response is to the user |
| No Hallucination | Avoidance of making up information |
| Completeness | Thoroughness of the response |

## Extending

### Adding a Provider

1. Create `server/src/services/your-provider.service.ts` implementing the `IProvider` interface
2. Add the provider class to `server/src/services/llm.factory.ts`
3. Add pricing to `server/src/types/index.ts` `PRICING` config
4. Add the provider to the client's `Sidebar.tsx` `PROVIDERS` array

### Adding a Context Layer

1. Add layer definition to `server/src/services/prompt.service.ts` `DEFAULT_LAYERS`
2. Add corresponding layer to `client/src/utils/format.ts` `DEFAULT_LAYERS`

## Architecture

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│  React SPA  │────▶│  Express API │────▶│   MongoDB   │
│  (Vite)     │     │  (TypeScript)│     │  (Mongoose) │
└─────────────┘     └──────┬───────┘     └─────────────┘
                           │
                    ┌──────┴───────┐
                    │  LLM Service │
                    │   Factory    │
                    └──────┬───────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
        ┌─────┴─────┐ ┌───┴────┐ ┌────┴─────┐
        │  OpenAI   │ │ Gemini │ │  Future  │
        │  Service  │ │Service │ │Providers │
        └───────────┘ └────────┘ └──────────┘
```

## License

MIT


## Errors
lsof -i :27017
mongosh 
 mongod  
sudo mkdir -p /data/db   
sudo chown -R $(whoami) /data/db
mkdir -p ~/data/db  
mongod --dbpath ~/data/db