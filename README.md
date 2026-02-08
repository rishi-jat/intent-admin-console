# Intent-Driven Internal Admin Console

A constrained, intentional demonstration of an admin console where user intent drives UI rendering. Users express intent via chat input, and components respond with relevant data views and actions.

Built with [Tambo's Generative UI SDK](https://tambo.co). The system maps specific intents to UI components, enabling focused interactions such as deployment monitoring, approval workflows, and system health status.

---

## Problem Statement

Traditional internal admin tools suffer from several critical issues:

1. **Static dashboards require navigation expertise** - Users must know where features live, memorize menu structures, and click through multiple screens to accomplish tasks.

2. **Context switching is expensive** - Moving between deployment monitoring, approval workflows, and system health checks requires loading different pages and losing context.

3. **One-size-fits-all interfaces fail** - A junior engineer checking deployment status and a senior SRE investigating an outage have different needs, but see the same interface.

4. **Information overload** - Dashboards show everything at once, making it hard to focus on what matters for the current task.

## Why Static UIs Fail for Internal Tools

Internal operations teams work in reactive, context-dependent ways:

- An on-call engineer at 3 AM needs to see **failed deployments and retry options**, not a general dashboard
- A manager reviewing approvals needs to see **pending requests**, not deployment history
- A platform engineer checking system health wants **service status**, not approval queues

Static UIs force users to adapt to the tool. Intent-driven UIs adapt the tool to the user.

## How Generative UI Solves This

Instead of navigating menus, users express what they need:

```
"Show failed deployments" → DeploymentTable (filtered) + ActionPanel
"What needs my approval?" → ApprovalQueue
"How are our services?"   → SystemStatusSummary
```

The UI **becomes the response**. Components appear, update, and disappear based on user intent. The chat input is only an intent capture mechanism—text responses are secondary to UI behavior.

## Supported Intents

This admin console supports **exactly four** intent categories:

| Category | Example Queries | Response Components |
|----------|-----------------|---------------------|
| **Deployment Monitoring** | "Show recent deployments", "What deployed to production?" | `DeploymentTable` |
| **Deployment Failures** | "Show failed deployments", "What's broken?" | `DeploymentTable` + `ActionPanel` |
| **Operational Approvals** | "Show pending approvals", "What needs authorization?" | `ApprovalQueue` |
| **System Health** | "Show system status", "Any services down?" | `SystemStatusSummary` |

Requests outside these categories render a `FallbackIntent` component explaining what IS supported.

## Architecture Overview

```
User Input
    ↓
Intent Classification (bounded, deterministic)
    ↓
Tool Invocation (mock data fetch)
    ↓
Component Rendering (validated props)
    ↓
Interactive UI (actions, state)
```

### File Structure

```
src/
├── components/
│   └── admin/                    # Admin UI components
│       ├── DeploymentTable.tsx   # Deployment history display
│       ├── ActionPanel.tsx       # Contextual actions
│       ├── ApprovalQueue.tsx     # Pending approvals
│       ├── SystemStatusSummary.tsx # Health overview
│       ├── FallbackIntent.tsx    # Unsupported intent handler
│       ├── types.ts              # Shared types and schemas
│       └── index.ts              # Exports
├── tambo/
│   ├── components.ts             # Component registry
│   ├── tools.ts                  # Mock data tools
│   └── intentPolicy.ts           # Intent definitions
├── lib/
│   └── tambo.ts                  # Provider configuration
└── app/
    └── chat/
        └── page.tsx              # Main interface
```

### Key Design Decisions

1. **Zod schemas for all props** - Every component prop is validated. No hallucinated or malformed data reaches the UI.

2. **Explicit intent categories** - A bounded list of supported intents with deterministic component mapping.

3. **Mock data tools** - Tools return predictable data shapes. In production, these would call actual APIs.

4. **No global state** - Components receive all data via props. No hidden dependencies.

5. **Graceful fallbacks** - Unsupported requests show a helpful `FallbackIntent`, not errors or confused text.

## Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure API key**
   ```bash
   cp example.env.local .env.local
   # Add your Tambo API key to .env.local
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open the console**
   Navigate to `http://localhost:3000/chat`

## Example Interactions

### Deployment Monitoring
```
User: "Show me recent deployments"
→ Renders DeploymentTable with all recent deployments
```

### Deployment Failures
```
User: "What deployments failed today?"
→ Renders DeploymentTable (filtered to failed)
→ Renders ActionPanel with retry/view logs/acknowledge options
```

### Operational Approvals
```
User: "Show pending approvals"
→ Renders ApprovalQueue with approve/reject actions
```

### System Health
```
User: "How are our services doing?"
→ Renders SystemStatusSummary with health indicators
```

### Unsupported Intent
```
User: "Book a meeting"
→ Renders FallbackIntent explaining supported actions
```

## Technology Stack

- **Next.js 15** (App Router)
- **React 19**
- **TypeScript** (strict mode)
- **Tambo SDK** (Generative UI)
- **Zod** (Schema validation)
- **Tailwind CSS** (Styling)

## Explicit Non-Goals

- General-purpose app building
- Production API integrations
- User authentication or RBAC
- Real-time data streaming
- Multi-tenant or multi-environment support

## Limitations

This demo is intentionally constrained to highlight intent-driven UI behavior:

- Mock data only: All data is sourced from hardcoded mock objects in `tools.ts`.
- No persistence: Actions (approve, retry) simulate behavior with console logs without modifying state.
- Static data: Health and deployment status do not update in real time.
- Single environment: Designed for a single namespace and dataset.
- Limited action handling: Actions provide visual feedback without backend effects.

## License

MIT
