# ResearchFlow — Multi-Agent AI Research & Report Generator

**ResearchFlow** is an advanced autonomous multi-agent research platform built with Next.js 15, React 19, and Tailwind CSS v4. It orchestrates specialized AI agents to perform collaborative planning, parallel web research, real-time synthesis, and automated claim verification.

---

## Key Features

- **Collaborative Research Planning**: Deconstruct complex topics into structured sections and targeted sub-questions with the Planner Agent.
- **Parallel Multi-Agent Research**: Coordinate specialized research agents executing domain-specific web indexing and data extraction concurrently.
- **Live Orchestration & Telemetry**: Visualize real-time activity timelines, agent status, token consumption, and cost tracking.
- **Automated Claim Verification**: Fact-checking engine that flags conflicting source data and unverified assertions.
- **Interactive Reports**: Synthesized research dossier featuring citation hover cards, confidence scores, table of contents, and multi-format exports (PDF / Markdown).
- **Timeline Replay**: Interactive replay of past research runs step-by-step.

---

## Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **UI & State**: [React 19](https://react.dev/), Context API
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) via `@tailwindcss/postcss`
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Motion / Framer Motion](https://motion.dev/)
- **Visuals**: [Canvas Confetti](https://github.com/catdad/canvas-confetti)
- **AI Integration**: [@google/genai](https://www.npmjs.com/package/@google/genai)

---

## Project Structure

```text
researchflow/
├── public/                 # Static assets & public media
├── src/
│   ├── app/                # Next.js App Router (layout, page, globals.css)
│   ├── components/         # Feature UI components
│   │   ├── agents/         # Agent cluster architecture overview
│   │   ├── history/        # History runs & timeline replay modal
│   │   ├── landing/        # Landing page sections & features
│   │   ├── layout/         # Persistent sidebar & top header
│   │   ├── live/           # Live agent orchestration & streaming panel
│   │   ├── plan/           # Research brief planning & review
│   │   ├── report/         # Synthesized report, bibliography & export
│   │   └── research/       # New research brief creator & depth selector
│   ├── context/            # ResearchContext state & simulation engine
│   ├── lib/                # Shared utilities & helpers (cn)
│   ├── mocks/              # Mock agents, events, plans, sources & reports
│   └── types/              # TypeScript interface & type definitions
├── next.config.ts          # Next.js configuration
├── postcss.config.mjs      # Tailwind CSS v4 PostCSS configuration
├── tsconfig.json           # TypeScript configuration with @/* path aliases
└── package.json            # Scripts & project dependencies
```

---

## Getting Started

### Prerequisites

- **Node.js**: `v18.17.0` or higher
- **Package Manager**: `npm`, `pnpm`, or `bun`

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/researchflow.git
   cd researchflow
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env.local` file in the root directory:
   ```env
   # Gemini API Key (Required for live Gemini AI API integration)
   GEMINI_API_KEY="your_gemini_api_key_here"

   # App URL
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

---

## Available Scripts

In the project directory, you can run:

### `npm run dev`
Runs the application in development mode with Next.js App Router on [http://localhost:3000](http://localhost:3000).

### `npm run build`
Builds the app for production to the `.next` folder with optimized static generation and type-checking.

### `npm start`
Starts the production server after running `npm run build`.

### `npm run lint`
Runs Next.js built-in linting and TypeScript checks.

---

## License

This project is licensed under the MIT License.
