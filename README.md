# Intent-Driven Internal Admin Console

**A production-quality admin console where users express intent and the UI becomes the response.**

Built with [Tambo's Generative UI SDK](https://tambo.co). Say "show failed deployments" and get a deployment table with retry actions—not a text explanation of what you could do. The chat input captures intent; components deliver outcomes.

**Supported intents:** deployment monitoring, deployment failures, operational approvals, system health. Everything else renders a graceful fallback explaining what IS supported.

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

## Non-Goals

This project explicitly **does not** attempt:

1. **General-purpose app building** — Only the four defined intent categories are supported. This is a bounded demonstration of intent → UI mapping, not an extensible platform.

2. **Production API integrations** — All data is mock. The focus is on component architecture and intent classification, not API reliability.

3. **User authentication or RBAC** — No login, no role-based access. Authentication is orthogonal to the generative UI pattern.

4. **Real-time data streaming** — Health checks and deployment status are static snapshots. WebSocket/polling would obscure the core demo.

5. **Multi-tenant or multi-environment support** — Single namespace, single dataset. Complexity is intentionally minimized.

## Limitations

This is a **scoped demonstration**, not a complete admin platform.

### What This Is Not
- **Not a generic app builder** - Only supports the four defined intent categories
- **Not production-ready** - Uses mock data, not real APIs
- **Not authenticated** - No user auth system (out of scope)
- **Not horizontally scalable** - Single-instance design

### Known Constraints
1. **Mock data only** - All data comes from hardcoded mock objects in `tools.ts`
2. **No persistence** - Actions (approve, retry) are simulated with console logs
3. **No real-time updates** - Health data is static, not polling
4. **Single environment** - No multi-tenant or environment switching
5. **Limited action handling** - Actions trigger visual feedback but don't modify state

### Future Work (Not Implemented)
- Real API integrations
- WebSocket for live updates
- User authentication and RBAC
- Audit logging
- Multi-environment support

## License

MIT
